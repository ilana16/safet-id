
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from '../medicationData.d';
import { saveMedicationToDb } from './save';
import { toast } from 'sonner';
import { getDrugsComUrl } from '../drugsComApi';

// Configurable timeout for database operations
const DB_OPERATION_TIMEOUT = 8000; // 8 seconds

// Define interfaces for RPC results
interface DrugResult {
  id: string;
  name: string;
  generic: string | null;
  drug_class: string | null;
  otc: boolean | null;
  consumer_info: string | null;
  side_effects: string | null;
  dosage: string | null;
  pregnancy: string | null;
  breastfeeding: string | null;
  classification: string | null;
}

/**
 * Gets medication information from the database or fallback data
 * 
 * @param medicationName Name of the medication to retrieve
 * @param userId User ID of the person searching (optional)
 * @param preferredSource Preferred data source ('drugscom', 'elsevier', 'webcrawler')
 * @returns Promise resolving to medication info or null if not found
 */
export const getMedicationFromDb = async (
  medicationName: string, 
  userId?: string | null,
  preferredSource: 'drugscom' | 'elsevier' | 'webcrawler' = 'drugscom'
): Promise<MedicationInfo | null> => {
  if (!medicationName) return null;

  // Create a promise that will reject after the timeout period
  const timeoutPromise = new Promise<MedicationInfo | null>((_, reject) => {
    setTimeout(() => reject(new Error("Database operation timed out")), DB_OPERATION_TIMEOUT);
  });

  try {
    const normalizedName = medicationName.toLowerCase().trim();
    
    console.log(`Getting medication from database: ${normalizedName} using source: ${preferredSource}`);
    
    // First, check the medications table
    try {
      const { data: dbMeds, error: dbError } = await supabase
        .from('medications')
        .select('*')
        .ilike('name', normalizedName)
        .limit(1);
      
      if (dbError) {
        console.error('Error getting medication from medications table:', dbError);
      } else if (dbMeds && dbMeds.length > 0) {
        console.log('Medication found in medications table:', dbMeds[0].name);
        
        // Increment the search count
        const newCount = (dbMeds[0].search_count || 0) + 1;
        
        // Update the search count and timestamp in background
        try {
          await supabase
            .from('medications')
            .update({
              search_count: newCount,
              searched_at: new Date().toISOString(),
              searched_by: userId || dbMeds[0].searched_by
            })
            .eq('id', dbMeds[0].id);
        } catch (updateError) {
          console.warn('Could not update search count, but continuing:', updateError);
        }
        
        // Convert database medication to MedicationInfo format with proper type handling
        const medicationInfo: MedicationInfo = {
          name: dbMeds[0].name,
          genericName: dbMeds[0].generic_name,
          description: dbMeds[0].description,
          drugClass: dbMeds[0].drug_class,
          prescriptionOnly: dbMeds[0].prescription_only,
          usedFor: dbMeds[0].used_for || [],
          warnings: dbMeds[0].warnings || [],
          sideEffects: dbMeds[0].side_effects && typeof dbMeds[0].side_effects === 'object' 
            ? dbMeds[0].side_effects as any 
            : { common: [], serious: [] },
          interactions: dbMeds[0].interactions || [],
          dosage: dbMeds[0].dosage && typeof dbMeds[0].dosage === 'object'
            ? dbMeds[0].dosage as any
            : { adult: '', child: '' },
          forms: dbMeds[0].forms || [],
          interactionClassifications: dbMeds[0].interaction_classifications && 
            typeof dbMeds[0].interaction_classifications === 'object'
            ? dbMeds[0].interaction_classifications as any
            : { major: [], moderate: [], minor: [] },
          interactionSeverity: dbMeds[0].interaction_severity && 
            typeof dbMeds[0].interaction_severity === 'object'
            ? dbMeds[0].interaction_severity as any
            : { major: [], moderate: [], minor: [] },
          foodInteractions: dbMeds[0].food_interactions || [],
          conditionInteractions: dbMeds[0].condition_interactions || [],
          therapeuticDuplications: dbMeds[0].therapeutic_duplications || [],
          pregnancy: dbMeds[0].pregnancy,
          breastfeeding: dbMeds[0].breastfeeding,
          halfLife: dbMeds[0] && 'half_life' in dbMeds[0] ? String(dbMeds[0].half_life || '') : '',
          drugsComUrl: getDrugsComUrl(dbMeds[0].name),
          source: dbMeds[0].source,
          fromDatabase: true,
          databaseSearchCount: newCount
        };
        
        return medicationInfo;
      }
    } catch (medTableError) {
      console.error('Error checking medications table:', medTableError);
    }
    
    // Next, check the new drugs table using RPC to avoid type issues
    try {
      const { data: drugData, error: drugError } = await supabase
        .rpc('get_drug_by_name', { drug_name: normalizedName }) as { data: DrugResult[] | null, error: any };
      
      if (drugError) {
        console.error('Error getting medication from drugs table:', drugError);
      } else if (drugData && drugData.length > 0) {
        console.log('Medication found in drugs table:', drugData[0].name);
        
        // Convert drugs table data to MedicationInfo format
        const medicationInfo: MedicationInfo = {
          name: drugData[0].name,
          genericName: drugData[0].generic || '',
          description: drugData[0].consumer_info || '',
          drugClass: drugData[0].drug_class || '',
          prescriptionOnly: typeof drugData[0].otc === 'boolean' ? !drugData[0].otc : true,
          usedFor: [],
          warnings: [],
          sideEffects: { 
            common: drugData[0].side_effects ? [drugData[0].side_effects] : [], 
            serious: [] 
          },
          interactions: [],
          dosage: { 
            adult: drugData[0].dosage || '', 
            child: '' 
          },
          forms: [],
          interactionClassifications: { major: [], moderate: [], minor: [] },
          interactionSeverity: { major: [], moderate: [], minor: [] },
          foodInteractions: [],
          conditionInteractions: [],
          therapeuticDuplications: [],
          pregnancy: drugData[0].pregnancy || '',
          breastfeeding: drugData[0].breastfeeding || '',
          halfLife: '',
          drugsComUrl: getDrugsComUrl(drugData[0].name),
          source: 'Drugs Database',
          fromDatabase: true,
          databaseSearchCount: 1
        };
        
        return medicationInfo;
      }
    } catch (drugTableError) {
      console.error('Error checking drugs table:', drugTableError);
    }
    
    // If not found in either database, use fallback data generation
    console.log('Medication not found in database or lookup timed out, using fallback data');
    return await generateMedicationInfo(medicationName, userId);
    
  } catch (error) {
    console.error('Error getting medication from database:', error);
    // If it was a timeout error, give a specific message
    if (error instanceof Error && error.message.includes('timed out')) {
      toast.error('Database lookup timed out, using local data');
    } else {
      toast.error('Error retrieving medication information');
    }
    return await generateMedicationInfo(medicationName, userId);
  }
};

