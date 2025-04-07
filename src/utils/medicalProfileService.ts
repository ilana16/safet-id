
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Save section data to local storage and if available, to Supabase
export const saveSectionData = async (section: string, data?: any): Promise<boolean> => {
  try {
    if (!section) {
      console.error('No section specified for saving');
      return false;
    }

    console.log(`Saving ${section} section data to storage`);
    
    // If data is not provided, try to get it from the window object
    if (!data) {
      const windowKey = getWindowKeyForSection(section);
      if (windowKey && (window as any)[windowKey]) {
        data = (window as any)[windowKey];
      }
    }

    if (!data) {
      console.error(`No data provided for section ${section} and none found in window object`);
      return false;
    }

    // Load existing profile data
    let profileJson = localStorage.getItem('medicalProfile');
    let profile = profileJson ? JSON.parse(profileJson) : {};
    
    // Update section data
    profile[section] = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    // Save back to local storage
    localStorage.setItem('medicalProfile', JSON.stringify(profile));
    sessionStorage.setItem(`medicalProfile_${section}`, JSON.stringify(profile[section]));
    
    console.log(`${section} data saved successfully`);

    // If logged in, save to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        await saveToSupabase(section, profile[section], session.user.id);
      } catch (error) {
        console.error(`Failed to sync ${section} with Supabase:`, error);
        // We still return true because local saving was successful
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving ${section} section data:`, error);
    toast.error(`Failed to save ${section} data`);
    return false;
  }
};

// Load section data from local storage or Supabase
export const loadSectionData = (section: string): any => {
  try {
    if (!section) {
      console.error('No section specified for loading');
      return {};
    }

    console.log(`Loading ${section} data from storage`);
    
    // Try to get from session storage first (faster)
    const sessionData = sessionStorage.getItem(`medicalProfile_${section}`);
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        console.log(`Found ${section} data in sessionStorage:`, parsedData);
        
        // Set to window object
        const windowKey = getWindowKeyForSection(section);
        if (windowKey) {
          (window as any)[windowKey] = { ...parsedData };
        }
        
        return parsedData;
      } catch (e) {
        console.error(`Error parsing ${section} data from sessionStorage:`, e);
      }
    }
    
    // Fall back to localStorage
    const profileJson = localStorage.getItem('medicalProfile');
    if (profileJson) {
      try {
        const profile = JSON.parse(profileJson);
        if (profile && profile[section]) {
          console.log(`Found ${section} data in localStorage:`, profile[section]);
          
          // Set to window object
          const windowKey = getWindowKeyForSection(section);
          if (windowKey) {
            (window as any)[windowKey] = { ...profile[section] };
          }
          
          // Cache in sessionStorage for faster subsequent access
          sessionStorage.setItem(`medicalProfile_${section}`, JSON.stringify(profile[section]));
          
          return profile[section];
        }
      } catch (e) {
        console.error(`Error parsing ${section} data from localStorage:`, e);
      }
    }
    
    console.log(`No ${section} data found in storage, returning empty object`);
    return {};
  } catch (error) {
    console.error(`Error loading ${section} section data:`, error);
    return {};
  }
};

// Load all data from storage
export const loadAllSectionData = async (): Promise<Record<string, any>> => {
  try {
    console.log('Loading all profile data from storage');
    
    const profileJson = localStorage.getItem('medicalProfile');
    let profile: Record<string, any> = profileJson ? JSON.parse(profileJson) : {};
    
    // Set windows global objects
    Object.keys(profile).forEach(section => {
      const windowKey = getWindowKeyForSection(section);
      if (windowKey) {
        (window as any)[windowKey] = { ...profile[section] };
      }
    });
    
    // Try to load from Supabase if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        const supabaseData = await loadAllFromSupabase(session.user.id);
        
        // Merge with local data
        if (supabaseData) {
          profile = { ...profile, ...supabaseData };
          
          // Update windows global objects with merged data
          Object.keys(profile).forEach(section => {
            const windowKey = getWindowKeyForSection(section);
            if (windowKey) {
              (window as any)[windowKey] = { ...profile[section] };
            }
          });
          
          // Save merged data back to localStorage
          localStorage.setItem('medicalProfile', JSON.stringify(profile));
        }
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        // Continue with local data
      }
    }
    
    return profile;
  } catch (error) {
    console.error('Error loading all profile data:', error);
    return {};
  }
};

// Helper functions for Supabase integration
const saveToSupabase = async (section: string, data: any, userId: string): Promise<boolean> => {
  try {
    // Create a database-friendly section name
    const dbSection = section.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    console.log(`Saving ${section} to Supabase for user ${userId}`);
    
    const { error } = await supabase
      .from('user_medical_data')
      .upsert({
        user_id: userId,
        section: dbSection,
        data: data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,section'
      });
      
    if (error) {
      throw error;
    }
    
    console.log(`Successfully saved ${section} to Supabase`);
    return true;
  } catch (error) {
    console.error(`Error saving ${section} to Supabase:`, error);
    return false;
  }
};

const loadAllFromSupabase = async (userId: string): Promise<Record<string, any>> => {
  try {
    console.log(`Loading all sections from Supabase for user ${userId}`);
    
    const { data, error } = await supabase
      .from('user_medical_data')
      .select('section, data, updated_at')
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No data found in Supabase');
      return {};
    }
    
    const result: Record<string, any> = {};
    
    data.forEach(item => {
      // Convert database section name back to application format
      const appSection = convertDbSectionToAppSection(item.section);
      result[appSection] = item.data;
    });
    
    console.log('Successfully loaded data from Supabase:', Object.keys(result));
    return result;
  } catch (error) {
    console.error('Error loading data from Supabase:', error);
    return {};
  }
};

// Helper function to convert database section names to application section names
const convertDbSectionToAppSection = (dbSection: string): string => {
  // Map of database section names to application section names
  const sectionMap: Record<string, string> = {
    personal: 'personal',
    medical_history: 'history',
    medications: 'medications',
    allergies: 'allergies',
    immunizations: 'immunizations',
    social_history: 'social',
    reproductive_history: 'reproductive',
    mental_health: 'mental',
    functional_status: 'functional',
    cultural_preferences: 'cultural'
  };
  
  return sectionMap[dbSection] || dbSection;
};

// Helper function to get window key for a section
export const getWindowKeyForSection = (section: string): string => {
  switch (section) {
    case 'personal': return 'personalFormData';
    case 'history': return 'historyFormData';
    case 'medications': return 'medicationsFormData';
    case 'allergies': return 'allergiesFormData';
    case 'immunizations': return 'immunizationsFormData';
    case 'social': return 'socialHistoryFormData';
    case 'reproductive': return 'reproductiveHistoryFormData';
    case 'mental': return 'mentalHealthFormData';
    case 'functional': return 'functionalStatusFormData';
    case 'cultural': return 'culturalPreferencesFormData';
    default: return '';
  }
};
