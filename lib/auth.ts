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

import { clientConfig } from "@/config/firebase";

const getFirebaseApp = (options: FirebaseOptions) => {
  return (!getApps().length ? initializeApp(options) : getApp()) as FirebaseApp;
};

export const useFirebaseAuth = () => {
  const getFirebaseAuth = () => {
    const auth = getAuth(getFirebaseApp(clientConfig));

    if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
      // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
      (auth as unknown as any)._canInitEmulator = true;
      connectAuthEmulator(auth, process.env.NEXT_PUBLIC_EMULATOR_HOST, {
        disableWarnings: true,
      });
    }

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
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://www.example.com/finishSignUp?cartId=1234',
  // This must be true.
  handleCodeInApp: true,
};

export const loginWithProvider = async (
  auth: Auth,
  provider: AuthProvider
): Promise<User> => {
  // const result = await signInWithPopup(
  //   auth,
  //   provider,
  //   browserPopupRedirectResolver
  // );

  return result.user;
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
