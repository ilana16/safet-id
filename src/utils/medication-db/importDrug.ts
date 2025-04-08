
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DrugImportData {
  name: string;
  slug?: string;
  consumer_info?: string;
  side_effects?: string;
  dosage?: string;
  pregnancy?: string;
  breastfeeding?: string;
  classification?: string;
  drug_class?: string;
  generic?: string;
  otc?: boolean;
  interactions?: {
    major?: string[];
    moderate?: string[];
    minor?: string[];
    unknown?: string[];
    food_interactions?: string[];
    condition_interactions?: string[];
    therapeutic_duplications?: string[];
  };
  imprints?: Array<{
    imprint_code: string | null;
    image_url: string | null;
    description: string | null;
  }>;
  international_names?: Array<{
    country: string;
    name: string;
  }>;
}

/**
 * Imports a drug and its relationships into the Supabase database
 * 
 * @param drugData Complete drug data object with relationships
 * @returns Promise resolving to the inserted drug ID if successful
 */
export const importDrugWithRelationships = async (
  drugData: DrugImportData
): Promise<string | null> => {
  try {
    console.log(`Starting import for drug: ${drugData.name}`);
    
    // 1. Insert core drug data
    const baseFields = {
      name: drugData.name,
      slug: drugData.slug || null,
      consumer_info: drugData.consumer_info || null,
      side_effects: drugData.side_effects || null,
      dosage: drugData.dosage || null,
      pregnancy: drugData.pregnancy || null,
      breastfeeding: drugData.breastfeeding || null,
      classification: drugData.classification || null,
      drug_class: drugData.drug_class || null,
      generic: drugData.generic || null,
      otc: drugData.otc || null
    };
    
    const { data: drugInsertData, error: drugInsertError } = await supabase
      .from('drugs')
      .insert(baseFields)
      .select('id')
      .single();
    
    if (drugInsertError) {
      console.error('Failed to insert drug:', drugInsertError);
      toast.error(`Failed to import ${drugData.name}`);
      return null;
    }
    
    const drugId = drugInsertData.id;
    console.log(`Successfully inserted drug: ${drugData.name} with ID: ${drugId}`);
    
    // 2. Insert classified interactions if they exist
    const interactions = drugData.interactions || {};
    
    const interactionLevels: ('major' | 'moderate' | 'minor' | 'unknown')[] = ['major', 'moderate', 'minor', 'unknown'];
    
    for (const level of interactionLevels) {
      const levelInteractions = interactions[level] || [];
      
      for (const interaction of levelInteractions) {
        const { error: intError } = await supabase
          .from('drug_interactions')
          .insert({
            drug_id: drugId,
            level: level,
            interaction: interaction
          });
        
        if (intError) {
          console.error(`Failed to insert ${level} interaction for ${drugData.name}:`, intError);
        }
      }
    }
    
    // 3. Insert food interactions if they exist
    const foodInteractions = interactions.food_interactions || [];
    for (const food of foodInteractions) {
      const { error: foodError } = await supabase
        .from('food_interactions')
        .insert({
          drug_id: drugId,
          description: food
        });
      
      if (foodError) {
        console.error(`Failed to insert food interaction for ${drugData.name}:`, foodError);
      }
    }
    
    // 4. Insert condition interactions if they exist
    const conditionInteractions = interactions.condition_interactions || [];
    for (const condition of conditionInteractions) {
      const { error: condError } = await supabase
        .from('condition_interactions')
        .insert({
          drug_id: drugId,
          description: condition
        });
      
      if (condError) {
        console.error(`Failed to insert condition interaction for ${drugData.name}:`, condError);
      }
    }
    
    // 5. Insert therapeutic duplications if they exist
    const therapeuticDuplications = interactions.therapeutic_duplications || [];
    for (const dup of therapeuticDuplications) {
      const { error: dupError } = await supabase
        .from('therapeutic_duplications')
        .insert({
          drug_id: drugId,
          description: dup
        });
      
      if (dupError) {
        console.error(`Failed to insert therapeutic duplication for ${drugData.name}:`, dupError);
      }
    }
    
    // 6. Insert imprints if they exist
    const imprints = drugData.imprints || [];
    for (const imprint of imprints) {
      const { error: imprintError } = await supabase
        .from('drug_imprints')
        .insert({
          drug_id: drugId,
          imprint_code: imprint.imprint_code,
          image_url: imprint.image_url,
          description: imprint.description
        });
      
      if (imprintError) {
        console.error(`Failed to insert imprint for ${drugData.name}:`, imprintError);
      }
    }
    
    // 7. Insert international names if they exist
    const internationalNames = drugData.international_names || [];
    for (const intName of internationalNames) {
      const { error: intNameError } = await supabase
        .from('international_names')
        .insert({
          drug_id: drugId,
          country: intName.country,
          name: intName.name
        });
      
      if (intNameError) {
        console.error(`Failed to insert international name for ${drugData.name}:`, intNameError);
      }
    }
    
    console.log(`All linked data inserted successfully for ${drugData.name}`);
    toast.success(`Successfully imported ${drugData.name} and all related data`);
    
    return drugId;
  } catch (error) {
    console.error('Error importing drug with relationships:', error);
    toast.error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

/**
 * Example usage:
 * 
 * const drugData = {
 *   name: "Aspirin",
 *   slug: "aspirin",
 *   drug_class: "NSAID",
 *   generic: "acetylsalicylic acid",
 *   otc: true,
 *   interactions: {
 *     major: ["Warfarin", "Methotrexate"],
 *     moderate: ["Ibuprofen", "Naproxen"],
 *     food_interactions: ["Alcohol"],
 *     condition_interactions: ["Ulcers", "Bleeding disorders"]
 *   }
 * };
 * 
 * await importDrugWithRelationships(drugData);
 */
