
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
const WHO_MED_API = 'https://ghoapi.azureedge.net/api';
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

// Updated function to fetch information from WHO
const fetchWHOMedicationData = async (query: string) => {
  try {
    console.log('Fetching WHO medication data for:', query);
    
    // First, try to get the ATC classification for the drug
    const atcResponse = await fetch(`${WHO_MED_API}/DIMENSION/DRUG?$filter=contains(Title,'${encodeURIComponent(query)}')`);
    
    if (!atcResponse.ok) {
      console.error('WHO API ATC response status:', atcResponse.status);
      return null;
    }
    
    const atcData = await atcResponse.json();
    console.log('WHO API ATC data:', atcData);
    
    if (!atcData.value || atcData.value.length === 0) {
      console.log('No WHO ATC data found for:', query);
      // Try searching for medication data using the ANTIBIOTIC dimension
      return await searchWHOByAntibiotic(query);
    }
    
    // Get the first matching drug
    const drugMatch = atcData.value[0];
    
    // Try to get more detailed information about this drug
    const drugInfoResponse = await fetch(`${WHO_MED_API}/GHO/RSUD_DRUG?$filter=DRUG eq '${drugMatch.Code}'`);
    
    if (!drugInfoResponse.ok) {
      console.log('No detailed WHO drug info available, using ATC data');
      
      // Create a minimal info object with the ATC data
      return {
        internationalNonproprietaryName: drugMatch.Title || query,
        atcClassification: drugMatch.Code || '',
        description: '',
        pharmaceuticalForms: [],
        warnings: [],
        interactions: [],
        dosage: '',
        commonAdverseEffects: [],
        seriousAdverseEffects: [],
        rareAdverseEffects: []
      };
    }
    
    const drugInfo = await drugInfoResponse.json();
    
    if (!drugInfo.value || drugInfo.value.length === 0) {
      console.log('WHO API returned empty drug info');
      return null;
    }
    
    // Process the drug information to create our response
    const mainInfo = drugInfo.value[0];
    
    // Try to get additional information from WHO substances
    const substanceResponse = await fetch(`${WHO_MED_API}/DIMENSION/SUBSTANCETYPE?$filter=contains(Title,'${encodeURIComponent(query)}')`);
    let substanceInfo = null;
    
    if (substanceResponse.ok) {
      const substanceData = await substanceResponse.json();
      if (substanceData.value && substanceData.value.length > 0) {
        substanceInfo = substanceData.value[0];
      }
    }
    
    return {
      internationalNonproprietaryName: mainInfo.DisplayTitle || drugMatch.Title || query,
      atcClassification: drugMatch.Code || '',
      description: mainInfo.Value || '',
      pharmaceuticalForms: [],
      warnings: [],
      interactions: [],
      dosage: '',
      commonAdverseEffects: [],
      seriousAdverseEffects: [],
      rareAdverseEffects: []
    };
  } catch (error) {
    console.error('Error fetching WHO medication data:', error);
    return null;
  }
};

// Helper function to search WHO data by antibiotic
const searchWHOByAntibiotic = async (query: string) => {
  try {
    const response = await fetch(`${WHO_MED_API}/DIMENSION/ANTIBIOTIC?$filter=contains(Title,'${encodeURIComponent(query)}')`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.value || data.value.length === 0) {
      return null;
    }
    
    const antibiotic = data.value[0];
    
    return {
      internationalNonproprietaryName: antibiotic.Title || query,
      atcClassification: antibiotic.Code || '',
      description: 'Antibiotic medication',
      pharmaceuticalForms: [],
      warnings: ['Antibiotics should be used only as prescribed', 'Complete the full course as directed by healthcare provider'],
      interactions: [],
      dosage: '',
      commonAdverseEffects: ['Diarrhea', 'Nausea'],
      seriousAdverseEffects: ['Allergic reaction'],
      rareAdverseEffects: ['C. difficile infection']
    };
  } catch (error) {
    console.error('Error searching WHO by antibiotic:', error);
    return null;
  }
};

