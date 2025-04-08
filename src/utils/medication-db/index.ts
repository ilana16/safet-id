
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { MedicationInfo } from '../medicationData.d';
import { Json } from '@/integrations/supabase/types';

/**
 * Increments the search count for a medication in the database
 * @param medicationName - The name of the medication
 * @param userId - Optional user ID for tracking who searched
 */
export const incrementMedicationSearchCount = async (
  medicationName: string, 
  userId?: string | null
): Promise<void> => {
  try {
    // Check if medication exists
    const { data: existingMed } = await supabase
      .from('medications')
      .select('id, search_count')
      .ilike('name', medicationName)
      .limit(1)
      .maybeSingle();
    
    if (existingMed?.id) {
      // Update existing medication
      const { error } = await supabase
        .from('medications')
        .update({ 
          search_count: (existingMed.search_count || 0) + 1,
          searched_at: new Date().toISOString(),
          searched_by: userId || null
        })
        .eq('id', existingMed.id);
      
      if (error) console.error('Error incrementing search count:', error);
    }
  } catch (error) {
    console.error('Error updating medication search count:', error);
    // Non-critical error, don't show to user
  }
};

/**
 * Saves a medication to the database
 * @param medicationInfo - The medication information to save
 * @returns True if successful, false otherwise
 */
export const saveMedicationToDb = async (
  medicationInfo: MedicationInfo
): Promise<boolean> => {
  try {
    if (!medicationInfo.name) return false;
    
    // Format medication data for database - convert complex objects to JSON-compatible format
    const medicationData = {
      name: medicationInfo.name,
      generic_name: medicationInfo.genericName || null,
      description: medicationInfo.description || null,
      drug_class: medicationInfo.drugClass || null,
      prescription_only: medicationInfo.prescriptionOnly || false,
      used_for: medicationInfo.usedFor || null,
      warnings: medicationInfo.warnings || null,
      side_effects: medicationInfo.sideEffects ? JSON.parse(JSON.stringify(medicationInfo.sideEffects)) : null,
      food_interactions: medicationInfo.foodInteractions || null,
      condition_interactions: medicationInfo.conditionInteractions || null,
      therapeutic_duplications: medicationInfo.therapeuticDuplications || null,
      pregnancy: medicationInfo.pregnancy || null,
      breastfeeding: medicationInfo.breastfeeding || null,
      source: medicationInfo.source || 'user',
      forms: Array.isArray(medicationInfo.forms) ? medicationInfo.forms : null,
      interactions: medicationInfo.interactions || null,
      interaction_classifications: medicationInfo.interactionClassifications ? JSON.parse(JSON.stringify(medicationInfo.interactionClassifications)) : null,
      interaction_severity: medicationInfo.interactionSeverity ? JSON.parse(JSON.stringify(medicationInfo.interactionSeverity)) : null,
      dosage: medicationInfo.dosage ? JSON.parse(JSON.stringify(medicationInfo.dosage)) : null,
      half_life: medicationInfo.halfLife || null
    };
    
    // Check if medication exists
    const { data: existingMed } = await supabase
      .from('medications')
      .select('id')
      .ilike('name', medicationInfo.name)
      .limit(1)
      .maybeSingle();
    
    if (existingMed?.id) {
      // Update existing medication
      const { error } = await supabase
        .from('medications')
        .update(medicationData)
        .eq('id', existingMed.id);
      
      if (error) {
        console.error('Error updating medication:', error);
        return false;
      }
      
      return true;
    } else {
      // Insert new medication
      const { error } = await supabase
        .from('medications')
        .insert(medicationData);
      
      if (error) {
        console.error('Error inserting medication:', error);
        return false;
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error saving medication to database:', error);
    return false;
  }
};

/**
 * Gets a medication from the database
 * @param medicationName - The name of the medication to retrieve
 * @param userId - Optional user ID
 * @param source - Optional source of the data
 * @returns The medication information, or null if not found
 */
export const getMedicationFromDb = async (
  medicationName: string,
  userId?: string | null,
  source?: string
): Promise<MedicationInfo | null> => {
  try {
    // Try to get exact match first
    let { data: medData } = await supabase
      .from('medications')
      .select('*')
      .ilike('name', medicationName)
      .limit(1)
      .maybeSingle();
    
    // If not found, try partial match
    if (!medData) {
      const { data: partialMatches } = await supabase
        .from('medications')
        .select('*')
        .ilike('name', `%${medicationName}%`)
        .limit(1)
        .maybeSingle();
      
      medData = partialMatches;
    }
    
    // Increment search count if found
    if (medData) {
      incrementMedicationSearchCount(medData.name, userId);
      
      // Use type assertion to tell TypeScript about the structure
      const typedMedData = medData as any;
      
      // Convert database format to MedicationInfo format
      const medicationInfo: MedicationInfo = {
        id: typedMedData.id,
        name: typedMedData.name,
        genericName: typedMedData.generic_name || undefined,
        description: typedMedData.description || undefined,
        drugClass: typedMedData.drug_class || undefined,
        prescriptionOnly: typedMedData.prescription_only ?? false,
        usedFor: typedMedData.used_for || [],
        warnings: typedMedData.warnings || [],
        foodInteractions: typedMedData.food_interactions || [],
        conditionInteractions: typedMedData.condition_interactions || [],
        therapeuticDuplications: typedMedData.therapeutic_duplications || [],
        source: source || typedMedData.source || 'database',
        forms: typedMedData.forms || [],
        pregnancy: typedMedData.pregnancy || undefined,
        breastfeeding: typedMedData.breastfeeding || undefined,
        // Handle JSON data from the database
        sideEffects: typedMedData.side_effects ? typedMedData.side_effects as any : { common: [], serious: [], rare: [] },
        interactions: typedMedData.interactions || [],
        interactionClassifications: typedMedData.interaction_classifications as any,
        interactionSeverity: typedMedData.interaction_severity as any,
        dosage: typedMedData.dosage as any,
        // Use type assertion to access the half_life property
        halfLife: typedMedData.half_life,
        drugsComUrl: getDrugsComUrl(typedMedData.name)
      };
      
      return medicationInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting medication from database:', error);
    return null;
  }
};

/**
 * Performs a medication search against the database
 * @param query - The search query
 * @param limit - Maximum number of results to return
 * @returns Array of matching medications
 */
export const performMedicationSearch = async (
  query: string,
  limit: number = 10
): Promise<string[]> => {
  try {
    if (!query || query.length < 2) return [];
    
    // Search for medications
    const { data: results, error } = await supabase
      .from('medications')
      .select('name')
      .ilike('name', `%${query}%`)
      .order('search_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error searching medications:', error);
      return [];
    }
    
    return results?.map(item => item.name) || [];
  } catch (error) {
    console.error('Error in medication search:', error);
    return [];
  }
};

/**
 * Gets the Drugs.com URL for a medication
 * @param medicationName - The name of the medication
 * @returns The URL for the medication on Drugs.com
 */
export const getDrugsComUrl = (medicationName: string): string => {
  const formattedName = medicationName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `https://www.drugs.com/${formattedName}.html`;
};
