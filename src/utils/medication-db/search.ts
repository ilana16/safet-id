
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Default timeout for API calls in milliseconds
const API_TIMEOUT = 15000; // 15 seconds

/**
 * Performs a search for medications in the database or external API with timeout
 * 
 * @param query The search query
 * @returns Promise resolving to an array of medication names
 */
export const performMedicationSearch = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  let abortController: AbortController | undefined;
  
  try {
    console.log(`Performing medication search for: ${query}`);
    
    // First try to search in the database
    try {
      const { data: dbResults } = await supabase
        .from('medications')
        .select('name')
        .ilike('name', `%${query}%`)
        .order('search_count', { ascending: false })
        .limit(10);
      
      if (dbResults && dbResults.length > 0) {
        console.log('Found results in database:', dbResults.length);
        return dbResults.map(result => result.name);
      }
    } catch (dbError) {
      console.error('Error searching database:', dbError);
      // Continue to API search even if database search fails
    }
    
    // If not found in database, use the Edge Function to search
    console.log('No results in database, using Edge Function to search');
    
    // Create abort controller for the fetch
    abortController = new AbortController();
    
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        if (abortController) abortController.abort();
        reject(new Error('Search request timed out'));
      }, API_TIMEOUT);
    });
    
    // Actual API call
    const apiCallPromise = supabase.functions.invoke('drugs-scraper', {
      body: { drugName: query, action: 'search' },
      signal: abortController.signal,
    });
    
    // Race the API call against the timeout
    const { data, error } = await Promise.race([
      apiCallPromise,
      timeoutPromise
    ]);
    
    if (error) {
      console.error('Error calling drugs-scraper search function:', error);
      if (error.message?.includes('abort') || error.message?.includes('time')) {
        throw new Error('Search request timed out');
      }
      return [];
    }
    
    if (data && data.results) {
      console.log('Found results from scraper:', data.results.length);
      return data.results;
    }
    
    return [];
  } catch (error) {
    console.error('Error performing medication search:', error);
    const isTimeout = error instanceof Error && 
      (error.message.includes('timed out') || 
       error.message.includes('abort') ||
       error.name === 'AbortError');
       
    toast.error(isTimeout
      ? 'Search request timed out. Please try again.'
      : 'Error searching for medications');
    return [];
  } finally {
    // Clean up abort controller if needed
    if (abortController) {
      try {
        abortController.abort();
      } catch (e) {
        // Ignore errors from aborting after completion
      }
    }
  }
};
