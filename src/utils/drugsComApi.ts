
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Default timeout for API calls in milliseconds
const API_TIMEOUT = 20000; // 20 seconds

/**
 * Searches for medications on Drugs.com with timeout
 * 
 * @param query Search query string
 * @returns Promise resolving to an array of medication names
 */
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.trim().length < 2) return [];
  
  try {
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
        throw new Error('Search timed out');
      })
    ]);

    if (error) {
      console.error('Error calling drugs-scraper search function:', error);
      toast.error('Error searching for medications');
      return [];
    }

    return data?.results || [];
  } catch (error) {
    console.error('Error or timeout searching Drugs.com:', error);
    toast.error(error instanceof Error && error.message.includes('timed out') 
      ? 'Search request timed out. Please try again.' 
      : 'Error searching for medications');
    return [];
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

