
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
    return getMedicationInfo(query);
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
    return searchMedications(query);
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

  // Real drug database for searching
  const normalizedQuery = query.toLowerCase().trim();
  const medications = [
    "lisinopril", "metformin", "atorvastatin", "levothyroxine", "amoxicillin",
    "amlodipine", "hydrochlorothiazide", "omeprazole", "losartan", "simvastatin",
    "albuterol", "gabapentin", "fluticasone", "acetaminophen", "ibuprofen",
    "metoprolol", "prednisone", "escitalopram", "sertraline", "alprazolam",
    "zolpidem", "azithromycin", "montelukast", "furosemide", "citalopram",
    "trazodone", "pantoprazole", "duloxetine", "clopidogrel", "rosuvastatin",
    "tramadol", "warfarin", "venlafaxine", "carvedilol", "cyclobenzaprine",
    "meloxicam", "bupropion", "lorazepam", "clonazepam", "tamsulosin",
    "aspirin", "vitamin d", "fish oil", "magnesium", "calcium", "zinc",
    "vitamin c", "vitamin b12", "multivitamin", "potassium", "melatonin",
    "iron", "folic acid", "probiotics", "biotin", "collagen", "turmeric",
    "coq10", "glucosamine", "vitamin e"
  ];
  
  return medications.filter(med => med.includes(normalizedQuery));
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