/**
 * Generates medication information using local data source
 * 
 * @param medicationName Name of the medication
 * @param userId User ID of the person searching (optional)
 * @returns Promise resolving to generated medication info
 */
async function generateMedicationInfo(medicationName: string, userId?: string | null): Promise<MedicationInfo | null> {
  console.log('Generating medication info for:', medicationName);
  
  try {
    // Import the enhanced medication data utility with timeout control
    const enhancedDataPromise = import('./enhancedMedicationData').then(
      module => module.getEnhancedMedicationData(medicationName)
    );
    
    const timeoutPromise = new Promise<MedicationInfo | null>((_, reject) => {
      setTimeout(() => reject(new Error("Enhanced data generation timed out")), 5000);
    });
    
    // Race the data generation against the timeout
    const medInfo = await Promise.race([enhancedDataPromise, timeoutPromise]);
    
    if (medInfo) {
      // Mark that this is generated data
      medInfo.source = 'Enhanced Medication Database';
      
      try {
        // Try to save to the database with a short timeout
        const savePromise = saveMedicationToDb(medInfo, userId || undefined);
        const saveTimeoutPromise = new Promise<MedicationInfo>((_, reject) => {
          setTimeout(() => reject(new Error("Save operation timed out")), 3000);
        });
        
        // Fixed promise race - type now aligns with saveMedicationToDb return type
        const savedMedInfo = await Promise.race([savePromise, saveTimeoutPromise]) as MedicationInfo;
        return savedMedInfo || medInfo;
      } catch (saveError) {
        console.warn('Failed to save to database, but returning data anyway:', saveError);
        return medInfo;
      }
    }
    
    // If even the enhanced data fails, create a very basic fallback
    const basicFallback: MedicationInfo = {
      name: medicationName,
      genericName: medicationName,
      description: `Information about ${medicationName} could not be retrieved. Please consult with a healthcare professional for accurate information.`,
      drugClass: "Information not available",
      prescriptionOnly: false,
      usedFor: ["Information not available"],
      warnings: ["Always consult with a healthcare professional before taking any medication"],
      sideEffects: {
        common: ["Information not available"],
        serious: ["Information not available"]
      },
      interactions: ["Information not available"],
      dosage: {
        adult: "Consult healthcare provider",
        child: "Consult healthcare provider"
      },
      forms: ["Information not available"],
      interactionClassifications: {
        major: [],
        moderate: [],
        minor: []
      },
      interactionSeverity: {
        major: [],
        moderate: [],
        minor: []
      },
      foodInteractions: [],
      conditionInteractions: [],
      therapeuticDuplications: [],
      pregnancy: "Consult healthcare provider",
      breastfeeding: "Consult healthcare provider",
      halfLife: "Information not available",
      drugsComUrl: getDrugsComUrl(medicationName),
      source: "Basic Fallback Data"
    };
    
    return basicFallback;
    
  } catch (e) {
    console.error('Error in generating medication info:', e);
    
    // Ultimate fallback if everything else fails
    return {
      name: medicationName,
      genericName: '',
      description: `Unable to retrieve information for ${medicationName}.`,
      drugClass: '',
      prescriptionOnly: false,
      usedFor: [],
      warnings: [],
      sideEffects: { common: [], serious: [] },
      interactions: [],
      dosage: { adult: '', child: '' },
      forms: [],
      interactionClassifications: { major: [], moderate: [], minor: [] },
      interactionSeverity: { major: [], moderate: [], minor: [] },
      foodInteractions: [],
      conditionInteractions: [],
      therapeuticDuplications: [],
      pregnancy: '',
      breastfeeding: '',
      halfLife: '',
      drugsComUrl: getDrugsComUrl(medicationName),
      source: "Emergency Fallback"
    };
  }
}
