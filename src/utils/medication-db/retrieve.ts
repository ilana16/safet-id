
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from '../medicationData.d';
import { saveMedicationToDb } from './save';
import { toast } from 'sonner';
import { getDrugsComUrl } from '../drugsComApi';

// Default timeout for API calls in milliseconds
const API_TIMEOUT = 30000; // 30 seconds

/**
 * Gets medication information from the database or external API
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

  let abortController: AbortController | undefined;

  try {
    const normalizedName = medicationName.toLowerCase().trim();
    
    console.log(`Getting medication from database: ${normalizedName} using source: ${preferredSource}`);
    
    // First try to get the medication from the database
    const { data: dbMeds, error: dbError } = await supabase
      .from('medications')
      .select('*')
      .ilike('name', normalizedName)
      .limit(1);
    
    if (dbError) {
      console.error('Error getting medication from database:', dbError);
    }
    
    // If found in the database, increment the search count and return the medication
    if (dbMeds && dbMeds.length > 0) {
      console.log('Medication found in database:', dbMeds[0].name);
      
      // Increment the search count
      const newCount = (dbMeds[0].search_count || 0) + 1;
      
      // Update the search count and timestamp
      await supabase
        .from('medications')
        .update({
          search_count: newCount,
          searched_at: new Date().toISOString(),
          searched_by: userId || dbMeds[0].searched_by
        })
        .eq('id', dbMeds[0].id);
      
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
        halfLife: dbMeds[0].half_life || '',
        drugsComUrl: getDrugsComUrl(dbMeds[0].name),
        source: dbMeds[0].source,
        fromDatabase: true,
        databaseSearchCount: newCount
      };
      
      return medicationInfo;
    }
    
    // If not found in the database, use fallback immediately
    console.log('Medication not found in database, using fallback data immediately');
    return await fallbackMedicationInfo(medicationName, userId);
    
  } catch (error) {
    console.error('Error getting medication from database or API:', error);
    toast.error('Error retrieving medication information');
    return await fallbackMedicationInfo(medicationName, userId);
  } finally {
    // Clean up abort controller if needed
    if (abortController) {
      try {
        abortController.abort();
      } catch (e) {
        // Ignore errors from aborting after completion
      }
    }
  }
};

/**
 * Provides fallback medication information when API calls fail
 * 
 * @param medicationName Name of the medication
 * @param userId User ID of the person searching (optional)
 * @returns Promise resolving to simulated medication info
 */
async function fallbackMedicationInfo(medicationName: string, userId?: string | null): Promise<MedicationInfo | null> {
  console.log('Using fallback medication info for:', medicationName);
  
  // Import the fetchMedicationInfo function from modrugsApi
  const { fetchMedicationInfo } = await import('../modrugsApi');
  
  try {
    // Get simulated medication data
    const mockMedInfo = await fetchMedicationInfo(medicationName);
    
    if (mockMedInfo) {
      // Mark that this is fallback data
      mockMedInfo.source = 'Fallback Data (API unavailable)';
      
      // Try to save to the database
      const savedMedInfo = await saveMedicationToDb(mockMedInfo, userId || undefined);
      
      return savedMedInfo || mockMedInfo;
    }
    
    // If even mockMedInfo fails, create a very basic fallback
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
    
    // Try to save this basic fallback to the database
    const savedBasicInfo = await saveMedicationToDb(basicFallback, userId || undefined);
    return savedBasicInfo || basicFallback;
    
  } catch (e) {
    console.error('Error in fallback medication info:', e);
    
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
