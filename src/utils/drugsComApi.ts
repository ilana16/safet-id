/**
 * This utility provides methods to fetch medication information from medical databases
 * This uses real medication data from our database and external APIs including international sources
 */

import { MedicationInfo, medicationDatabase } from './medicationData';
import { toast } from 'sonner';

// URLs for the APIs
const RXNORM_API_BASE = 'https://rxnav.nlm.nih.gov/REST';
const OPENFDA_API_BASE = 'https://api.fda.gov/drug';
const DAILYMED_API_BASE = 'https://dailymed.nlm.nih.gov/dailymed/services';
const NIH_DRUG_API = 'https://druginfo.nlm.nih.gov/drugportal/drug';
const WHO_MED_API = 'https://mednet-communities.net/inn/api/v1';
const EMA_API = 'https://www.ema.europa.eu/en/medicines/api';

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
        
        // Try to get international data from WHO
        const whoData = await fetchWHOMedicationData(query);
        
        // Combine the information from all sources
        return {
          name: medicationDetails.name,
          genericName: fdaInfo?.genericName || whoData?.internationalNonproprietaryName || '',
          // Use the first brand name if available
          description: fdaInfo?.description || whoData?.description || '',
          dosage: medicationDetails.dosage || {
            adult: '',
            child: '',
            elderly: '',
          },
          interactions: medicationDetails.interactions || [],
          warnings: fdaInfo?.warnings || whoData?.warnings || [],
          sideEffects: {
            common: fdaInfo?.sideEffects || [],
            serious: whoData?.seriousAdverseEffects || [],
            rare: []
          },
          drugsComUrl: getDrugsComUrl(medicationDetails.name),
          drugClass: fdaInfo?.pharmClass || whoData?.atcClassification || '',
          forms: medicationDetails.dosageForms || []
        };
      }
    }
    
    // If RxNorm doesn't have the data, try OpenFDA as a fallback
    const fdaInfo = await fetchOpenFDAInfo(query);
    if (fdaInfo) {
      return {
        name: fdaInfo.brandName || fdaInfo.genericName || query,
        genericName: fdaInfo.genericName || '',
        description: fdaInfo.description || '',
        dosage: {
          adult: '',
          child: '',
          elderly: '',
        },
        interactions: [],
        warnings: fdaInfo.warnings || [],
        sideEffects: {
          common: fdaInfo.sideEffects || [],
          serious: [],
          rare: []
        },
        drugsComUrl: getDrugsComUrl(fdaInfo.brandName || fdaInfo.genericName || query),
        drugClass: fdaInfo.pharmClass || '',
        forms: fdaInfo.dosageForms || []
      };
    }
    
    // Try DailyMed as another option
    const dailyMedInfo = await fetchDailyMedInfo(query);
    if (dailyMedInfo) {
      return dailyMedInfo;
    }
    
    // Try WHO/EMA as international sources
    const whoInfo = await fetchWHOMedicationData(query);
    if (whoInfo) {
      return {
        name: whoInfo.internationalNonproprietaryName || query,
        genericName: whoInfo.internationalNonproprietaryName || '',
        description: whoInfo.description || '',
        dosage: {
          adult: whoInfo.dosage || '',
          child: '',
          elderly: '',
        },
        interactions: whoInfo.interactions || [],
        warnings: whoInfo.warnings || [],
        sideEffects: {
          common: whoInfo.commonAdverseEffects || [],
          serious: whoInfo.seriousAdverseEffects || [],
          rare: whoInfo.rareAdverseEffects || []
        },
        drugsComUrl: getDrugsComUrl(query),
        drugClass: whoInfo.atcClassification || '',
        forms: whoInfo.pharmaceuticalForms || []
      };
    }
    
    // Try the European Medicines Agency (EMA)
    const emaInfo = await fetchEMAData(query);
    if (emaInfo) {
      return {
        name: emaInfo.name || query,
        genericName: emaInfo.inn || '',
        description: emaInfo.therapeuticArea || '',
        dosage: {
          adult: '',
          child: '',
          elderly: '',
        },
        interactions: [],
        warnings: emaInfo.specialPrecautions ? [emaInfo.specialPrecautions] : [],
        sideEffects: {
          common: emaInfo.sideEffects || [],
          serious: [],
          rare: []
        },
        drugsComUrl: getDrugsComUrl(query),
        drugClass: emaInfo.atcCode || '',
        forms: emaInfo.pharmaceuticalForm ? [emaInfo.pharmaceuticalForm] : []
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching external medication data:', error);
    return null;
  }
};

