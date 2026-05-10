import { createContext, useEffect, useState } from "react";
import { firebaseAuthEnabled, firebaseConfigError } from "@/lib/firebase";

export const AuthContext = createContext();

const loadApiClient = async () => {
  const module = await import("@/lib/api");
  return module.default;
};

const loadFirebaseRuntime = async () => {
  const [firebaseModule, authModule] = await Promise.all([import("@/lib/firebase"), import("firebase/auth")]);

  return {
    ...firebaseModule,
    ...authModule,
  };
};

export const AuthProvider = ({ children, deferInitialization = false }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const checkAuth = async () => {
    try {
      const api = await loadApiClient();
      const response = await api.get("/api/v1/auth/me");
      setUser(response.data?.user ?? null);
      setAuthMessage(response.data?.message || "");
    } catch {
      setUser(null);
      setAuthMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { auth, ensureAnonymousUser, signOut } = await loadFirebaseRuntime();

    if (!auth) {
      await checkAuth();
      window.location.href = "/chat";
      return;
    }

    try {
      await signOut(auth);
      await ensureAnonymousUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await checkAuth();
      window.location.href = "/chat";
    }
  };

  useEffect(() => {
    let isCancelled = false;
    let unsubscribe;
    let timeoutId;
    let idleCallbackId;

    const initializeAuth = async () => {
      if (!firebaseAuthEnabled) {
        setAuthMessage(firebaseConfigError);
        await checkAuth();
        return;
      }

      const { auth, ensureAnonymousUser, onAuthStateChanged } = await loadFirebaseRuntime();

      if (isCancelled) {
        return;
      }

      if (!auth) {
        setAuthMessage(firebaseConfigError);
        await checkAuth();
        return;
      }

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (isCancelled) {
          return;
        }

        if (!firebaseUser) {
          try {
            const anonymousUser = await ensureAnonymousUser();

            if (!isCancelled) {
              setIsAnonymous(!!anonymousUser?.isAnonymous);
            }
          } catch (error) {
            console.error("Anonymous sign-in error:", error);

            if (!isCancelled) {
              setUser(null);
              setIsAnonymous(false);
              setIsLoading(false);
            }
          }
          return;
        }

        if (!isCancelled) {
          setIsAnonymous(!!firebaseUser.isAnonymous);
        }

        await checkAuth();
      });
    };

    if (deferInitialization) {
      if ("requestIdleCallback" in window) {
        idleCallbackId = window.requestIdleCallback(() => {
          void initializeAuth();
        }, { timeout: 1800 });
      } else {
        timeoutId = window.setTimeout(() => {
          void initializeAuth();
        }, 900);
      }
    } else {
      void initializeAuth();
    }

    return () => {
      isCancelled = true;
      unsubscribe?.();

      if (idleCallbackId) {
        window.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [deferInitialization]);

  const value = {
    user,
    authMessage,
    firebaseAuthEnabled,
    firebaseConfigError,
    isLoading,
    isAuthenticated: !!user,
    isAnonymous,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
