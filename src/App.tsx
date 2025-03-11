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

// This component watches for navigation changes and triggers events
function NavigationTracker() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Dispatch a custom event when navigation happens
    console.log('Navigation change detected, dispatching navigationChange event');
    window.dispatchEvent(new Event('navigationChange'));
    
    // If we navigate to a section, dispatch a specific event for that section
    const pathParts = location.pathname.split('/');
    const currentSection = pathParts[pathParts.length - 1];
    
    if (currentSection && currentSection !== 'profile') {
      console.log(`Dispatching ${currentSection}DataRequest event`);
      window.dispatchEvent(new Event(`${currentSection}DataRequest`));
    }
  }, [location, navigationType]);

  return null;
}

function App() {
  return (
    <>
      <Router>
        <NavigationTracker />
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
    </>
  );
}

export default App;
