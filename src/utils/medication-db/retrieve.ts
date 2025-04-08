
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from '../medicationData.d';
import { saveMedicationToDb } from './save';
import { toast } from 'sonner';

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
        // Properly handle side effects object
        sideEffects: dbMeds[0].side_effects && typeof dbMeds[0].side_effects === 'object' 
          ? dbMeds[0].side_effects as any 
          : { common: [], serious: [] },
        interactions: dbMeds[0].interactions || [],
        // Properly handle dosage object
        dosage: dbMeds[0].dosage && typeof dbMeds[0].dosage === 'object'
          ? dbMeds[0].dosage as any
          : { adult: '', child: '' },
        forms: dbMeds[0].forms || [],
        // Properly handle interaction classifications object
        interactionClassifications: dbMeds[0].interaction_classifications && 
          typeof dbMeds[0].interaction_classifications === 'object'
          ? dbMeds[0].interaction_classifications as any
          : { major: [], moderate: [], minor: [] },
        // Properly handle interaction severity object
        interactionSeverity: dbMeds[0].interaction_severity && 
          typeof dbMeds[0].interaction_severity === 'object'
          ? dbMeds[0].interaction_severity as any
          : { major: [], moderate: [], minor: [] },
        foodInteractions: dbMeds[0].food_interactions || [],
        conditionInteractions: dbMeds[0].condition_interactions || [],
        therapeuticDuplications: dbMeds[0].therapeutic_duplications || [],
        pregnancy: dbMeds[0].pregnancy,
        breastfeeding: dbMeds[0].breastfeeding,
        // Use type assertion to handle half_life property
        halfLife: (dbMeds[0] as any).half_life !== undefined ? (dbMeds[0] as any).half_life : '',
        source: dbMeds[0].source,
        fromDatabase: true,
        databaseSearchCount: newCount
      };
      
      return medicationInfo;
    }
    
    // If not found in the database, try to get from external API
    console.log('Medication not found in database, fetching from Supabase Edge Function');
    
    // Call our Supabase Edge Function to get drug information
    const { data, error } = await supabase.functions.invoke('drugs-scraper', {
      body: { drugName: medicationName },
    });

    if (error) {
      console.error('Error calling drugs-scraper function:', error);
      toast.error('Error calling medication scraper');
      return null;
    }

    if (data && data.name) {
      console.log('Drug information retrieved successfully:', data.name);
      
      const externalMedInfo: MedicationInfo = {
        name: data.name || medicationName,
        genericName: data.genericName,
        description: data.description,
        drugClass: data.drugClass,
        prescriptionOnly: data.prescriptionOnly,
        usedFor: data.usedFor || [],
        warnings: data.warnings || [],
        sideEffects: data.sideEffects || { common: [], serious: [] },
        interactions: data.interactions || [],
        dosage: data.dosage || { adult: '', child: '' },
        forms: data.forms || [],
        interactionClassifications: data.interactionClassifications || { major: [], moderate: [], minor: [] },
        interactionSeverity: data.interactionSeverity || { major: [], moderate: [], minor: [] },
        foodInteractions: data.foodInteractions || [],
        conditionInteractions: data.conditionInteractions || [],
        therapeuticDuplications: data.therapeuticDuplications || [],
        pregnancy: data.pregnancy || '',
        breastfeeding: data.breastfeeding || '',
        halfLife: data.halfLife || '',
        drugsComUrl: data.drugsComUrl || '',
        source: data.source || 'Drugs.com Scraper'
      };
      
      // Save the medication to the database
      const savedMedInfo = await saveMedicationToDb(externalMedInfo, userId || undefined);
      
      return savedMedInfo || externalMedInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting medication from database or API:', error);
    toast.error('Error retrieving medication information');
    return null;
  }
};
