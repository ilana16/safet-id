
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from './medicationData.d';
import { toast } from 'sonner';

/**
 * Save medication information to the database
 * 
 * @param medicationInfo The medication information to save
 * @param userId User ID of the person searching (optional)
 * @returns Promise resolving to success status
 */
export const saveMedicationToDb = async (
  medicationInfo: MedicationInfo,
  userId?: string
): Promise<boolean> => {
  if (!medicationInfo || !medicationInfo.name) {
    console.error('Invalid medication information provided');
    return false;
  }

  try {
    console.log(`Saving medication to database: ${medicationInfo.name}`);
    
    // Prepare the medication data for database
    const medicationData = {
      name: medicationInfo.name,
      generic_name: medicationInfo.genericName || null,
      description: medicationInfo.description || null,
      drug_class: medicationInfo.drugClass || null,
      prescription_only: medicationInfo.prescriptionOnly || false,
      used_for: medicationInfo.usedFor || [],
      warnings: medicationInfo.warnings || [],
      side_effects: medicationInfo.sideEffects || {},
      interactions: medicationInfo.interactions || [],
      dosage: medicationInfo.dosage || {},
      forms: medicationInfo.forms || [],
      pregnancy: medicationInfo.pregnancy || null,
      breastfeeding: medicationInfo.breastfeeding || null,
      food_interactions: medicationInfo.foodInteractions || [],
      condition_interactions: medicationInfo.conditionInteractions || [],
      therapeutic_duplications: medicationInfo.therapeuticDuplications || [],
      interaction_classifications: medicationInfo.interactionClassifications || {},
      interaction_severity: medicationInfo.interactionSeverity || {},
      source: medicationInfo.source || 'Drugs.com',
      searched_by: userId || null
    };

    // Check if this medication already exists in the database
    const { data: existingMed, error: fetchError } = await supabase
      .from('medications')
      .select('id, search_count')
      .ilike('name', medicationInfo.name)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error checking for existing medication:', fetchError);
      return false;
    }
    
    if (existingMed) {
      // Update the existing medication with new data and increment search count
      const { error: updateError } = await supabase
        .from('medications')
        .update({ 
          ...medicationData,
          search_count: (existingMed.search_count || 0) + 1,
          searched_at: new Date().toISOString()
        })
        .eq('id', existingMed.id);
      
      if (updateError) {
        console.error('Error updating medication in database:', updateError);
        return false;
      }
      
      console.log(`Updated existing medication: ${medicationInfo.name}`);
      return true;
    } else {
      // Insert new medication
      const { error: insertError } = await supabase
        .from('medications')
        .insert(medicationData);
      
      if (insertError) {
        console.error('Error saving medication to database:', insertError);
        return false;
      }
      
      console.log(`Added new medication to database: ${medicationInfo.name}`);
      return true;
    }
  } catch (error) {
    console.error(`Error saving medication to database:`, error);
    return false;
  }
};

/**
 * Retrieve medication information from the database
 * 
 * @param medicationName Name of the medication to retrieve
 * @returns Promise resolving to medication info or null if not found
 */
export const getMedicationFromDb = async (medicationName: string): Promise<MedicationInfo | null> => {
  if (!medicationName) return null;

  try {
    console.log(`Searching database for medication: ${medicationName}`);
    
    // Query the database for the medication
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .ilike('name', medicationName)
      .maybeSingle();
    
    if (error) {
      console.error('Error retrieving medication from database:', error);
      return null;
    }
    
    if (!data) {
      console.log(`Medication not found in database: ${medicationName}`);
      return null;
    }
    
    // Update search count
    const { error: updateError } = await supabase
      .from('medications')
      .update({ 
        search_count: (data.search_count || 0) + 1,
        searched_at: new Date().toISOString()
      })
      .eq('id', data.id);
    
    if (updateError) {
      console.error('Error updating search count:', updateError);
    }
    
    console.log(`Found medication in database: ${data.name}`);
    
    // Convert database structure back to MedicationInfo
    const medicationInfo: MedicationInfo = {
      name: data.name,
      genericName: data.generic_name || '',
      description: data.description || '',
      drugClass: data.drug_class || '',
      prescriptionOnly: data.prescription_only || false,
      usedFor: data.used_for || [],
      warnings: data.warnings || [],
      sideEffects: data.side_effects || { common: [], serious: [], rare: [] },
      interactions: data.interactions || [],
      dosage: data.dosage || { adult: '', child: '', elderly: '' },
      forms: data.forms || [],
      pregnancy: data.pregnancy || '',
      breastfeeding: data.breastfeeding || '',
      foodInteractions: data.food_interactions || [],
      conditionInteractions: data.condition_interactions || [],
      therapeuticDuplications: data.therapeutic_duplications || [],
      interactionClassifications: data.interaction_classifications || {},
      interactionSeverity: data.interaction_severity || {},
      source: data.source || 'Database',
      drugsComUrl: getDrugsComUrl(data.name),
      fromDatabase: true,
      databaseSearchCount: data.search_count
    };
    
    return medicationInfo;
  } catch (error) {
    console.error(`Error retrieving medication from database:`, error);
    return null;
  }
};

// Import from drugsComApi to get URL function
import { getDrugsComUrl } from './drugsComApi';
