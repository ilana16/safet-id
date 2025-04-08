
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Default timeout for API calls in milliseconds - reduced for faster response
const API_TIMEOUT = 5000; // 5 seconds (reduced from 10)

/**
 * Searches for medications using multiple data sources in sequence
 * 
 * @param query Search query string
 * @returns Promise resolving to an array of medication names
 */
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    // Step 1: Try to search in the medications table
    try {
      console.log('Searching medication database for:', query);
      const { data: dbResults } = await supabase
        .from('medications')
        .select('name')
        .ilike('name', `%${query}%`)
        .order('search_count', { ascending: false })
        .limit(10);
      
      if (dbResults && dbResults.length > 0) {
        console.log('Found results in medications table:', dbResults.length);
        return dbResults.map(result => result.name);
      }
    } catch (dbError) {
      console.error('Error searching medications table:', dbError);
    }
    
    // Step 2: Try to search in the new drugs table
    try {
      console.log('Searching drugs table for:', query);
      const { data: drugsResults } = await supabase
        .from('drugs')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(10);
      
      if (drugsResults && drugsResults.length > 0) {
        console.log('Found results in drugs table:', drugsResults.length);
        return drugsResults.map(result => result.name);
      }
    } catch (drugsError) {
      console.error('Error searching drugs table:', drugsError);
    }
    
    // Step 3: Use enhanced local medication database as fallback
    console.log('Using enhanced medication database for:', query);
    
    // Import our enhanced search function - use with timeout control
    const { enhancedMedicationSearch } = await import('./medication-db/enhancedMedicationSearch');
    
    // Create a promise that resolves with the search results or rejects after timeout
    const searchPromise = enhancedMedicationSearch(query);
    const timeoutPromise = new Promise<string[]>((_, reject) => {
      setTimeout(() => reject(new Error("Search operation timed out")), API_TIMEOUT);
    });
    
    try {
      // Return whichever promise resolves/rejects first
      return await Promise.race([searchPromise, timeoutPromise]);
    } catch (timeoutError) {
      console.error('Search timed out, using direct method:', timeoutError);
      
      // If timeout occurred, try a more direct method with exact matching
      const { enhancedMedicationSearch } = await import('./medication-db/enhancedMedicationSearch');
      const directResults = await enhancedMedicationSearch(query);
      
      if (directResults.length > 0) {
        return directResults;
      }
      
      // If still no results, throw an error to trigger the fallback
      throw new Error("Search operation timed out");
    }
  } catch (error) {
    console.error('Error searching medications:', error);
    
    // Use fallback search in case of any error, but with a shorter timeout
    try {
      const { enhancedMedicationSearch } = await import('./medication-db/enhancedMedicationSearch');
      const fallbackTimeoutPromise = new Promise<string[]>((_, reject) => {
        setTimeout(() => reject(new Error("Fallback search timed out")), 3000);
      });
      
      // Use race with a shorter timeout for fallback search
      return await Promise.race([enhancedMedicationSearch(query), fallbackTimeoutPromise]);
    } catch (fallbackError) {
      console.error('Fallback search failed:', fallbackError);
      
      // Last resort: try to match just the beginning of words
      try {
        const { enhancedMedicationSearch } = await import('./medication-db/enhancedMedicationSearch');
        const emergencyResults = await enhancedMedicationSearch(query.substring(0, 3));
        return emergencyResults.filter(med => med.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
      } catch (e) {
        return [];
      }
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
