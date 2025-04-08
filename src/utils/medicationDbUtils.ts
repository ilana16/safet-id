
import { supabase } from '@/integrations/supabase/client';
import { MedicationInfo } from './medicationData.d';
import { toast } from 'sonner';

/**
 * Increments the search count for a medication in the database
 * 
 * @param medicationName Name of the medication to increment
 * @returns Promise resolving to true if successful, false if not
 */
export const incrementMedicationSearchCount = async (medicationName: string): Promise<boolean> => {
  if (!medicationName) return false;
  
  try {
    const normalizedName = medicationName.toLowerCase().trim();
    
    console.log('Incrementing search count for:', normalizedName);
    
    // First try to get the medication to see if it exists
    const { data: existingMeds } = await supabase
      .from('medications')
      .select('id, search_count')
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
          searched_at: new Date().toISOString()
        })
        .eq('id', med.id);
      
      if (error) {
        console.error('Error incrementing medication search count:', error);
        return false;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error incrementing medication search count:', error);
    return false;
  }
};

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
          pregnancy: medicationInfo.pregnancy,
          breastfeeding: medicationInfo.breastfeeding,
          forms: medicationInfo.forms,
          source: medicationInfo.source,
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
      
      // Convert database medication to MedicationInfo format
      const medicationInfo: MedicationInfo = {
        name: dbMeds[0].name,
        genericName: dbMeds[0].generic_name,
        description: dbMeds[0].description,
        drugClass: dbMeds[0].drug_class,
        prescriptionOnly: dbMeds[0].prescription_only,
        usedFor: dbMeds[0].used_for,
        warnings: dbMeds[0].warnings,
        sideEffects: dbMeds[0].side_effects,
        interactions: dbMeds[0].interactions,
        dosage: dbMeds[0].dosage,
        forms: dbMeds[0].forms,
        interactionClassifications: dbMeds[0].interaction_classifications,
        interactionSeverity: dbMeds[0].interaction_severity,
        foodInteractions: dbMeds[0].food_interactions,
        conditionInteractions: dbMeds[0].condition_interactions,
        therapeuticDuplications: dbMeds[0].therapeutic_duplications,
        pregnancy: dbMeds[0].pregnancy,
        breastfeeding: dbMeds[0].breastfeeding,
        source: dbMeds[0].source,
        fromDatabase: true,
        databaseSearchCount: newCount
      };
      
      return medicationInfo;
    }
    
    // If not found in the database, try to get from external API
    console.log('Medication not found in database, fetching from external API');
    let externalMedInfo: MedicationInfo | null = null;
    
    // Use the preferred source to fetch the medication info
    if (preferredSource === 'drugscom') {
      // Use the drugs.com scraper
      const { fetchMedicationInfo } = await import('./modrugsApi');
      externalMedInfo = await fetchMedicationInfo(medicationName);
    } else if (preferredSource === 'webcrawler') {
      // First try Web Crawler
      externalMedInfo = await fetchWebCrawlerDrugInfo(medicationName);
      
      // If not found in Web Crawler, fallback to drugs.com
      if (!externalMedInfo) {
        console.log(`Medication not found in Web Crawler: ${medicationName}. Trying drugs.com...`);
        const { fetchMedicationInfo } = await import('./modrugsApi');
        externalMedInfo = await fetchMedicationInfo(medicationName);
      }
    } else if (preferredSource === 'elsevier') {
      // First try Elsevier
      externalMedInfo = await fetchElsevierDrugInfo(medicationName);
      
      // If not found in Elsevier, fallback to drugs.com
      if (!externalMedInfo) {
        console.log(`Medication not found in Elsevier: ${medicationName}. Trying drugs.com...`);
        const { fetchMedicationInfo } = await import('./modrugsApi');
        externalMedInfo = await fetchMedicationInfo(medicationName);
      }
    } else {
      // Default to drugs.com
      const { fetchMedicationInfo } = await import('./modrugsApi');
      externalMedInfo = await fetchMedicationInfo(medicationName);
    }
    
    if (externalMedInfo) {
      console.log('Medication found in external API:', externalMedInfo.name);
      
      // Set the source of the medication info if not already set
      if (!externalMedInfo.source) {
        externalMedInfo.source = preferredSource === 'drugscom' 
          ? 'Drugs.com Scraper' 
          : preferredSource === 'elsevier' 
            ? 'Elsevier Drug Info API' 
            : preferredSource === 'webcrawler'
              ? 'Web Crawler for Drug Interaction Data'
              : 'Drugs.com';
      }
      
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

// Import other necessary functions
import { getDrugsComUrl } from './drugsComApi';
import { fetchElsevierDrugInfo } from './elsevierApi';
import { fetchWebCrawlerDrugInfo } from './webCrawlerApi';
