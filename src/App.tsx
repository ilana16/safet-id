
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
          <Route path="/profile/view" element={<MedicalRecordView />} />
          <Route path="/view/:userId" element={<ViewOnly />} />
          <Route path="/view/:userId/:accessCode" element={<ViewOnly />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
