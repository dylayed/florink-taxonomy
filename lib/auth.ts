import {
  FirebaseApp,
  FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";

import { env } from "@/env.mjs";

const clientConfig = {
  redirectUrl: env.NEXT_PUBLIC_APP_URL,
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};


const getFirebaseApp = (options: FirebaseOptions) => {
  return (!getApps().length ? initializeApp(options) : getApp()) as FirebaseApp;
};

export const useFirebaseAuth = () => {
  const getFirebaseAuth = () => {
    const auth = getAuth(getFirebaseApp(clientConfig));

    if (env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST) {
      // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
      (auth as unknown as any)._canInitEmulator = true;
      connectAuthEmulator(auth, env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST, {
        disableWarnings: true,
      });
    }
    auth.tenantId = "kwon-tz5fl";
    return auth;
  };

  return { getFirebaseAuth };
};

export const actionCodeSettings = {
  url: 'http://localhost:3000/login',
  handleCodeInApp: true,
};