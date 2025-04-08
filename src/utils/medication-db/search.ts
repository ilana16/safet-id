
import { supabase } from '@/integrations/supabase/client';

/**
 * Performs a search for medications in the database or external API
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
    
    const { data, error } = await supabase.functions.invoke('drugs-scraper', {
      body: { drugName: query, action: 'search' },
    });
    
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
    return [];
  }
};
