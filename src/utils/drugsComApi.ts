
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from './medicationData.d';

const EDGE_FUNCTION_URL = "https://rlirtjxgwstjzraovntf.supabase.co/functions/v1/drugs-api";

interface DrugSearchResult {
  id: string;
  name: string;
}

export const searchDrugsCom = async (query: string): Promise<DrugSearchResult[]> => {
  if (query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    if (data.results && Array.isArray(data.results)) {
      return data.results.map((drug: any) => ({
        id: drug.id || drug.name.toLowerCase().replace(/\s+/g, '-'),
        name: drug.name
      }));
    }
    
    return fallbackSearch(query);
    
  } catch (error) {
    console.error('Error searching medications via API:', error);
    return fallbackSearch(query);
  }
};

const fallbackSearch = (query: string): DrugSearchResult[] => {
  const commonMedications = [
    'Acetaminophen', 'Adderall', 'Albuterol', 'Alprazolam', 'Amoxicillin', 
    'Atorvastatin', 'Azithromycin', 'Benzonatate', 'Bupropion', 'Buspirone',
    'Cefdinir', 'Cephalexin', 'Ciprofloxacin', 'Citalopram', 'Clindamycin',
    'Cyclobenzaprine', 'Cymbalta', 'Doxycycline', 'Dupixent', 'Eliquis',
    'Entresto', 'Entyvio', 'Farxiga', 'Fentanyl', 'Gabapentin',
    'Humira', 'Hydrochlorothiazide', 'Hydroxychloroquine', 'Ibuprofen', 'Imbruvica',
    'Januvia', 'Jardiance', 'Kevzara', 'Keytruda', 'Levemir',
    'Levothyroxine', 'Lexapro', 'Lisinopril', 'Lofexidine', 'Loratadine',
    'Losartan', 'Lyrica', 'Metformin', 'Methotrexate', 'Metoprolol',
    'Naloxone', 'Naltrexone', 'Namzaric', 'Naproxen', 'Narcan',
    'Omeprazole', 'Onpattro', 'Opdivo', 'Ozempic', 'Pantoprazole',
    'Prednisone', 'Proair', 'Prozac', 'Qvar', 'Remicade',
    'Rybelsus', 'Saxenda', 'Seroquel', 'Sertraline', 'Simvastatin',
    'Skyrizi', 'Spiriva', 'Stelara', 'Stiolto', 'Suboxone',
    'Symbicort', 'Synthroid', 'Tamiflu', 'Tecfidera', 'Toujeo',
    'Tramadol', 'Trelegy', 'Trintellix', 'Trulicity', 'Tylenol',
    'Uceris', 'Ulesfia', 'Uloric', 'Ultane', 'Ultram',
    'Valacyclovir', 'Valium', 'Vascepa', 'Venlafaxine', 'Ventolin',
    'Viagra', 'Viibryd', 'Vimpat', 'Vistaril', 'Vraylar',
    'Vyvanse', 'Wellbutrin', 'Wixela', 'Xanax', 'Xarelto',
    'Xeljanz', 'Xolair', 'Xyrem', 'Yervoy', 'Yupelri',
    'Zanaflex', 'Zantac', 'Zarxio', 'Zelnorm', 'Zepatier',
    'Zithromax', 'Zofran', 'Zohydro', 'Zoloft', 'Zomig'
  ];
  
  const results = commonMedications
    .filter(med => med.toLowerCase().includes(query.toLowerCase()))
    .map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name
    }));
  
  return results.sort((a, b) => {
    const aLower = a.name.toLowerCase();
    const bLower = b.name.toLowerCase();
    const qLower = query.toLowerCase();
    
    if (aLower === qLower && bLower !== qLower) return -1;
    if (aLower !== qLower && bLower === qLower) return 1;
    
    if (aLower.startsWith(qLower) && !bLower.startsWith(qLower)) return -1;
    if (!aLower.startsWith(qLower) && bLower.startsWith(qLower)) return 1;
    
    return a.name.localeCompare(b.name);
  });
};

export const getDrugsComUrl = (drugName: string): string => {
  const formattedDrug = drugName.trim().toLowerCase().replace(/\s+/g, '-');
  return `https://www.drugs.com/${formattedDrug}.html`;
};

const medicationInfoCache = new Map<string, MedicationInfo>();

