
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Default timeout for API calls in milliseconds
const API_TIMEOUT = 20000; // 20 seconds

/**
 * Searches for medications using database first, with fallback to common medications list
 * 
 * @param query Search query string
 * @returns Promise resolving to an array of medication names
 */
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    // First try to search in the database
    try {
      console.log('Searching medication database for:', query);
      const { data: dbResults } = await supabase
        .from('medications')
        .select('name')
        .ilike('name', `%${query}%`)
        .order('search_count', { ascending: false })
        .limit(15);
      
      if (dbResults && dbResults.length > 0) {
        console.log('Found results in database:', dbResults.length);
        return dbResults.map(result => result.name);
      }
    } catch (dbError) {
      console.error('Error searching database:', dbError);
    }
    
    // Due to Drugs.com restrictions, we use our comprehensive medication database
    console.log('Using internal medication database for:', query);
    
    // Import our enhanced search function
    const { enhancedMedicationSearch } = await import('./medication-db/enhancedMedicationSearch');
    return await enhancedMedicationSearch(query);
    
  } catch (error) {
    console.error('Error searching medications:', error);
    toast.error('Error searching for medications');
    
    // Use fallback search in case of any error
    const { enhancedMedicationSearch } = await import('./medication-db/enhancedMedicationSearch');
    return await enhancedMedicationSearch(query);
  }
};

/**
 * Generates a URL for a medication on Drugs.com
 * 
 * @param medicationName Name of the medication
 * @returns URL string for the medication on Drugs.com
 */
export const getDrugsComUrl = (medicationName: string): string => {
  if (!medicationName) return 'https://www.drugs.com/';
  
  return `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(medicationName)}`;
};
