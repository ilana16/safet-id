
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect } from 'react';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import Register from './pages/Register';
import Login from './pages/Login';
import MedicalProfileForm from './pages/MedicalProfileForm';
import ViewOnly from './pages/ViewOnly';
import MedicalRecordView from './pages/MedicalRecordView';
import FullMedicalRecord from './pages/FullMedicalRecord';
import ProxyRegister from './pages/ProxyRegister';
import MedicalProfile from './pages/MedicalProfile';
import PersonalSection from './pages/medical-profile/PersonalSection';
import HistorySection from './pages/medical-profile/HistorySection';
import MedicationsSection from './pages/medical-profile/MedicationsSection';
import AllergiesSection from './pages/medical-profile/AllergiesSection';
import SocialSection from './pages/medical-profile/SocialSection';
import ReproductiveSection from './pages/medical-profile/ReproductiveSection';
import MentalSection from './pages/medical-profile/MentalSection';
import FunctionalSection from './pages/medical-profile/FunctionalSection';
import CulturalSection from './pages/medical-profile/CulturalSection';
import ImmuneSection from './pages/medical-profile/ImmuneSection';
import { 
  loadAllSectionData, 
  saveAllSectionData, 
  initializeAutoSave, 
  initializeDataSyncListeners, 
  loadSectionData 
} from './utils/medicalProfileService';
import { MedicalProfileProvider } from './contexts/MedicalProfileContext';

// This component manages data persistence and navigation events
function DataPersistenceManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    console.log('Navigation change detected at', new Date().toISOString());
    console.log('Current location:', location.pathname);
    
    // Always save all section data on navigation
    saveAllSectionData();
    
    // Load all data for the new location
    loadAllSectionData();
    
    // Dispatch event for components to respond to
    window.dispatchEvent(new Event('navigationChange'));
    
    // If we're navigating to a specific section, load that section data
    const pathParts = location.pathname.split('/');
    const currentSection = pathParts[pathParts.length - 1];
    
    if (pathParts.includes('profile') && currentSection && currentSection !== 'profile') {
      console.log(`Loading specific section data for: ${currentSection}`);
      loadSectionData(currentSection);
      
      // Dispatch section-specific event
      window.dispatchEvent(new Event(`${currentSection}DataRequest`));
    }
    
    // Set up auto-save (every 15 seconds) and data sync
    const clearAutoSave = initializeAutoSave(15000);
    const clearDataSync = initializeDataSyncListeners();
    
    return () => {
      clearAutoSave();
      clearDataSync();
      saveAllSectionData();
    };
  }, [location, navigationType]);

  return null;
}

// Handles saving data when the page is unloaded
function PageUnloadHandler() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveAllSectionData();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveAllSectionData();
    };
  }, []);

  return null;
}

function App() {
  // Initialize data when the app starts
  useEffect(() => {
    console.log('App initialized - loading all medical profile data');
    loadAllSectionData();
  }, []);

  return (
    <MedicalProfileProvider>
      <Router>
        <DataPersistenceManager />
        <PageUnloadHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/profile/edit/:section?" element={<MedicalProfileForm />} />
          <Route path="/profile/edit" element={<MedicalProfileForm />} />
          
          <Route path="/profile" element={<MedicalProfile />}>
            <Route path="personal" element={<PersonalSection />} />
            <Route path="history" element={<HistorySection />} />
            <Route path="medications" element={<MedicationsSection />} />
            <Route path="allergies" element={<AllergiesSection />} />
            <Route path="immunizations" element={<ImmuneSection />} />
            <Route path="social" element={<SocialSection />} />
            <Route path="reproductive" element={<ReproductiveSection />} />
            <Route path="mental" element={<MentalSection />} />
            <Route path="functional" element={<FunctionalSection />} />
            <Route path="cultural" element={<CulturalSection />} />
            <Route index element={<PersonalSection />} />
          </Route>
          
          <Route path="/profile/view" element={<MedicalRecordView />} />
          <Route path="/profile/history" element={<FullMedicalRecord />} />
          <Route path="/view/:userId" element={<ViewOnly />} />
          <Route path="/view/:userId/:accessCode" element={<ViewOnly />} />
          <Route path="/proxy/register/:token" element={<ProxyRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </MedicalProfileProvider>
  );
}

export default App;
