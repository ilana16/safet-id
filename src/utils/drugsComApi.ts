
import { toast } from 'sonner';
import { performMedicationSearch } from './medication-db/search';
import { enhancedMedicationSearch } from './medication-db/enhancedMedicationSearch';

/**
 * Basic search function for Drugs.com
 * This is a wrapper around the performMedicationSearch function
 * 
 * @param query Search query for medications
 * @returns Array of medication names
 */
export async function searchDrugsCom(query: string): Promise<string[]> {
  try {
    if (!query || query.trim().length < 2) {
      console.log('searchDrugsCom: Query too short, returning empty array');
      return [];
    }
    
    const normalizedQuery = query.trim().toLowerCase();
    console.log(`searchDrugsCom: Searching for "${normalizedQuery}"`);
    
    // Use the existing performMedicationSearch function
    const results = await performMedicationSearch(normalizedQuery);
    console.log(`searchDrugsCom: Found ${results.length} results:`, results);
    
    if (results.length === 0) {
      console.log('searchDrugsCom: No results found, using enhanced local search');
      // Use the enhanced medication search as backup
      return await enhancedMedicationSearch(normalizedQuery);
    }
    
    return results;
    
  } catch (error) {
    console.error('Error searching for medications:', error);
    toast.error('Error searching for medications');
    
    // Fallback to enhancedLocalSearch in case of error
    console.log('searchDrugsCom: Error occurred, using backup search');
    return await enhancedMedicationSearch(query.trim().toLowerCase());
  }
}

/**
 * Gets the Drugs.com URL for a medication
 * @param medicationName - The name of the medication
 * @returns The URL for the medication on Drugs.com
 */
export const getDrugsComUrl = (medicationName: string): string => {
  if (!medicationName) return '';
  const formattedName = medicationName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `https://www.drugs.com/${formattedName}.html`;
};
