import { Navigate, Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin.jsx';
import FeedbackContact from './pages/FeedbackContact.jsx';
import Home from './pages/Home.jsx';
import InstallApp from './pages/InstallApp.jsx';
import OrderDevice from './pages/OrderDevice.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import UserAgreement from './pages/UserAgreement.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/install-app" element={<InstallApp />} />
      <Route path="/order-device" element={<OrderDevice />} />
      <Route path="/feedback-contact" element={<FeedbackContact />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/user-agreement" element={<UserAgreement />} />
      <Route path="/feedback" element={<Navigate to="/feedback-contact" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}