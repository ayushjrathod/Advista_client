import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AboutPage from "./pages/about";
import ForgotPasswordForm from "./pages/auth/forgot-password";
import ResetPasswordForm from "./pages/auth/reset-password";
import SignInForm from "./pages/auth/signin";
import SignUpForm from "./pages/auth/signup";
import VerifyAccount from "./pages/auth/verify";
import ChatBot from "./pages/chatbot";
import LandingPage from "./pages/landingPage";
import ResearchReport from "./pages/research-report";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/verify/:email" element={<VerifyAccount />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:email" element={<ResetPasswordForm />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/research-report" element={<ResearchReport />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
