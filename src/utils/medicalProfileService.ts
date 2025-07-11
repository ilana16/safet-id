
import { toast } from 'sonner';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsKjI3BadRGYaQ1GcFmgZEOuUWrL_3kWs",
  authDomain: "safet-id-7b807.firebaseapp.com",
  projectId: "safet-id-7b807",
  storageBucket: "safet-id-7b807.firebasestorage.app",
  messagingSenderId: "367148685926",
  appId: "1:367148685926:web:31e50a8c05adefdc796ba7",
  measurementId: "G-DJJFCXB486"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Save section data to local storage and if available, to Firestore
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

    // If logged in, save to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await saveToFirestore(section, profile[section], user.uid);
      } catch (error) {
        console.error(`Failed to sync ${section} with Firestore:`, error);
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

// Load section data from local storage or Firestore
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
    
    // Try to load from Firestore if user is logged in
    const user = auth.currentUser;
    if (user) {
      try {
        const firestoreData = await loadAllFromFirestore(user.uid);
        
        // Merge with local data
        if (firestoreData) {
          profile = { ...profile, ...firestoreData };
          
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
        console.error('Error loading data from Firestore:', error);
        // Continue with local data
      }
    }
    
    return profile;
  } catch (error) {
    console.error('Error loading all profile data:', error);
    return {};
  }
};

// Helper functions for Firestore integration
const saveToFirestore = async (section: string, data: any, userId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'medical_profiles', userId, 'sections', section);
    await setDoc(docRef, {
      data: data,
      updated_at: new Date().toISOString()
    }, { merge: true });
      
    console.log(`Successfully saved ${section} to Firestore`);
    return true;
  } catch (error) {
    console.error(`Error saving ${section} to Firestore:`, error);
    return false;
  }
};

const loadAllFromFirestore = async (userId: string): Promise<Record<string, any>> => {
  try {
    console.log(`Loading all sections from Firestore for user ${userId}`);
    
    const q = query(collection(db, 'medical_profiles', userId, 'sections'));
    const querySnapshot = await getDocs(q);
    
    const result: Record<string, any> = {};
    querySnapshot.forEach((doc) => {
      result[doc.id] = doc.data().data;
    });
    
    console.log('Successfully loaded data from Firestore:', Object.keys(result));
    return result;
  } catch (error) {
    console.error('Error loading data from Firestore:', error);
    return {};
  }
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