export const getDrugDetails = async (drugId: string): Promise<MedicationInfo | null> => {
  try {
    if (medicationInfoCache.has(drugId)) {
      console.log('Retrieved drug details from in-memory cache');
      return medicationInfoCache.get(drugId) || null;
    }

    const { data: cached, error } = await supabase
      .from('medications')
      .select('*')
      .eq('name', drugId.replace(/-/g, ' '))
      .single();
    
    if (cached && !error) {
      console.log('Retrieved drug details from database', cached);
      const medicationInfo = cached as MedicationInfo;
      medicationInfoCache.set(drugId, medicationInfo);
      return medicationInfo;
    }

    const response = await fetch(`${EDGE_FUNCTION_URL}/details?id=${encodeURIComponent(drugId)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const detailsData = await response.json();
    
    if (detailsData.error) {
      throw new Error(detailsData.error);
    }
    
    const sideEffectsResponse = await fetch(`${EDGE_FUNCTION_URL}/side-effects?id=${encodeURIComponent(drugId)}`);
    const sideEffectsData = sideEffectsResponse.ok ? await sideEffectsResponse.json() : { sideEffects: [] };
    
    const dosageResponse = await fetch(`${EDGE_FUNCTION_URL}/dosage?id=${encodeURIComponent(drugId)}`);
    const dosageData = dosageResponse.ok ? await dosageResponse.json() : { dosage: "Information not available" };
    
    const medicationInfo: MedicationInfo = {
      name: detailsData.name || drugId,
      genericName: detailsData.generic_name || "",
      description: detailsData.description || "No description available",
      drugClass: detailsData.drug_class || "Unknown",
      usedFor: detailsData.indications || [],
      sideEffects: {
        common: sideEffectsData.common || [],
        serious: sideEffectsData.serious || [],
        rare: sideEffectsData.rare || []
      },
      dosage: {
        adult: dosageData.adult || "Consult your doctor",
        child: dosageData.child || "Consult your doctor",
        elderly: dosageData.elderly || "Consult your doctor",
        frequency: dosageData.frequency || "",
        renal: dosageData.renal || "",
        hepatic: dosageData.hepatic || ""
      },
      warnings: detailsData.warnings || [],
      interactions: detailsData.interactions || [],
      prescriptionOnly: detailsData.prescription_only || false,
      forms: detailsData.forms || [],
      pregnancy: detailsData.pregnancy || "Consult your doctor before using during pregnancy",
      breastfeeding: detailsData.breastfeeding || "Consult your doctor before using while breastfeeding",
      source: "Drugs.com API",
      halfLife: detailsData.half_life || "Information not available",
      foodInteractions: detailsData.food_interactions || [],
      conditionInteractions: detailsData.condition_interactions || [],
      therapeuticDuplications: detailsData.therapeutic_duplications || [],
      interactionClassifications: {
        major: detailsData.major_interactions || [],
        moderate: detailsData.moderate_interactions || [],
        minor: detailsData.minor_interactions || [],
        unknown: []
      }
    };

    medicationInfoCache.set(drugId, medicationInfo);
    
    try {
      // Get the current user's ID
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;
      
      const dbRecord = {
        name: medicationInfo.name,
        generic_name: medicationInfo.genericName,
        description: medicationInfo.description,
        drug_class: medicationInfo.drugClass,
        used_for: medicationInfo.usedFor,
        side_effects: JSON.parse(JSON.stringify(medicationInfo.sideEffects || {})),
        dosage: JSON.parse(JSON.stringify(medicationInfo.dosage || {})),
        warnings: medicationInfo.warnings,
        interactions: medicationInfo.interactions,
        prescription_only: medicationInfo.prescriptionOnly,
        forms: medicationInfo.forms,
        pregnancy: medicationInfo.pregnancy,
        breastfeeding: medicationInfo.breastfeeding,
        source: medicationInfo.source,
        food_interactions: medicationInfo.foodInteractions,
        condition_interactions: medicationInfo.conditionInteractions,
        therapeutic_duplications: medicationInfo.therapeuticDuplications,
        interaction_classifications: JSON.parse(JSON.stringify(medicationInfo.interactionClassifications || {})),
        half_life: medicationInfo.halfLife || null,
        searched_by: userId
      };
      
      await supabase
        .from('medications')
        .upsert([dbRecord]);
    } catch (dbError) {
      console.error('Error caching drug details:', dbError);
    }
    
    return medicationInfo;
  } catch (error) {
    console.error('Error fetching drug details:', error);
    toast.error('Error retrieving medication details');
    return fallbackDrugDetails(drugId);
  }
};

export const checkDrugInteractions = async (drugIds: string[]): Promise<any> => {
  if (drugIds.length < 2) {
    return { interactions: [], summary: "At least two medications are required to check interactions" };
  }
  
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ drug_ids: drugIds })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    toast.error('Error checking medication interactions');
    return {
      interactions: [
        {
          severity: "simulated",
          description: "This is simulated interaction data. In a real application, this would contain actual drug interaction information from Drugs.com API.",
          drugs: drugIds
        }
      ],
      summary: "Interaction data could not be retrieved from the API. This is simulated data."
    };
  }
};

const fallbackDrugDetails = (drugId: string): MedicationInfo => {
  const drugName = drugId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    name: drugName,
    genericName: `Generic ${drugName}`.toLowerCase(),
    description: `${drugName} is a simulated medication description. In a real application, this would contain detailed information fetched from the Drugs.com API.`,
    drugClass: "Simulated Class",
    usedFor: ["Simulated indication"],
    sideEffects: {
      common: ["Headache", "Nausea", "Dizziness"],
      serious: ["Allergic reaction", "Difficulty breathing"],
      rare: ["Rare condition"]
    },
    dosage: {
      adult: "Take as directed by your healthcare provider. This is simulated data.",
      child: "Not recommended for children. This is simulated data.",
      elderly: "Use with caution in elderly patients. This is simulated data.",
      frequency: "Once daily",
      renal: "Adjust dose in renal impairment",
      hepatic: "Adjust dose in hepatic impairment"
    },
    warnings: ["This is a simulated warning. Consult with your doctor."],
    interactions: ["This medication may interact with other drugs. Consult with your doctor."],
    prescriptionOnly: true,
    forms: ["Tablet", "Capsule"],
    pregnancy: "Consult with your healthcare provider before using during pregnancy. This is simulated data.",
    breastfeeding: "Consult with your healthcare provider before using while breastfeeding. This is simulated data.",
    source: "Simulated Drugs.com API response",
    halfLife: "Approximately 12 hours",
    foodInteractions: ["Avoid grapefruit juice", "Take with food"],
    conditionInteractions: ["Use with caution in liver disease", "May worsen heart conditions"],
    therapeuticDuplications: ["Do not take with similar medications"],
    interactionClassifications: {
      major: ["Avoid combining with MAOIs"],
      moderate: ["Possible interaction with NSAIDs"],
      minor: ["Minor interaction with caffeine"],
      unknown: []
    }
  };
};
