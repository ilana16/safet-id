
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import BasicSection from './pages/medical-profile/BasicSection';
import HistorySection from './pages/medical-profile/HistorySection';
import MedicationsSection from './pages/medical-profile/MedicationsSection';
import AllergiesSection from './pages/medical-profile/AllergiesSection';
import SocialSection from './pages/medical-profile/SocialSection';
import ReproductiveSection from './pages/medical-profile/ReproductiveSection';
import MentalSection from './pages/medical-profile/MentalSection';
import FunctionalSection from './pages/medical-profile/FunctionalSection';
import CulturalSection from './pages/medical-profile/CulturalSection';
import PreventativeSection from './pages/medical-profile/PreventativeSection';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/profile/edit/:section?" element={<MedicalProfileForm />} />
          <Route path="/profile/edit" element={<MedicalProfileForm />} />
          
          <Route path="/profile" element={<MedicalProfile />}>
            <Route path="personal" element={<PersonalSection />} />
            <Route path="basic" element={<BasicSection />} />
            <Route path="history" element={<HistorySection />} />
            <Route path="medications" element={<MedicationsSection />} />
            <Route path="allergies" element={<AllergiesSection />} />
            <Route path="social" element={<SocialSection />} />
            <Route path="reproductive" element={<ReproductiveSection />} />
            <Route path="mental" element={<MentalSection />} />
            <Route path="functional" element={<FunctionalSection />} />
            <Route path="cultural" element={<CulturalSection />} />
            <Route path="preventative" element={<PreventativeSection />} />
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
