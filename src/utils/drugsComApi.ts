
/**
 * This utility provides methods to fetch medication information from medical databases
 * This uses real medication data from our database
 */

import { MedicationInfo, medicationDatabase } from './medicationData';
import { toast } from 'sonner';

// Function to search for drug information
export const searchDrugInfo = async (query: string): Promise<MedicationInfo | null> => {
  if (!query || query.length < 2) return null;
  
  try {
    // Simulate network delay - would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Searching drug information for:', query);
    
    // Get the medication info from our database
    const info = getMedicationInfo(query);
    
    if (!info) {
      console.log('No medication information found for:', query);
      return null;
    }
    
    console.log('Found medication information:', info.name);
    return info;
  } catch (error) {
    console.error('Error searching drug information:', error);
    toast.error('Error searching drug information');
    return null;
  }
};

// Function to search for medications
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Simulate network delay - would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('Searching medications for:', query);
    
    // Return from our database
    const results = searchMedications(query);
    console.log(`Found ${results.length} medications matching "${query}"`);
    return results;
  } catch (error) {
    console.error('Error searching medications:', error);
    toast.error('Error searching medications');
    return [];
  }
};

// Function to get detailed medication information
export const getDrugsComInfo = async (medicationKey: string): Promise<MedicationInfo | null> => {
  if (!medicationKey || medicationKey.trim() === '') {
    console.error('No medication key provided or empty string');
    return null;
  }

  try {
    // Simulate network delay - would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Fetching medication info for:', medicationKey);
    
    // Return from our database
    const medicationInfo = getMedicationInfo(medicationKey);
    
    if (!medicationInfo) {
      console.error(`Medication information not found for: ${medicationKey}`);
      return null;
    }
    
    console.log(`Successfully retrieved information for: ${medicationInfo.name}`);
    return medicationInfo;
  } catch (error) {
    console.error('Error fetching medication information:', error);
    return null;
  }
};

// Generate Drugs.com URL for a medication
export const getDrugsComUrl = (medicationName: string): string => {
  if (!medicationName) return 'https://www.drugs.com/';
  return `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(medicationName)}`;
};

// Implementation using our database
const searchMedications = (query: string): string[] => {
  if (!query || query.length < 2) return [];

  // Get medication names from our database
  const normalizedQuery = query.toLowerCase().trim();
  
  // Get all keys from the medication database
  const medicationNames = Object.keys(medicationDatabase);
  
  // Filter medicines that include the search query
  return medicationNames.filter(name => 
    name.toLowerCase().includes(normalizedQuery)
  );
};

// Get detailed information for a medication
const getMedicationInfo = (medicationKey: string): MedicationInfo | null => {
  if (!medicationKey) return null;
  
  try {
    const normalizedKey = medicationKey.toLowerCase().trim();
    
    // Try to find the exact match first
    if (medicationDatabase[normalizedKey]) {
      console.log(`Found exact match for: ${normalizedKey}`);
      return {
        ...medicationDatabase[normalizedKey],
        drugsComUrl: getDrugsComUrl(normalizedKey)
      };
    }
    
    // If not found, try to find a medication that starts with the query
    const keys = Object.keys(medicationDatabase);
    for (const key of keys) {
      if (key.startsWith(normalizedKey)) {
        console.log(`Found partial match (starts with) for: ${normalizedKey} -> ${key}`);
        return {
          ...medicationDatabase[key],
          drugsComUrl: getDrugsComUrl(key)
        };
      }
    }
    
    // If still not found, try to find a medication that contains the query
    for (const key of keys) {
      if (key.includes(normalizedKey)) {
        console.log(`Found partial match (contains) for: ${normalizedKey} -> ${key}`);
        return {
          ...medicationDatabase[key],
          drugsComUrl: getDrugsComUrl(key)
        };
      }
    }
    
    // If not found in database, return null
    console.log(`No medication found for: ${medicationKey}`);
    return null;
  } catch (error) {
    console.error('Error retrieving medication information:', error);
    return null;
  }
};

// Export these functions to allow direct use when needed
export { searchMedications, getMedicationInfo };
