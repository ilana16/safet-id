
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from '../medicationData.d';

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
      const med = existingMeds[0];
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
        databaseSearchCount: newCount
      };
    } else {
      // Medication doesn't exist, insert it
      const { data, error } = await supabase
        .from('medications')
        .insert({
          name: medicationInfo.name,
          generic_name: medicationInfo.genericName,
          description: medicationInfo.description,
          drug_class: medicationInfo.drugClass,
          prescription_only: medicationInfo.prescriptionOnly,
          used_for: medicationInfo.usedFor,
          warnings: medicationInfo.warnings,
          side_effects: medicationInfo.sideEffects,
          dosage: medicationInfo.dosage,
          interaction_classifications: medicationInfo.interactionClassifications,
          interaction_severity: medicationInfo.interactionSeverity,
          food_interactions: medicationInfo.foodInteractions,
          condition_interactions: medicationInfo.conditionInteractions,
          therapeutic_duplications: medicationInfo.therapeuticDuplications,
          interactions: medicationInfo.interactions,
          source: medicationInfo.source,
          forms: medicationInfo.forms,
          pregnancy: medicationInfo.pregnancy,
          breastfeeding: medicationInfo.breastfeeding,
          half_life: medicationInfo.halfLife || null,
          searched_by: userId
        })
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
        databaseSearchCount: 1
      };
    }
  } catch (error) {
    console.error('Error saving medication to database:', error);
    return medicationInfo;
  }
};
