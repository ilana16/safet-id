
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
    
    // Convert database structure back to MedicationInfo with proper type handling
    const medicationInfo: MedicationInfo = {
      name: data.name,
      genericName: data.generic_name || '',
      description: data.description || '',
      drugClass: data.drug_class || '',
      prescriptionOnly: data.prescription_only || false,
      usedFor: Array.isArray(data.used_for) ? data.used_for : [],
      warnings: Array.isArray(data.warnings) ? data.warnings : [],
      // Ensure side_effects has the correct structure
      sideEffects: typeof data.side_effects === 'object' && data.side_effects !== null
        ? {
            common: Array.isArray(data.side_effects.common) ? data.side_effects.common : [],
            serious: Array.isArray(data.side_effects.serious) ? data.side_effects.serious : [],
            rare: Array.isArray(data.side_effects.rare) ? data.side_effects.rare : []
          }
        : { common: [], serious: [], rare: [] },
      interactions: Array.isArray(data.interactions) ? data.interactions : [],
      // Ensure dosage has the correct structure
      dosage: typeof data.dosage === 'object' && data.dosage !== null
        ? {
            adult: data.dosage.adult || '',
            child: data.dosage.child || '',
            elderly: data.dosage.elderly || '',
            frequency: data.dosage.frequency || '',
            renal: data.dosage.renal || '',
            hepatic: data.dosage.hepatic || ''
          }
        : { adult: '', child: '', elderly: '', frequency: '', renal: '', hepatic: '' },
      forms: Array.isArray(data.forms) ? data.forms : [],
      pregnancy: data.pregnancy || '',
      breastfeeding: data.breastfeeding || '',
      foodInteractions: Array.isArray(data.food_interactions) ? data.food_interactions : [],
      conditionInteractions: Array.isArray(data.condition_interactions) ? data.condition_interactions : [],
      therapeuticDuplications: Array.isArray(data.therapeutic_duplications) ? data.therapeutic_duplications : [],
      // Ensure interaction_classifications has the correct structure
      interactionClassifications: typeof data.interaction_classifications === 'object' && data.interaction_classifications !== null
        ? {
            major: Array.isArray(data.interaction_classifications.major) ? data.interaction_classifications.major : [],
            moderate: Array.isArray(data.interaction_classifications.moderate) ? data.interaction_classifications.moderate : [],
            minor: Array.isArray(data.interaction_classifications.minor) ? data.interaction_classifications.minor : [],
            unknown: Array.isArray(data.interaction_classifications.unknown) ? data.interaction_classifications.unknown : []
          }
        : { major: [], moderate: [], minor: [], unknown: [] },
      // Ensure interaction_severity has the correct structure
      interactionSeverity: typeof data.interaction_severity === 'object' && data.interaction_severity !== null
        ? {
            major: Array.isArray(data.interaction_severity.major) ? data.interaction_severity.major : [],
            moderate: Array.isArray(data.interaction_severity.moderate) ? data.interaction_severity.moderate : [],
            minor: Array.isArray(data.interaction_severity.minor) ? data.interaction_severity.minor : []
          }
        : { major: [], moderate: [], minor: [] },
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
