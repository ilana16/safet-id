
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
        .insert([medicationData]);
      
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
    // Normalize medication name for better matching
    const normalizedName = medicationName.trim();
    console.log(`Searching for medication: "${normalizedName}"`);
    
    // Try to get exact match first
    let { data: medData } = await supabase
      .from('medications')
      .select('*')
      .ilike('name', normalizedName)
      .limit(1)
      .maybeSingle();
    
    // If not found, try partial match
    if (!medData) {
      console.log('Exact match not found, trying partial match');
      const { data: partialMatches } = await supabase
        .from('medications')
        .select('*')
        .ilike('name', `%${normalizedName}%`)
        .limit(1)
        .maybeSingle();
      
      medData = partialMatches;
    }
    
    // Increment search count if found
    if (medData) {
      console.log('Medication found:', medData.name);
      incrementMedicationSearchCount(medData.name, userId);
      
      // Define a proper DB response type with all needed fields
      interface MedicationDbResponse {
        id: string;
        name: string;
        generic_name?: string | null;
        description?: string | null;
        drug_class?: string | null;
        prescription_only?: boolean | null;
        used_for?: string[] | null;
        warnings?: string[] | null;
        side_effects?: any;
        food_interactions?: string[] | null;
        condition_interactions?: string[] | null;
        therapeutic_duplications?: string[] | null;
        source?: string | null;
        forms?: string[] | null;
        pregnancy?: string | null;
        breastfeeding?: string | null;
        interactions?: string[] | null;
        interaction_classifications?: any;
        interaction_severity?: any;
        dosage?: any;
        half_life?: string | null;
        search_count?: number | null;
        imprints?: Array<{imprint_code: string | null, image_url: string | null, description: string | null}> | null;
        international_names?: Array<{country: string, name: string}> | null;
      }
      
      // Cast to our defined type to ensure we have all expected fields
      const typedMedData = medData as MedicationDbResponse;
      
      // Convert database format to MedicationInfo format
      const medicationInfo: MedicationInfo = {
        id: typedMedData.id,
        name: typedMedData.name,
        genericName: typedMedData.generic_name || undefined,
        description: typedMedData.description || undefined,
        drugClass: typedMedData.drug_class || undefined,
        prescriptionOnly: typedMedData.prescription_only ?? false,
        usedFor: Array.isArray(typedMedData.used_for) ? typedMedData.used_for : [],
        warnings: Array.isArray(typedMedData.warnings) ? typedMedData.warnings : [],
        foodInteractions: Array.isArray(typedMedData.food_interactions) ? typedMedData.food_interactions : [],
        conditionInteractions: Array.isArray(typedMedData.condition_interactions) ? typedMedData.condition_interactions : [],
        therapeuticDuplications: Array.isArray(typedMedData.therapeutic_duplications) ? typedMedData.therapeutic_duplications : [],
        source: source || typedMedData.source || 'database',
        forms: Array.isArray(typedMedData.forms) ? typedMedData.forms : [],
        pregnancy: typedMedData.pregnancy || undefined,
        breastfeeding: typedMedData.breastfeeding || undefined,
        // Handle JSON data from the database
        sideEffects: typedMedData.side_effects ? typedMedData.side_effects : { common: [], serious: [], rare: [] },
        interactions: Array.isArray(typedMedData.interactions) ? typedMedData.interactions : [],
        interactionClassifications: typedMedData.interaction_classifications || undefined,
        interactionSeverity: typedMedData.interaction_severity || undefined,
        dosage: typedMedData.dosage || undefined,
        halfLife: typedMedData.half_life || undefined,
        drugsComUrl: getDrugsComUrl(typedMedData.name),
        databaseSearchCount: typedMedData.search_count || 1,
        fromDatabase: true,
        // Add the new property fields with safe defaults
        imprints: Array.isArray(typedMedData.imprints) ? typedMedData.imprints : [],
        internationalNames: Array.isArray(typedMedData.international_names) ? typedMedData.international_names : []
      };
      
      return medicationInfo;
    }
    
    console.log('Medication not found in database');
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
    
    // Normalize the query for better matching
    const normalizedQuery = query.trim();
    console.log(`Searching medications for: "${normalizedQuery}"`);
    
    // Search for medications
    const { data: results, error } = await supabase
      .from('medications')
      .select('name')
      .ilike('name', `%${normalizedQuery}%`)
      .order('search_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error searching medications:', error);
      return [];
    }
    
    const medicationNames = results?.map(item => item.name) || [];
    console.log(`Found ${medicationNames.length} results for "${normalizedQuery}"`);
    
    // If no results from database, fall back to local enhanced search
    if (medicationNames.length === 0) {
      console.log('No database results, trying enhanced local search');
      // Import dynamically to avoid circular dependencies
      const { enhancedMedicationSearch } = await import('./enhancedMedicationSearch');
      return enhancedMedicationSearch(normalizedQuery);
    }
    
    return medicationNames;
  } catch (error) {
    console.error('Error in medication search:', error);
    // Fallback to enhanced search on error
    try {
      console.log('Error with database search, trying enhanced local search');
      const { enhancedMedicationSearch } = await import('./enhancedMedicationSearch');
      return enhancedMedicationSearch(query.trim());
    } catch (fallbackError) {
      console.error('Even fallback search failed:', fallbackError);
      return [];
    }
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
