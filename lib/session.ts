import { cookies } from "next/headers";
import { getTokens, getTokensFromObject } from "next-firebase-auth-edge/lib/next/tokens";
import { Tokens } from "next-firebase-auth-edge/lib/auth";
import { Claims, filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import type { UserInfo } from "firebase/auth";

import { authConfig } from "@/config/auth";

export interface User extends Omit<UserInfo, "providerId"> {
  emailVerified: boolean;
  customClaims: Claims;
  tenantId: string | null;
}

function mapTokensToUser({ decodedToken }: Tokens): User  {
  const {
    uid,
    email,
    firebase,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
  } = decodedToken;

  const customClaims = filterStandardClaims(decodedToken);

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    tenantId: firebase?.tenant ?? null,
    customClaims
  };
};

export async function getCurrentUser(): Promise<User|null> {
  const tokens = await getTokens(cookies(), authConfig);
  return tokens ? mapTokensToUser(tokens) : null;
}