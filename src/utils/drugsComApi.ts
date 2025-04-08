
import { toast } from 'sonner';
import { performMedicationSearch } from './medication-db';

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
      return [];
    }
    
    const normalizedQuery = query.trim();
    console.log(`searchDrugsCom: Searching for "${normalizedQuery}"`);
    
    // Use the existing performMedicationSearch function
    const results = await performMedicationSearch(normalizedQuery);
    console.log(`searchDrugsCom: Found ${results.length} results`);
    return results;
    
  } catch (error) {
    console.error('Error searching for medications:', error);
    toast.error('Error searching for medications');
    return [];
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
