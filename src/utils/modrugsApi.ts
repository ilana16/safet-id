
import { MedicationInfo } from './medicationData.d';
import { toast } from 'sonner';

/**
 * Performs a search in the Drugs.com scraper for medications matching the query
 * 
 * @param query The search query
 * @returns Promise resolving to an array of medication names
 */
export const performMedicationSearch = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Import search function from the Drugs.com scraper API
    const { performDrugsComScraperSearch } = await import('./elsevierApi');
    
    // Search the Drugs.com scraper
    const results = await performDrugsComScraperSearch(query);
    
    // Sort results alphabetically
    return results.sort((a, b) => a.localeCompare(b));
    
  } catch (error) {
    console.error('Error performing medication search:', error);
    toast.error('Error searching medications');
    return [];
  }
};

/**
 * Fetch medication information from Drugs.com scraper
 * 
 * @param drugName Name of the drug to look up
 * @returns Promise resolving to MedicationInfo object or null if not found
 */
export const fetchMedicationInfo = async (drugName: string): Promise<MedicationInfo | null> => {
  if (!drugName || drugName.trim() === '') {
    return null;
  }

  try {
    console.log('Fetching medication info using Drugs.com scraper for:', drugName);
    
    // Import the function to fetch drug info from Drugs.com scraper
    const { fetchDrugsComScraperInfo } = await import('./elsevierApi');
    
    // Fetch the medication information
    return await fetchDrugsComScraperInfo(drugName);
    
  } catch (error) {
    console.error('Error fetching medication information:', error);
    toast.error('Error fetching medication information');
    return null;
  }
};
