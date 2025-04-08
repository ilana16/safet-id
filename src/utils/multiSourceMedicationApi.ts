
import { toast } from '@/lib/toast';
import { MedicationInfo } from './medicationData.d';
import { supabase } from '@/integrations/supabase/client';

interface RxNormConcept {
  rxcui: string;
  name: string;
  synonym?: string;
  tty: string; // Term type
  language?: string;
}

interface ATCClassification {
  code: string;
  name: string;
  level: number;
}

interface OpenFDADrugInfo {
  generic_name?: string[];
  brand_name?: string[];
  substance_name?: string[];
  manufacturer_name?: string[];
  product_type?: string[];
  route?: string[];
  dosage_form?: string[];
}

// RxNorm API for drug information
export const searchRxNorm = async (query: string): Promise<RxNormConcept[]> => {
  if (query.length < 2) return [];
  
  try {
    const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`RxNorm API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data?.drugGroup?.conceptGroup) {
      const concepts: RxNormConcept[] = [];
      
      data.drugGroup.conceptGroup.forEach((group: any) => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach((prop: any) => {
            concepts.push({
              rxcui: prop.rxcui,
              name: prop.name,
              synonym: prop.synonym,
              tty: prop.tty,
              language: prop.language
            });
          });
        }
      });
      
      return concepts;
    }
    
    return [];
  } catch (error) {
    console.error('Error searching RxNorm:', error);
    return [];
  }
};

// Get more detailed drug information from RxNorm
export const getRxNormDetails = async (rxcui: string): Promise<any> => {
  try {
    const response = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allProperties.json?prop=all`);
    
    if (!response.ok) {
      throw new Error(`RxNorm API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching RxNorm details:', error);
    return null;
  }
};

// OpenFDA API for drug information
export const searchOpenFDA = async (query: string): Promise<OpenFDADrugInfo[]> => {
  try {
    const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(query)}" OR openfda.brand_name:"${encodeURIComponent(query)}"&limit=5`
    );
    
    if (!response.ok) {
      throw new Error(`OpenFDA API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data?.results) {
      return data.results.map((result: any) => result.openfda || {});
    }
    
    return [];
  } catch (error) {
    console.error('Error searching OpenFDA:', error);
    return [];
  }
};

// WHO ATC classification for drug information (simulated as there's no public API)
export const getATCClassification = async (drugName: string): Promise<ATCClassification[]> => {
  try {
    // This would be a real API call to a WHO ATC service
    // For now, we'll simulate by checking if it exists in our database
    const { data, error } = await supabase
      .from('medications')
      .select('drug_class')
      .ilike('name', `%${drugName}%`)
      .limit(1)
      .single();
    
    if (error || !data) {
      console.log('ATC information not found in database');
      return [];
    }
    
    // Return simulated ATC classification based on drug class
    return [
      {
        code: 'N05A', // Example ATC code
        name: data.drug_class || 'Unknown',
        level: 3
      }
    ];
  } catch (error) {
    console.error('Error getting ATC classification:', error);
    return [];
  }
};

// Combined drug search from multiple sources
export const multiSourceMedicationSearch = async (query: string): Promise<string[]> => {
  try {
    // First try RxNorm
    const rxNormResults = await searchRxNorm(query);
    
    // Then try OpenFDA
    const openFDAResults = await searchOpenFDA(query);
    
    // Combine results from both sources with deduplication
    const combinedResults = new Set<string>();
    
    // Add RxNorm results
    rxNormResults.forEach(result => {
      combinedResults.add(result.name);
    });
    
    // Add OpenFDA results
    openFDAResults.forEach(result => {
      if (result.generic_name) {
        result.generic_name.forEach(name => combinedResults.add(name));
      }
      if (result.brand_name) {
        result.brand_name.forEach(name => combinedResults.add(name));
      }
    });
    
    return Array.from(combinedResults);
  } catch (error) {
    console.error('Error in multi-source medication search:', error);
    toast.error('Error searching medications');
    return [];
  }
};

// Enhanced drug details from multiple sources
export const getEnhancedDrugDetails = async (drugName: string): Promise<MedicationInfo | null> => {
  try {
    // Start with our primary source (drugs.com via existing API)
    const { getDrugDetails } = await import('./drugsComApi');
    let medicationInfo = await getDrugDetails(drugName.toLowerCase().replace(/\s+/g, '-'));
    
    if (!medicationInfo) {
      medicationInfo = {
        name: drugName,
        genericName: '',
        description: '',
        drugClass: '',
        usedFor: [],
        sideEffects: { common: [], serious: [], rare: [] },
        warnings: [],
        interactions: [],
        prescriptionOnly: false,
        source: 'Multi-source API'
      };
    }
    
    // Try to enhance with RxNorm data
    const rxNormResults = await searchRxNorm(drugName);
    if (rxNormResults.length > 0) {
      const rxcui = rxNormResults[0].rxcui;
      const rxNormDetails = await getRxNormDetails(rxcui);
      
      if (rxNormDetails?.propConceptGroup?.propConcept) {
        const props = rxNormDetails.propConceptGroup.propConcept;
        
        // Extract relevant information
        props.forEach((prop: any) => {
          if (prop.propCategory === 'ATTRIBUTES' && prop.propName === 'RxNorm Prescription Status' && prop.propValue) {
            medicationInfo!.prescriptionOnly = prop.propValue.includes('Prescription');
          }
        });
      }
      
      // Add source information
      medicationInfo.source = `${medicationInfo.source}, RxNorm`;
    }
    
    // Try to enhance with OpenFDA data
    const openFDAResults = await searchOpenFDA(drugName);
    if (openFDAResults.length > 0) {
      const fdaInfo = openFDAResults[0];
      
      // Add manufacturer if available
      if (fdaInfo.manufacturer_name && fdaInfo.manufacturer_name.length > 0) {
        medicationInfo.manufacturer = fdaInfo.manufacturer_name[0];
      }
      
      // Add dosage forms if available
      if (fdaInfo.dosage_form && fdaInfo.dosage_form.length > 0) {
        medicationInfo.forms = fdaInfo.dosage_form;
      }
      
      // Add source information
      medicationInfo.source = `${medicationInfo.source}, OpenFDA`;
    }
    
    // Get ATC classification
    const atcClasses = await getATCClassification(drugName);
    if (atcClasses.length > 0) {
      medicationInfo.atcClassification = atcClasses;
      medicationInfo.source = `${medicationInfo.source}, WHO ATC`;
    }
    
    return medicationInfo;
  } catch (error) {
    console.error('Error getting enhanced drug details:', error);
    toast.error('Error retrieving enhanced medication details');
    return null;
  }
};
