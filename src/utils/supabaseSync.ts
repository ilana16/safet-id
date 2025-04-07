
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Syncs a medical profile section to Supabase
 * 
 * @param userId User ID
 * @param section Section name
 * @param data Section data (will be stored as JSON)
 * @returns Promise resolving to success status
 */
export const syncSectionToSupabase = async (
  userId: string,
  section: string,
  data: any
): Promise<boolean> => {
  try {
    console.log(`Syncing ${section} to Supabase for user ${userId}`);
    
    // Check if a record already exists for this user and section
    const { data: existingData, error: fetchError } = await supabase
      .from('medical_profiles')
      .select('id')
      .eq('user_id', userId)
      .eq('section', section)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching existing record:', fetchError);
      return false;
    }
    
    // If record exists, update it; otherwise, insert a new one
    if (existingData?.id) {
      const { error } = await supabase
        .from('medical_profiles')
        .update({ 
          data: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
      
      if (error) {
        console.error('Error updating record in Supabase:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('medical_profiles')
        .insert({
          user_id: userId,
          section: section,
          data: data
        });
      
      if (error) {
        console.error('Error inserting record to Supabase:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error syncing ${section} to Supabase:`, error);
    return false;
  }
};

/**
 * Loads all medical profile sections for a user from Supabase
 * 
 * @param userId User ID
 * @returns Promise resolving to sections data
 */
export const loadProfileFromSupabase = async (
  userId: string
): Promise<Record<string, any>> => {
  try {
    console.log(`Loading profile data from Supabase for user ${userId}`);
    
    const { data, error } = await supabase
      .from('medical_profiles')
      .select('section, data, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching profile data from Supabase:', error);
      return {};
    }
    
    if (!data || data.length === 0) {
      console.log('No profile data found in Supabase');
      return {};
    }
    
    // Convert array of records to object with section as key
    const profileData: Record<string, any> = {};
    data.forEach(record => {
      profileData[record.section] = record.data;
    });
    
    console.log('Loaded profile data from Supabase:', Object.keys(profileData));
    return profileData;
  } catch (error) {
    console.error('Error loading profile from Supabase:', error);
    return {};
  }
};

/**
 * Loads a specific section of the medical profile from Supabase
 * 
 * @param userId User ID
 * @param section Section name
 * @returns Promise resolving to section data
 */
export const loadSectionFromSupabase = async (
  userId: string,
  section: string
): Promise<any> => {
  try {
    console.log(`Loading section ${section} from Supabase for user ${userId}`);
    
    const { data, error } = await supabase
      .from('medical_profiles')
      .select('data')
      .eq('user_id', userId)
      .eq('section', section)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching ${section} data from Supabase:`, error);
      return null;
    }
    
    return data?.data || null;
  } catch (error) {
    console.error(`Error loading ${section} from Supabase:`, error);
    return null;
  }
};
