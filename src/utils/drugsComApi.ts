
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
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

// Improved function to search for medications with better matching
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Simulate network delay - would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('Searching medications for:', query);
    
    // Return from our database with enhanced search
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
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

// Improved implementation for searching medications with better matching
const searchMedications = (query: string): string[] => {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const medicationNames = Object.keys(medicationDatabase);
  
  // Create prioritized results:
  // 1. Exact matches
  // 2. Starts with matches
  // 3. Contains matches
  const exactMatches: string[] = [];
  const startsWithMatches: string[] = [];
  const containsMatches: string[] = [];
  
  medicationNames.forEach(name => {
    const normalizedName = name.toLowerCase();
    
    if (normalizedName === normalizedQuery) {
      exactMatches.push(name);
    } else if (normalizedName.startsWith(normalizedQuery)) {
      startsWithMatches.push(name);
    } else if (normalizedName.includes(normalizedQuery)) {
      containsMatches.push(name);
    }
  });
  
  // Combine results in priority order, limit to 10 results total
  return [...exactMatches, ...startsWithMatches, ...containsMatches].slice(0, 15);
};

// Get detailed information for a medication with improved matching
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
      if (key.toLowerCase().startsWith(normalizedKey)) {
        console.log(`Found partial match (starts with) for: ${normalizedKey} -> ${key}`);
        return {
          ...medicationDatabase[key],
          drugsComUrl: getDrugsComUrl(key)
        };
      }
    }
    
    // If still not found, try to find a medication that contains the query
    for (const key of keys) {
      if (key.toLowerCase().includes(normalizedKey)) {
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
