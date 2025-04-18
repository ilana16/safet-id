
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from '../medicationData.d';

// Define the database medication record type
interface MedicationRecord {
  id: string;
  name: string;
  generic_name?: string | null;
  description?: string | null;
  search_count?: number | null;
  searched_by?: string | null; // Add searched_by property
  imprints?: Array<{imprint_code: string | null, image_url: string | null, description: string | null}> | null;
  international_names?: Array<{country: string, name: string}> | null;
  // ... other properties that might be needed
}

/**
 * Saves medication information to the database
 * 
 * @param medicationInfo Medication information to save
 * @param userId User ID of the person saving the medication (optional)
 * @returns Promise resolving to the saved medication information if successful, null if not
 */
export const saveMedicationToDb = async (
  medicationInfo: MedicationInfo, 
  userId?: string | null
): Promise<MedicationInfo | null> => {
  if (!medicationInfo || !medicationInfo.name) return null;
  
  try {
    const normalizedName = medicationInfo.name.toLowerCase().trim();
    
    console.log('Saving medication to database:', normalizedName);
    
    // First try to get the medication to see if it exists
    const { data: existingMeds } = await supabase
      .from('medications')
      .select('*')
      .ilike('name', normalizedName)
      .limit(1);
    
    if (existingMeds && existingMeds.length > 0) {
      // Medication exists, update the search count and timestamp
      const med = existingMeds[0] as MedicationRecord;
      const newCount = (med.search_count || 0) + 1;
      
      const { error } = await supabase
        .from('medications')
        .update({
          search_count: newCount,
          searched_at: new Date().toISOString(),
          searched_by: userId || med.searched_by
        })
        .eq('id', med.id);
      
      if (error) {
        console.error('Error updating medication search count:', error);
      }
      
      return {
        ...medicationInfo,
        fromDatabase: true,
        databaseSearchCount: newCount,
        // Handle potential missing properties with safe defaults
        imprints: Array.isArray(med.imprints) ? med.imprints : [],
        internationalNames: Array.isArray(med.international_names) ? med.international_names : []
      };
    } else {
      // Medication doesn't exist, insert it
      // Convert complex objects to JSON-compatible format
      const medicationData = {
        name: medicationInfo.name,
        generic_name: medicationInfo.genericName,
        description: medicationInfo.description,
        drug_class: medicationInfo.drugClass,
        prescription_only: medicationInfo.prescriptionOnly,
        used_for: medicationInfo.usedFor,
        warnings: medicationInfo.warnings,
        side_effects: JSON.parse(JSON.stringify(medicationInfo.sideEffects || {})),
        dosage: JSON.parse(JSON.stringify(medicationInfo.dosage || {})),
        interaction_classifications: JSON.parse(JSON.stringify(medicationInfo.interactionClassifications || {})),
        interaction_severity: JSON.parse(JSON.stringify(medicationInfo.interactionSeverity || {})),
        food_interactions: medicationInfo.foodInteractions,
        condition_interactions: medicationInfo.conditionInteractions,
        therapeutic_duplications: medicationInfo.therapeuticDuplications,
        interactions: medicationInfo.interactions,
        source: medicationInfo.source,
        forms: medicationInfo.forms,
        pregnancy: medicationInfo.pregnancy,
        breastfeeding: medicationInfo.breastfeeding,
        half_life: medicationInfo.halfLife || null, // Make sure we use half_life here
        searched_by: userId,
        // Add the new properties if they exist
        imprints: medicationInfo.imprints || [],
        international_names: medicationInfo.internationalNames || []
      };

      const { data, error } = await supabase
        .from('medications')
        .insert([medicationData]) // Wrap in array for insert operation
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting medication:', error);
        return medicationInfo;
      }
      
      console.log('Medication saved to database:', data.name);
      
      return {
        ...medicationInfo,
        fromDatabase: true,
        databaseSearchCount: 1,
        // Initialize with empty arrays if not provided
        imprints: medicationInfo.imprints || [],
        internationalNames: medicationInfo.internationalNames || []
      };
    }
  } catch (error) {
    console.error('Error saving medication to database:', error);
    return medicationInfo;
  }
};
