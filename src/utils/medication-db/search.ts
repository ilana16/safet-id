
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { enhancedMedicationSearch } from './enhancedMedicationSearch';

// Default timeout for API calls in milliseconds
const API_TIMEOUT = 10000; // 10 seconds

// Interface for RPC function results
interface DrugSearchResult {
  id: string;
  name: string;
  generic: string | null;
  drug_class: string | null;
  otc: boolean | null;
}

/**
 * Performs a search for medications in the database with enhanced fallback
 * 
 * @param query The search query
 * @returns Promise resolving to an array of medication names
 */
export const performMedicationSearch = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) {
    console.log('performMedicationSearch: Query too short, returning empty array');
    return [];
  }
  
  try {
    console.log(`performMedicationSearch: Searching for "${query}"`);
    
    // Step 1: Try to search in the medications table
    try {
      console.log('performMedicationSearch: Searching medications table');
      const { data: dbResults, error } = await supabase
        .from('medications')
        .select('name')
        .ilike('name', `%${query}%`)
        .order('search_count', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error searching medications table:', error);
      } else if (dbResults && dbResults.length > 0) {
        console.log(`performMedicationSearch: Found ${dbResults.length} results in medications table`);
        return dbResults.map(result => result.name);
      } else {
        console.log('performMedicationSearch: No results in medications table');
      }
    } catch (dbError) {
      console.error('Error searching medications table:', dbError);
    }

    // Step 2: Try to search in the drugs table using the RPC function
    try {
      console.log('performMedicationSearch: Searching drugs table');
      const { data: drugsResults, error } = await supabase
        .rpc('search_drugs', { 
          search_term: `%${query}%`, 
          result_limit: 10 
        });
      
      if (error) {
        console.error('Error in drugs search RPC:', error);
      } else if (drugsResults && drugsResults.length > 0) {
        console.log(`performMedicationSearch: Found ${drugsResults.length} results in drugs table`);
        return drugsResults.map(result => result.name);
      } else {
        console.log('performMedicationSearch: No results in drugs table');
      }
    } catch (drugsError) {
      console.error('Error searching drugs table:', drugsError);
    }
    
    // Step 3: Use enhanced local medication database as fallback
    console.log('performMedicationSearch: Using enhanced medication database search');
    return await enhancedMedicationSearch(query);
    
  } catch (error) {
    console.error('Error performing medication search:', error);
    
    // Even on error, provide results from enhanced search
    return await enhancedMedicationSearch(query);
  }
};
