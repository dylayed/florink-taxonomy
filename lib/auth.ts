import type { Auth, AuthError, AuthProvider, User } from "firebase/auth";

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
  signInWithPopup,
  signOut,
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

    // if (env.NEXT_PUBLIC_EMULATOR_HOST) {
    //   // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
    //   (auth as unknown as any)._canInitEmulator = true;
    //   connectAuthEmulator(auth, process.env.NEXT_PUBLIC_EMULATOR_HOST, {
    //     disableWarnings: true,
    //   });
    // }

    return auth;
  };

  return { getFirebaseAuth };
};

export const isCredentialAlreadyInUseError = (e: AuthError) =>
  e?.code === "auth/credential-already-in-use";

export const logout = async (auth: Auth): Promise<void> => {
  return signOut(auth);
};

export const actionCodeSettings = {
  url: 'http://localhost:3000/login',
  handleCodeInApp: true,
};

//   callbacks: {
//     async session({ token, session }) {
//       if (token) {
//         session.user.id = token.id
//         session.user.name = token.name
//         session.user.email = token.email
//         session.user.image = token.picture
//       }

//       return session
//     },
//     async jwt({ token, user }) {
//       const dbUser = await db.user.findFirst({
//         where: {
//           email: token.email,
//         },
//       })

//       if (!dbUser) {
//         if (user) {
//           token.id = user?.id
//         }
//         return token
//       }

//       return {
//         id: dbUser.id,
//         name: dbUser.name,
//         email: dbUser.email,
//         picture: dbUser.image,
//       }
//     },
//   },
// }
