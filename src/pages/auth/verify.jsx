import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/use-auth";
import { handleApiError } from "@/lib/auth-utils";
import { auth, firebaseAuthEnabled, firebaseConfigError } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const params = useParams();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { checkAuth, user } = useAuth();

  const handleVerificationRefresh = async () => {
    if (!firebaseAuthEnabled || !auth) {
      handleApiError(new Error(firebaseConfigError), firebaseConfigError, true);
      return;
    }

    if (!auth.currentUser) {
      navigate("/chat", { replace: true });
      return;
    }

    setIsChecking(true);
    try {
      await auth.currentUser.reload();
      await checkAuth();

      if (auth.currentUser.emailVerified || user?.is_verified) {
        navigate("/chat", { replace: true });
        return;
      }

      handleApiError(new Error("Email is not verified yet. You can keep using the app and verify later."), undefined, true);
    } catch (error) {
      handleApiError(error, "Verification check failed. Please try again.", false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      if (!firebaseAuthEnabled || !auth) {
        throw new Error(firebaseConfigError);
      }

      if (!auth.currentUser) {
        throw new Error("Please sign in again to resend the verification email.");
      }

      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      handleApiError(error, "Failed to resend verification email. Please try again.", false);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell
      title="Verify your account"
      description={`We sent a verification link to ${params.email}. Verify whenever convenient—your workflow is not blocked.`}
      footer={
        <p className="text-white">
          Want to skip this for now?{" "}
          <Link to="/chat" className="font-semibold text-white">
            continue to chat
          </Link>
          .
        </p>
      }
    >
      <div className="space-y-6" role="status" aria-label="Email verification instructions">
        {!firebaseAuthEnabled && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-left text-sm text-amber-100">
            {firebaseConfigError}
          </div>
        )}
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 text-left text-slate-300">
          <p className="text-sm leading-6">
            The verification email comes from Firebase Auth. If you do not see it, check spam and promotions, then resend it below.
          </p>
        </div>
        <div id="verify-help" className="sr-only">
          Open the verification email, click the link, then press the button below to continue.
        </div>
          <Button
            type="button"
            onClick={handleVerificationRefresh}
            disabled={isChecking || !firebaseAuthEnabled}
            className="w-full rounded-lg bg-primary/90 text-primary-foreground shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)] cursor-pointer"
          >
            {isChecking ? "Checking..." : "I've verified my email"}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || !firebaseAuthEnabled}
              className="text-sm text-sky-400 hover:text-sky-300 underline disabled:opacity-50 cursor-pointer"
            >
              {isResending ? "Sending..." : "Didn't receive an email? Resend"}
            </button>
          </div>
      </div>
    </AuthShell>
  );
}
