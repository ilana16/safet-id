
/**
 * This utility provides methods to fetch medication information from Drugs.com
 * Note: This is a simulated API - in a production app, you would implement
 * actual API calls to a proper medication database or use a dedicated API
 */

import { MedicationInfo } from './medicationData';

// Function to search for drug information
export const searchDrugInfo = async (query: string): Promise<MedicationInfo | null> => {
  if (!query || query.length < 2) return null;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Searching drug information for:', query);
  
  // Get the medication info from our local database
  return getMedicationInfoLocal(query);
};

// Function to search for medications, simulating a Drugs.com search
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // This would be replaced with an actual API call in production
  console.log('Searching Drugs.com for:', query);
  
  // Return from our local database for demo purposes
  // In production, this would fetch from Drugs.com's API
  return searchMedicationsLocal(query);
};

// Function to get detailed medication information, simulating a Drugs.com lookup
export const getDrugsComInfo = async (medicationKey: string): Promise<MedicationInfo | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Fetching medication info from Drugs.com for:', medicationKey);
  
  // Return from our local database for demo purposes
  // In production, this would fetch from Drugs.com's API
  return getMedicationInfoLocal(medicationKey);
};

// Local implementation using our existing data (for demo purposes)
const searchMedicationsLocal = (query: string): string[] => {
  if (!query || query.length < 2) return [];

  // Simulate more comprehensive results from Drugs.com
  const normalizedQuery = query.toLowerCase();
  const medications = [
    "lisinopril", "metformin", "atorvastatin", "levothyroxine", "amoxicillin",
    "amlodipine", "hydrochlorothiazide", "omeprazole", "losartan", "simvastatin",
    "albuterol", "gabapentin", "fluticasone", "acetaminophen", "ibuprofen"
  ];
  
  return medications.filter(med => med.includes(normalizedQuery));
};

// Local implementation for detailed information (for demo purposes)
const getMedicationInfoLocal = (medicationKey: string): MedicationInfo | null => {
  // Import the medications database directly to avoid circular dependencies
  const { medicationDatabase } = require('./medicationData');
  return medicationDatabase[medicationKey.toLowerCase()] || null;
};

// Export these local functions to allow direct use when needed
export { searchMedicationsLocal, getMedicationInfoLocal };
