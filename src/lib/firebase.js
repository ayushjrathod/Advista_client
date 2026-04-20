import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

const requiredFirebaseKeys = ["apiKey", "authDomain", "projectId", "appId"];

export const firebaseAuthEnabled = requiredFirebaseKeys.every((key) => {
  const value = firebaseConfig[key];
  return typeof value === "string" && value.trim().length > 0;
});

export const firebaseConfigError = firebaseAuthEnabled
  ? ""
  : "Firebase auth is not configured in this client. Add the VITE_FIREBASE_* values to your Advista_client/.env file to enable sign-in.";

const firebaseApp = firebaseAuthEnabled
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;

let anonymousSignInPromise = null;

export const ensureAnonymousUser = async () => {
  if (!auth) {
    return null;
  }

  if (auth.currentUser) {
    return auth.currentUser;
  }

  if (!anonymousSignInPromise) {
    anonymousSignInPromise = signInAnonymously(auth)
      .then((credential) => credential.user)
      .finally(() => {
        anonymousSignInPromise = null;
      });
  }

  return anonymousSignInPromise;
};

export const getAuthToken = async (forceRefresh = false) => {
  if (!auth) {
    return null;
  }

  const user = auth.currentUser || (await ensureAnonymousUser());

  if (!user) {
    return null;
  }

  return user.getIdToken(forceRefresh);
};

export const buildAuthHeaders = async (headers = {}, forceRefresh = false) => {
  const token = await getAuthToken(forceRefresh);

  if (!token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
};
