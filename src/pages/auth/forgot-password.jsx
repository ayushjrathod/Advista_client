import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleApiError } from "@/lib/auth-utils";
import { auth, firebaseAuthEnabled, firebaseConfigError } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const emailRef = useRef(null);

  // Auto-focus first input on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current?.value || "";

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      if (!firebaseAuthEnabled || !auth) {
        throw new Error(firebaseConfigError);
      }

      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
    } catch (error) {
      handleApiError(error, "Failed to send reset email. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <AuthShell
        title="Check your email"
        description="We've sent a Firebase password reset link to your email address."
        footer={
          <p className="text-white">
            Remember your password?{" "}
            <Link to="/sign-in" className="font-bold text-white">
              Sign in
            </Link>
          </p>
        }
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-slate-300">
              Please check your email and follow the link to reset your password securely.
            </p>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email address and we'll send you a Firebase reset link."
      footer={
        <p className="text-white">
          Remember your password?{" "}
          <Link to="/sign-in" className="font-bold text-white">
            Sign in
          </Link>
        </p>
      }
    >
      {!firebaseAuthEnabled && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-left text-sm text-amber-100">
          {firebaseConfigError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Forgot password form">
        <div className="space-y-2 text-left">
          <Label htmlFor="email" className="text-sm font-semibold text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            ref={emailRef}
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
            disabled={isLoading}
            aria-describedby="forgot-password-help"
          />
        </div>
        <div id="forgot-password-help" className="sr-only">
          Enter your email address to receive a password reset code.
        </div>
        <Button
          className="w-full rounded-lg bg-primary/90 text-primary-foreground shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)] cursor-pointer"
          type="submit"
          disabled={isLoading || !firebaseAuthEnabled}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending reset email
            </span>
          ) : (
            "Send reset email"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
