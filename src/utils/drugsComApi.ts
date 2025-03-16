
/**
 * This utility provides methods to fetch medication information from Drugs.com
 * Note: This is a simulated API - in a production app, you would implement
 * actual API calls to a proper medication database or use a dedicated API
 */

import { MedicationInfo } from './medicationData';
import { toast } from 'sonner';

// Function to search for drug information
export const searchDrugInfo = async (query: string): Promise<MedicationInfo | null> => {
  if (!query || query.length < 2) return null;
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Searching drug information for:', query);
    
    // Get the medication info from our local database
    return getMedicationInfoLocal(query);
  } catch (error) {
    console.error('Error searching drug information:', error);
    toast.error('Error searching drug information');
    return null;
  }
};

// Function to search for medications, simulating a Drugs.com search
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // This would be replaced with an actual API call in production
    console.log('Searching Drugs.com for:', query);
    
    // Return from our local database for demo purposes
    // In production, this would fetch from Drugs.com's API
    return searchMedicationsLocal(query);
  } catch (error) {
    console.error('Error searching medications:', error);
    toast.error('Error searching medications from Drugs.com');
    return [];
  }
};

// Function to get detailed medication information, simulating a Drugs.com lookup
export const getDrugsComInfo = async (medicationKey: string): Promise<MedicationInfo | null> => {
  if (!medicationKey || medicationKey.trim() === '') {
    console.error('No medication key provided or empty string');
    return null;
  }

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Fetching medication info from Drugs.com for:', medicationKey);
    
    // Return from our local database for demo purposes
    // In production, this would fetch from Drugs.com's API
    const medicationInfo = getMedicationInfoLocal(medicationKey);
    
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

// Enhanced function to generate Drugs.com URL for a medication
export const getDrugsComUrl = (medicationName: string): string => {
  if (!medicationName) return 'https://www.drugs.com/';
  return `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(medicationName)}`;
};

// Local implementation using our existing data (for demo purposes)
const searchMedicationsLocal = (query: string): string[] => {
  if (!query || query.length < 2) return [];

  // Simulate more comprehensive results from Drugs.com
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

// Local implementation for detailed information (for demo purposes)
const getMedicationInfoLocal = (medicationKey: string): MedicationInfo | null => {
  if (!medicationKey) return null;
  
  try {
    // Import the medications database directly to avoid circular dependencies
    const { medicationDatabase } = require('./medicationData');
    
    const normalizedKey = medicationKey.toLowerCase().trim();
    
    // Try to find the exact match first
    if (medicationDatabase[normalizedKey]) {
      return {
        ...medicationDatabase[normalizedKey],
        drugsComUrl: getDrugsComUrl(normalizedKey)
      };
    }
    
    // If not found, try to find a medication that starts with the query
    const keys = Object.keys(medicationDatabase);
    for (const key of keys) {
      if (key.startsWith(normalizedKey)) {
        return {
          ...medicationDatabase[key],
          drugsComUrl: getDrugsComUrl(key)
        };
      }
    }
    
    // If still not found, try to find a medication that contains the query
    for (const key of keys) {
      if (key.includes(normalizedKey)) {
        return {
          ...medicationDatabase[key],
          drugsComUrl: getDrugsComUrl(key)
        };
      }
    }
    
    // Fall back to a mock entry if nothing is found
    console.log(`Creating mock entry for medication: ${medicationKey}`);
    return {
      name: medicationKey,
      genericName: `Generic ${medicationKey}`,
      drugClass: "Not specified (demo data)",
      description: `This is a simulated entry for ${medicationKey}. In a production environment, this would contain actual drug information from Drugs.com database.`,
      drugsComUrl: getDrugsComUrl(medicationKey),
      usedFor: ["Simulated condition 1", "Simulated condition 2"],
      dosage: {
        adult: "Consult your doctor for proper dosage information.",
        child: "Not recommended for children without medical supervision.",
        elderly: "May require dosage adjustment. Consult your doctor.",
        frequency: "As directed by your doctor"
      },
      sideEffects: [
        "Headache",
        "Nausea",
        "Dizziness",
        "Fatigue"
      ],
      warnings: [
        "This is a simulated warning. Do not use this information for medical decisions.",
        "Always consult with a healthcare professional before taking any medication."
      ],
      interactions: [
        "This is a simulated drug interaction warning.",
        "Actual interactions would be listed here in a production environment."
      ],
      source: "Drugs.com (Simulated)"
    };
  } catch (error) {
    console.error('Error retrieving medication information:', error);
    return null;
  }
};

// Export these local functions to allow direct use when needed
export { searchMedicationsLocal, getMedicationInfoLocal };