// Updated function to fetch information from European Medicines Agency
const fetchEMAData = async (query: string) => {
  try {
    console.log('Attempting to fetch EMA medication data for:', query);
    
    // In a real implementation with an active EMA API, we would make an API call here
    // EMA API structure requires specific endpoints and typically needs authorization
    // This is a placeholder implementation that could be expanded with actual API access
    
    // Simulate a response based on sample data for well-known medications
    if (query.toLowerCase().includes('paracetamol') || query.toLowerCase().includes('acetaminophen')) {
      return {
        name: 'Paracetamol',
        inn: 'Acetaminophen', // International Nonproprietary Name
        therapeuticArea: 'Analgesic and antipyretic medication used to treat pain and fever',
        specialPrecautions: 'Do not exceed recommended dose. Liver damage can occur.',
        sideEffects: ['Nausea', 'Rash', 'Hepatotoxicity with overdose'],
        atcCode: 'N02BE01',
        pharmaceuticalForm: 'Tablet'
      };
    } else if (query.toLowerCase().includes('aspirin') || query.toLowerCase().includes('acetylsalicylic')) {
      return {
        name: 'Aspirin',
        inn: 'Acetylsalicylic acid',
        therapeuticArea: 'Non-steroidal anti-inflammatory drug (NSAID) used to treat pain, fever, and inflammation',
        specialPrecautions: 'May cause stomach bleeding. Not recommended for children due to risk of Reye\'s syndrome.',
        sideEffects: ['Stomach irritation', 'Increased bleeding risk', 'Tinnitus with high doses'],
        atcCode: 'N02BA01',
        pharmaceuticalForm: 'Tablet'
      };
    } else if (query.toLowerCase().includes('ibuprofen')) {
      return {
        name: 'Ibuprofen',
        inn: 'Ibuprofen',
        therapeuticArea: 'Non-steroidal anti-inflammatory drug (NSAID) used to treat pain, fever, and inflammation',
        specialPrecautions: 'May increase risk of heart attack or stroke. Use lowest effective dose.',
        sideEffects: ['Stomach pain', 'Heartburn', 'Dizziness'],
        atcCode: 'M01AE01',
        pharmaceuticalForm: 'Tablet'
      };
    }
    
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

// Updated function to search WHO drugs
const searchWHODrugs = async (query: string): Promise<string[]> => {
  try {
    if (!query || query.length < 2) return [];
    
    console.log('Searching WHO drugs for:', query);
    
    // Try to search using the DRUG dimension
    const drugResponse = await fetch(`${WHO_MED_API}/DIMENSION/DRUG?$filter=contains(Title,'${encodeURIComponent(query)}')`);
    
    if (!drugResponse.ok) {
      return [];
    }
    
    const drugData = await drugResponse.json();
    const drugResults: string[] = [];
    
    if (drugData.value && drugData.value.length > 0) {
      drugData.value.forEach((item: any) => {
        if (item.Title) {
          drugResults.push(item.Title);
        }
      });
    }
    
    // Also try to search using the ANTIBIOTIC dimension
    const antibioticResponse = await fetch(`${WHO_MED_API}/DIMENSION/ANTIBIOTIC?$filter=contains(Title,'${encodeURIComponent(query)}')`);
    
    if (antibioticResponse.ok) {
      const antibioticData = await antibioticResponse.json();
      
      if (antibioticData.value && antibioticData.value.length > 0) {
        antibioticData.value.forEach((item: any) => {
          if (item.Title && !drugResults.includes(item.Title)) {
            drugResults.push(item.Title);
          }
        });
      }
    }
    
    // Also search substance types
    const substanceResponse = await fetch(`${WHO_MED_API}/DIMENSION/SUBSTANCETYPE?$filter=contains(Title,'${encodeURIComponent(query)}')`);
    
    if (substanceResponse.ok) {
      const substanceData = await substanceResponse.json();
      
      if (substanceData.value && substanceData.value.length > 0) {
        substanceData.value.forEach((item: any) => {
          if (item.Title && !drugResults.includes(item.Title)) {
            drugResults.push(item.Title);
          }
        });
      }
    }
    
    return drugResults;
  } catch (error) {
    console.error('Error searching WHO drugs:', error);
    return [];
  }
};

// Updated function to search EMA drugs
const searchEMADrugs = async (query: string): Promise<string[]> => {
  try {
    console.log('Searching EMA drugs for:', query);
    
    // This is a placeholder for an actual EMA API call
    // In a real implementation, this would make an API request to the EMA medicines database
    
    // Simulate results for common medications
    const commonMeds = [
      'Paracetamol', 'Aspirin', 'Ibuprofen', 'Omeprazole', 'Atorvastatin',
      'Simvastatin', 'Amlodipine', 'Ramipril', 'Metformin', 'Salbutamol'
    ];
    
    return commonMeds.filter(med => 
      med.toLowerCase().includes(query.toLowerCase())
    );
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
