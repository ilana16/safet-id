
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
      console.log('searchDrugsCom: Query too short, returning empty array');
      return [];
    }
    
    const normalizedQuery = query.trim().toLowerCase();
    console.log(`searchDrugsCom: Searching for "${normalizedQuery}"`);
    
    // Use the existing performMedicationSearch function
    const results = await performMedicationSearch(normalizedQuery);
    console.log(`searchDrugsCom: Found ${results.length} results:`, results);
    
    if (results.length === 0) {
      console.log('searchDrugsCom: No results found, using backup search');
      // Use the enhanced medication search as backup
      return await enhancedLocalSearch(normalizedQuery);
    }
    
    return results;
    
  } catch (error) {
    console.error('Error searching for medications:', error);
    toast.error('Error searching for medications');
    
    // Fallback to enhancedLocalSearch in case of error
    console.log('searchDrugsCom: Error occurred, using backup search');
    return await enhancedLocalSearch(normalizedQuery);
  }
}

/**
 * Local fallback search that doesn't require database access
 */
const enhancedLocalSearch = async (query: string): Promise<string[]> => {
  console.log('Using local fallback search for:', query);
  
  // Common medications for immediate results
  const commonMedications = [
    'Acetaminophen', 'Adderall', 'Albuterol', 'Alprazolam', 'Amoxicillin', 
    'Atorvastatin', 'Azithromycin', 'Benzonatate', 'Bupropion', 'Buspirone',
    'Cefdinir', 'Cephalexin', 'Ciprofloxacin', 'Citalopram', 'Clindamycin', 
    'Clonazepam', 'Cyclobenzaprine', 'Diazepam', 'Doxycycline', 'Duloxetine',
    'Escitalopram', 'Fluoxetine', 'Gabapentin', 'Hydrochlorothiazide', 'Hydroxyzine',
    'Ibuprofen', 'Levothyroxine', 'Lisinopril', 'Loperamide', 'Loratadine',
    'Lorazepam', 'Losartan', 'Metformin', 'Metoprolol', 'Metronidazole',
    'Naproxen', 'Omeprazole', 'Ondansetron', 'Oxycodone', 'Pantoprazole',
    'Prednisone', 'Propranolol', 'Sertraline', 'Simvastatin', 'Trazodone',
    'Vitamin D', 'Warfarin', 'Zoloft', 'Zolpidem', 'Tylenol',
    'Advil', 'Motrin', 'Lipitor', 'Prozac', 'Xanax'
  ];

  // Filter medications based on query
  const lowercaseQuery = query.toLowerCase();
  
  // First look for medications that start with the query
  const startsWithResults = commonMedications.filter(med => 
    med.toLowerCase().startsWith(lowercaseQuery)
  );
  
  // Then look for medications that include the query
  const includesResults = commonMedications.filter(med => 
    !med.toLowerCase().startsWith(lowercaseQuery) && 
    med.toLowerCase().includes(lowercaseQuery)
  );
  
  // Combine results, prioritizing exact matches
  const results = [...startsWithResults, ...includesResults];
  console.log(`Local search found ${results.length} results for "${query}"`);
  
  // Return top 15 results
  return results.slice(0, 15);
};

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
