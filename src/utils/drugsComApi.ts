
/**
 * This utility provides methods to fetch medication information from medical databases
 * This uses real medication data from our database and external APIs
 */

import { MedicationInfo, medicationDatabase } from './medicationData';
import { toast } from 'sonner';

// URLs for the APIs
const RXNORM_API_BASE = 'https://rxnav.nlm.nih.gov/REST';
const OPENFDA_API_BASE = 'https://api.fda.gov/drug';

// Function to search for drug information
export const searchDrugInfo = async (query: string): Promise<MedicationInfo | null> => {
  if (!query || query.length < 2) return null;
  
  try {
    console.log('Searching drug information for:', query);
    
    // First check our local database
    let info = getMedicationInfo(query);
    
    // If not found locally, try to fetch from external APIs
    if (!info) {
      info = await fetchExternalMedicationInfo(query);
    }
    
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

// Function to fetch medication information from external APIs
const fetchExternalMedicationInfo = async (query: string): Promise<MedicationInfo | null> => {
  try {
    // First, try to get RxNorm concept ID
    const rxnormData = await fetchRxNormData(query);
    
    if (rxnormData && rxnormData.idGroup && rxnormData.idGroup.rxnormId && rxnormData.idGroup.rxnormId.length > 0) {
      const rxcui = rxnormData.idGroup.rxnormId[0];
      console.log(`Found RxNorm ID (RxCUI): ${rxcui}`);
      
      // Get detailed information using RxCUI
      const medicationDetails = await fetchMedicationDetailsByRxCUI(rxcui);
      
      if (medicationDetails) {
        // Try to supplement with FDA information
        const fdaInfo = await fetchOpenFDAInfo(query);
        
        // Combine the information from both sources
        return {
          name: medicationDetails.name,
          genericName: medicationDetails.genericName || '',
          brandNames: medicationDetails.brandNames || [],
          className: medicationDetails.className || '',
          description: fdaInfo?.description || medicationDetails.description || '',
          dosageForms: medicationDetails.dosageForms || [],
          interactions: medicationDetails.interactions || [],
          warnings: fdaInfo?.warnings || [],
          sideEffects: fdaInfo?.sideEffects || [],
          drugsComUrl: getDrugsComUrl(medicationDetails.name)
        };
      }
    }
    
    // If RxNorm doesn't have the data, try OpenFDA as a fallback
    const fdaInfo = await fetchOpenFDAInfo(query);
    if (fdaInfo) {
      return {
        name: fdaInfo.brandName || fdaInfo.genericName || query,
        genericName: fdaInfo.genericName || '',
        brandNames: fdaInfo.brandName ? [fdaInfo.brandName] : [],
        className: fdaInfo.pharmClass || '',
        description: fdaInfo.description || '',
        dosageForms: fdaInfo.dosageForms || [],
        interactions: [],
        warnings: fdaInfo.warnings || [],
        sideEffects: fdaInfo.sideEffects || [],
        drugsComUrl: getDrugsComUrl(fdaInfo.brandName || fdaInfo.genericName || query)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching external medication data:', error);
    return null;
  }
};

// Improved function to search for medications with better matching
export const searchDrugsCom = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    console.log('Searching medications for:', query);
    
    // First, try the local database
    const localResults = searchMedications(query);
    
    // Then, search RxNorm API
    const rxnormResults = await searchRxNorm(query);
    
    // Combine and deduplicate results
    const combinedResults = [...new Set([...localResults, ...rxnormResults])];
    console.log(`Found ${combinedResults.length} medications matching "${query}"`);
    
    return combinedResults.slice(0, 15); // Limit to 15 results
  } catch (error) {
    console.error('Error searching medications:', error);
    toast.error('Error searching medications');
    return [];
  }
};

// Function to search medications from RxNorm API
const searchRxNorm = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`${RXNORM_API_BASE}/drugs?name=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.drugGroup && data.drugGroup.conceptGroup) {
      // Extract medication names from response
      const medications: string[] = [];
      
      data.drugGroup.conceptGroup.forEach((group: any) => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach((prop: any) => {
            if (prop.name) {
              medications.push(prop.name);
            }
          });
        }
      });
      
      return medications;
    }
    
    return [];
  } catch (error) {
    console.error('Error searching RxNorm:', error);
    return [];
  }
};

// Function to get RxNorm data by name
const fetchRxNormData = async (name: string) => {
  try {
    const response = await fetch(`${RXNORM_API_BASE}/rxcui.json?name=${encodeURIComponent(name)}`);
    
    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching RxNorm data:', error);
    return null;
  }
};

// Function to get detailed medication info by RxCUI
const fetchMedicationDetailsByRxCUI = async (rxcui: string) => {
  try {
    // Fetch drug details
    const detailsResponse = await fetch(`${RXNORM_API_BASE}/rxcui/${rxcui}/allrelated.json`);
    
    if (!detailsResponse.ok) {
      throw new Error(`RxNorm API error: ${detailsResponse.status}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    // Fetch drug interactions
    const interactionsResponse = await fetch(`${RXNORM_API_BASE}/interaction/interaction.json?rxcui=${rxcui}`);
    let interactionsData = null;
    
    if (interactionsResponse.ok) {
      interactionsData = await interactionsResponse.json();
    }
    
    // Extract relevant information
    const drugName = await fetchDrugName(rxcui);
    const conceptProperties = detailsData.allRelatedGroup?.conceptGroup?.find((group: any) => 
      group.tty === 'SBD' || group.tty === 'SCD'
    )?.conceptProperties || [];
    
    const dosageForms = new Set<string>();
    conceptProperties.forEach((prop: any) => {
      if (prop.tty === 'SBD' || prop.tty === 'SCD') {
        const parts = prop.name.split(' ');
        const possibleForms = ['Tablet', 'Capsule', 'Solution', 'Suspension', 'Injection', 'Cream', 'Ointment', 'Patch'];
        
        possibleForms.forEach(form => {
          if (prop.name.includes(form)) {
            dosageForms.add(form);
          }
        });
      }
    });
    
    // Extract interactions
    const interactions: string[] = [];
    if (interactionsData?.interactionTypeGroup?.[0]?.interactionType?.[0]?.interactionPair) {
      interactionsData.interactionTypeGroup[0].interactionType[0].interactionPair.forEach((pair: any) => {
        if (pair.description) {
          interactions.push(pair.description);
        }
      });
    }
    
    return {
      name: drugName || rxcui,
      dosageForms: Array.from(dosageForms),
      interactions: interactions
    };
  } catch (error) {
    console.error('Error fetching medication details:', error);
    return null;
  }
};

