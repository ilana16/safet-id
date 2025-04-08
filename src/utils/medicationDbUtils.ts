
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from './medicationData.d';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

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
 * If not found in database, automatically fetch from available sources and save to database
 * 
 * @param medicationName Name of the medication to retrieve
 * @param userId User ID of the person searching (optional)
 * @param preferredSource Preferred data source ('drugscom' or 'elsevier')
 * @returns Promise resolving to medication info or null if not found
 */
export const getMedicationFromDb = async (
  medicationName: string, 
  userId?: string,
  preferredSource: 'drugscom' | 'elsevier' = 'drugscom'
): Promise<MedicationInfo | null> => {
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
    
    if (data) {
      console.log(`Found medication in database: ${data.name}`);
      
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
      
      // Define interface for side effects to ensure proper typing
      interface SideEffectsObject {
        common?: string[];
        serious?: string[];
        rare?: string[];
      }
      
      // Define interface for dosage to ensure proper typing
      interface DosageObject {
        adult?: string;
        child?: string;
        elderly?: string;
        frequency?: string;
        renal?: string;
        hepatic?: string;
      }
      
      // Define interface for interaction classifications to ensure proper typing
      interface InteractionClassificationsObject {
        major?: string[];
        moderate?: string[];
        minor?: string[];
        unknown?: string[];
      }
      
      // Define interface for interaction severity to ensure proper typing
      interface InteractionSeverityObject {
        major?: string[];
        moderate?: string[];
        minor?: string[];
      }

      // Helper function to safely handle nested objects with proper type casting
      const safeGetNestedObject = <T>(obj: any, defaultValue: T): T => {
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
          return obj as unknown as T;
        }
        return defaultValue;
      };

      // Helper function to safely get array values
      const safeGetArray = (value: any): string[] => {
        if (Array.isArray(value)) {
          return value as string[];
        }
        return [];
      };

      // Safely get side effects with default values for each property
      // Create default object with the expected structure
      const defaultSideEffects: SideEffectsObject = { common: [], serious: [], rare: [] };
      const sideEffectsObj = safeGetNestedObject(data.side_effects, defaultSideEffects);
      
      const sideEffects = {
        common: Array.isArray(sideEffectsObj.common) ? sideEffectsObj.common : [],
        serious: Array.isArray(sideEffectsObj.serious) ? sideEffectsObj.serious : [],
        rare: Array.isArray(sideEffectsObj.rare) ? sideEffectsObj.rare : []
      };

      // Safely get dosage with default values for each property
      // Create default object with the expected structure
      const defaultDosage: DosageObject = { adult: '', child: '', elderly: '', frequency: '', renal: '', hepatic: '' };
      const dosageObj = safeGetNestedObject(data.dosage, defaultDosage);
      
      const dosage = {
        adult: typeof dosageObj.adult === 'string' ? dosageObj.adult : '',
        child: typeof dosageObj.child === 'string' ? dosageObj.child : '',
        elderly: typeof dosageObj.elderly === 'string' ? dosageObj.elderly : '',
        frequency: typeof dosageObj.frequency === 'string' ? dosageObj.frequency : '',
        renal: typeof dosageObj.renal === 'string' ? dosageObj.renal : '',
        hepatic: typeof dosageObj.hepatic === 'string' ? dosageObj.hepatic : ''
      };

      // Safely get interaction classifications with default values for each property
      // Create default object with the expected structure
      const defaultInteractionClassifications: InteractionClassificationsObject = { 
        major: [], moderate: [], minor: [], unknown: [] 
      };
      const interactionClassificationsObj = safeGetNestedObject(
        data.interaction_classifications, 
        defaultInteractionClassifications
      );
      
      const interactionClassifications = {
        major: Array.isArray(interactionClassificationsObj.major) ? interactionClassificationsObj.major : [],
        moderate: Array.isArray(interactionClassificationsObj.moderate) ? interactionClassificationsObj.moderate : [],
        minor: Array.isArray(interactionClassificationsObj.minor) ? interactionClassificationsObj.minor : [],
        unknown: Array.isArray(interactionClassificationsObj.unknown) ? interactionClassificationsObj.unknown : []
      };

      // Safely get interaction severity with default values for each property
      // Create default object with the expected structure
      const defaultInteractionSeverity: InteractionSeverityObject = { 
        major: [], moderate: [], minor: [] 
      };
      const interactionSeverityObj = safeGetNestedObject(
        data.interaction_severity, 
        defaultInteractionSeverity
      );
      
      const interactionSeverity = {
        major: Array.isArray(interactionSeverityObj.major) ? interactionSeverityObj.major : [],
        moderate: Array.isArray(interactionSeverityObj.moderate) ? interactionSeverityObj.moderate : [],
        minor: Array.isArray(interactionSeverityObj.minor) ? interactionSeverityObj.minor : []
      };
      
      // Convert database structure back to MedicationInfo with proper type handling
      const medicationInfo: MedicationInfo = {
        name: data.name,
        genericName: data.generic_name || '',
        description: data.description || '',
        drugClass: data.drug_class || '',
        prescriptionOnly: data.prescription_only || false,
        usedFor: safeGetArray(data.used_for),
        warnings: safeGetArray(data.warnings),
        sideEffects: sideEffects,
        interactions: safeGetArray(data.interactions),
        dosage: dosage,
        forms: safeGetArray(data.forms),
        pregnancy: data.pregnancy || '',
        breastfeeding: data.breastfeeding || '',
        foodInteractions: safeGetArray(data.food_interactions),
        conditionInteractions: safeGetArray(data.condition_interactions),
        therapeuticDuplications: safeGetArray(data.therapeutic_duplications),
        interactionClassifications: interactionClassifications,
        interactionSeverity: interactionSeverity,
        source: data.source || 'Database',
        drugsComUrl: getDrugsComUrl(data.name),
        fromDatabase: true,
        databaseSearchCount: data.search_count
      };
      
      return medicationInfo;
    }
    
    // If not found in database, fetch from the preferred source
    console.log(`Medication not found in database: ${medicationName}. Fetching from ${preferredSource}...`);
    
    let externalMedInfo: MedicationInfo | null = null;
    
    if (preferredSource === 'elsevier') {
      // First try Elsevier
      externalMedInfo = await fetchElsevierDrugInfo(medicationName);
      
      // If not found in Elsevier, fallback to drugs.com
      if (!externalMedInfo) {
        console.log(`Medication not found in Elsevier: ${medicationName}. Trying drugs.com...`);
        externalMedInfo = await fetchDrugsComLiveInfo(medicationName);
      }
    } else {
      // First try drugs.com
      externalMedInfo = await fetchDrugsComLiveInfo(medicationName);
      
      // If not found on drugs.com, fallback to Elsevier
      if (!externalMedInfo) {
        console.log(`Medication not found on drugs.com: ${medicationName}. Trying Elsevier...`);
        externalMedInfo = await fetchElsevierDrugInfo(medicationName);
      }
    }
    
    if (externalMedInfo) {
      console.log(`Retrieved information for ${medicationName}. Saving to database...`);
      
      // Save the medication info to the database
      await saveMedicationToDb(externalMedInfo, userId);
      
      // Set the source
      if (!externalMedInfo.source) {
        externalMedInfo.source = preferredSource === 'elsevier' ? 'Elsevier Drug Info API' : 'Drugs.com';
      }
      
      // Set the URL
      externalMedInfo.drugsComUrl = getDrugsComUrl(externalMedInfo.name || medicationName);
      
      return externalMedInfo;
    }
    
    console.log(`No information found for ${medicationName} from any source`);
    return null;
  } catch (error) {
    console.error(`Error retrieving medication from database:`, error);
    return null;
  }
};

// Import from drugsComApi to get URL function and fetchDrugsComLiveInfo function
import { getDrugsComUrl, fetchDrugsComLiveInfo } from './drugsComApi';
import { fetchElsevierDrugInfo } from './elsevierApi';

