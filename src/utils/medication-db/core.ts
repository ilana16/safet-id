
import { supabase } from '@/integrations/supabase/client';
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
