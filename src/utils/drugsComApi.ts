
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Default timeout for API calls in milliseconds - reduced for faster response
const API_TIMEOUT = 10000; // 10 seconds (reduced from 20)

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
    
    // Import our enhanced search function - use with timeout control
    const { enhancedMedicationSearch } = await import('./medication-db/enhancedMedicationSearch');
    
    // Create a promise that resolves with the search results or rejects after timeout
    const searchPromise = enhancedMedicationSearch(query);
    const timeoutPromise = new Promise<string[]>((_, reject) => {
      setTimeout(() => reject(new Error("Search operation timed out")), API_TIMEOUT);
    });
    
    // Return whichever promise resolves/rejects first
    return await Promise.race([searchPromise, timeoutPromise]);
    
  } catch (error) {
    console.error('Error searching medications:', error);
    toast.error('Error searching for medications');
    
    // Use fallback search in case of any error, but with a shorter timeout
    try {
      const { enhancedMedicationSearch } = await import('./medication-db/enhancedMedicationSearch');
      const results = await enhancedMedicationSearch(query);
      return results;
    } catch (fallbackError) {
      console.error('Fallback search failed:', fallbackError);
      return [];
    }
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