// New function to fetch information from WHO
const fetchWHOMedicationData = async (query: string) => {
  try {
    // Note: This is a placeholder as direct WHO API access requires registration
    // Most WHO data is accessible through partner databases or commercial APIs
    console.log('Attempting to fetch WHO medication data for:', query);
    
    // For now, return a simulated response to show the structure
    // In a real implementation, this would make an actual API call
    return null;
  } catch (error) {
    console.error('Error fetching WHO medication data:', error);
    return null;
  }
};

// New function to fetch information from European Medicines Agency
const fetchEMAData = async (query: string) => {
  try {
    // Note: This is a placeholder as EMA API structure may vary
    console.log('Attempting to fetch EMA medication data for:', query);
    
    // In a real implementation, this would make an actual API call
    return null;
  } catch (error) {
    console.error('Error fetching EMA medication data:', error);
    return null;
  }
};

// New function to fetch information from DailyMed
const fetchDailyMedInfo = async (query: string): Promise<MedicationInfo | null> => {
  try {
    // Search for the drug in DailyMed
    const searchResponse = await fetch(`${DAILYMED_API_BASE}/v2/spls.json?drug_name=${encodeURIComponent(query)}&pagesize=1`);
    
    if (!searchResponse.ok) {
      return null;
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.data || searchData.data.length === 0) {
      return null;
    }
    
    const setid = searchData.data[0].setid;
    
    // Get detailed information using the set ID
    const infoResponse = await fetch(`${DAILYMED_API_BASE}/v2/spls/${setid}.json`);
    
    if (!infoResponse.ok) {
      return null;
    }
    
    const infoData = await infoResponse.json();
    
    if (!infoData) {
      return null;
    }
    
    // Extract relevant information
    const extractedInfo: MedicationInfo = {
      name: query,
      genericName: infoData.activemoiety || '',
      description: infoData.indications_and_usage || '',
      dosage: {
        adult: '',
        child: '',
        elderly: '',
      },
      interactions: infoData.drug_interactions ? [infoData.drug_interactions] : [],
      warnings: infoData.warnings ? [infoData.warnings] : [],
      sideEffects: {
        common: infoData.adverse_reactions ? [infoData.adverse_reactions] : [],
        serious: infoData.warnings_and_cautions ? [infoData.warnings_and_cautions] : [],
        rare: []
      },
      drugsComUrl: getDrugsComUrl(query),
      drugClass: '',
      forms: infoData.dosage_forms_and_strengths ? [infoData.dosage_forms_and_strengths] : []
    };
    
    return extractedInfo;
  } catch (error) {
    console.error('Error fetching DailyMed data:', error);
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
    
    // Also search DailyMed for more comprehensive results
    const dailyMedResults = await searchDailyMed(query);
    
    // Search international databases
    const whoResults = await searchWHODrugs(query);
    const emaResults = await searchEMADrugs(query);
    
    // Combine and deduplicate results
    const combinedResults = [...new Set([
      ...localResults, 
      ...rxnormResults, 
      ...dailyMedResults,
      ...whoResults,
      ...emaResults
    ])];
    
    console.log(`Found ${combinedResults.length} medications matching "${query}"`);
    
    return combinedResults.slice(0, 15); // Limit to 15 results
  } catch (error) {
    console.error('Error searching medications:', error);
    toast.error('Error searching medications');
    return [];
  }
};

// New function to search WHO drugs
const searchWHODrugs = async (query: string): Promise<string[]> => {
  try {
    // This is a placeholder for WHO drug search 
    // Actual implementation would depend on specific API documentation
    console.log('Searching WHO drugs for:', query);
    
    // In a real implementation, this would call the WHO API
    return [];
  } catch (error) {
    console.error('Error searching WHO drugs:', error);
    return [];
  }
};

// New function to search EMA drugs
const searchEMADrugs = async (query: string): Promise<string[]> => {
  try {
    // This is a placeholder for EMA drug search
    // Actual implementation would depend on specific API documentation
    console.log('Searching EMA drugs for:', query);
    
    // In a real implementation, this would call the EMA API
    return [];
  } catch (error) {
    console.error('Error searching EMA drugs:', error);
    return [];
  }
};

// New function to search DailyMed
const searchDailyMed = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`${DAILYMED_API_BASE}/v2/spls.json?drug_name=${encodeURIComponent(query)}&pagesize=10`);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return [];
    }
    
    // Extract medication names
    const medications: string[] = [];
    
    data.data.forEach((item: any) => {
      if (item.drug_name) {
        medications.push(item.drug_name);
      }
    });
    
    return medications;
  } catch (error) {
    console.error('Error searching DailyMed:', error);
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
    
    // Fetch drug properties from the NIH portal for more details
    const propertyResponse = await fetch(`${NIH_DRUG_API}/names/${rxcui}`);
    let propertyData = null;
    
    if (propertyResponse.ok) {
      propertyData = await propertyResponse.json();
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
      interactions: interactions,
      dosage: {
        adult: '',
        child: '',
        elderly: '',
      },
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
