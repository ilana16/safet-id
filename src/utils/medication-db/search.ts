
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
  
  try {
    console.log(`Performing medication search for: ${query}`);
    
    // First try to search in the database
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
    
    // If not found in database, use the Edge Function to search
    console.log('No results in database, using Edge Function to search');
    
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Search request timed out')), API_TIMEOUT);
    });
    
    // Actual API call
    const apiCallPromise = supabase.functions.invoke('drugs-scraper', {
      body: { drugName: query, action: 'search' },
    });
    
    // Race the API call against the timeout
    const { data, error } = await Promise.race([
      apiCallPromise,
      timeoutPromise.then(() => {
        throw new Error('Search request timed out');
      })
    ]);
    
    if (error) {
      console.error('Error calling drugs-scraper search function:', error);
      return [];
    }
    
    if (data && data.results) {
      console.log('Found results from scraper:', data.results.length);
      return data.results;
    }
    
    return [];
  } catch (error) {
    console.error('Error performing medication search:', error);
    toast.error(error instanceof Error && error.message.includes('timed out')
      ? 'Search request timed out. Please try again.'
      : 'Error searching for medications');
    return [];
  }
};
