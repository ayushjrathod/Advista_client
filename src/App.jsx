import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

const LandingPage = lazy(() => import("./pages/landingPage"));
const AboutPage = lazy(() => import("./pages/about"));
const TermsOfServicePage = lazy(() => import("./pages/footer/terms-of-service"));
const PrivacyPolicyPage = lazy(() => import("./pages/footer/privacy-policy"));
const DocumentationPage = lazy(() => import("./pages/footer/documentation"));
const BlogPage = lazy(() => import("./pages/footer/blog"));
const ChangelogPage = lazy(() => import("./pages/footer/changelog"));
const ApiReferencePage = lazy(() => import("./pages/footer/api-reference"));
const CareersPage = lazy(() => import("./pages/footer/careers"));
const ContactPage = lazy(() => import("./pages/footer/contact"));
const CustomersPage = lazy(() => import("./pages/footer/customers"));
const SupportPage = lazy(() => import("./pages/footer/support"));
const StatusPage = lazy(() => import("./pages/footer/status"));
const FaqPage = lazy(() => import("./pages/footer/faq"));
const SignInForm = lazy(() => import("./pages/auth/signin"));
const SignUpForm = lazy(() => import("./pages/auth/signup"));
const VerifyAccount = lazy(() => import("./pages/auth/verify"));
const ForgotPasswordForm = lazy(() => import("./pages/auth/forgot-password"));
const ResetPasswordForm = lazy(() => import("./pages/auth/reset-password"));
const ChatBot = lazy(() => import("./pages/chatbot"));
const ResearchReport = lazy(() => import("./pages/research-report"));

function AppLoadingFallback() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center text-zinc-300">
      Loading...
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<AppLoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/api-reference" element={<ApiReferencePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/verify/:email" element={<VerifyAccount />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password/:email" element={<ResetPasswordForm />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/research-report" element={<ResearchReport />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
