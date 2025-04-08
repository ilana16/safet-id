
import { supabase } from '@/integrations/supabase/client';

/**
 * Searches for medications on Drugs.com
 * 
 * @param query Search query string
 * @returns Promise resolving to an array of medication names
 */
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const { data, error } = await supabase.functions.invoke('drugs-scraper', {
      body: { drugName: query, action: 'search' },
    });

    if (error) {
      console.error('Error calling drugs-scraper search function:', error);
      return [];
    }

    return data?.results || [];
  } catch (error) {
    console.error('Error searching Drugs.com:', error);
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
  
  const normalizedName = medicationName.toLowerCase().replace(/\s+/g, '-');
  return `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(medicationName)}`;
};