// Function to get drug name by RxCUI
const fetchDrugName = async (rxcui: string) => {
  try {
    const response = await fetch(`${RXNORM_API_BASE}/rxcui/${rxcui}/property.json?propName=RxNorm%20Name`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.propConceptGroup?.propConcept?.[0]?.propValue || null;
  } catch {
    return null;
  }
};

// Function to search OpenFDA for drug information
const fetchOpenFDAInfo = async (query: string) => {
  try {
    // Search the OpenFDA API for the medication
    const response = await fetch(
      `${OPENFDA_API_BASE}/label.json?search=${encodeURIComponent(query)}&limit=1`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }
    
    const result = data.results[0];
    
    return {
      genericName: result.openfda?.generic_name?.[0] || '',
      brandName: result.openfda?.brand_name?.[0] || '',
      pharmClass: result.openfda?.pharm_class_epc?.[0] || '',
      description: result.description?.[0] || '',
      dosageForms: result.dosage_forms_and_strengths?.[0]?.split(';').map((form: string) => form.trim()) || [],
      warnings: result.warnings?.[0] ? [result.warnings[0]] : [],
      sideEffects: result.adverse_reactions?.[0] ? [result.adverse_reactions[0]] : []
    };
  } catch (error) {
    console.error('Error fetching OpenFDA data:', error);
    return null;
  }
};

// Function to get detailed information for a medication with improved matching
export const getDrugsComInfo = async (medicationKey: string): Promise<MedicationInfo | null> => {
  if (!medicationKey || medicationKey.trim() === '') {
    console.error('No medication key provided or empty string');
    return null;
  }

  try {
    console.log('Fetching medication info for:', medicationKey);
    
    // First check our local database
    const medicationInfo = getMedicationInfo(medicationKey);
    
    if (medicationInfo) {
      console.log(`Successfully retrieved information for: ${medicationInfo.name} from local database`);
      return medicationInfo;
    }
    
    // If not found locally, try to fetch from external APIs
    const externalInfo = await fetchExternalMedicationInfo(medicationKey);
    
    if (externalInfo) {
      console.log(`Successfully retrieved information for: ${externalInfo.name} from external APIs`);
      return externalInfo;
    }
    
    console.error(`Medication information not found for: ${medicationKey}`);
    return null;
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
  
  // Combine results in priority order, limit to 15 results total
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
