
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
  
  let abortController: AbortController | undefined;
  
  try {
    // Create abort controller for fetch
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
      // Remove the signal property as it's not supported in FunctionInvokeOptions
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
      toast.error('Error searching for medications');
      return [];
    }

    return data?.results || [];
  } catch (error) {
    console.error('Error or timeout searching Drugs.com:', error);
    // Determine if it's a timeout error
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
