import { CountryCode, LinkTokenCreateRequest, Products } from "plaid"

import { env } from "@/env.mjs"
import { User } from "@/lib/session"

const redirect_uri =
  env.PLAID_ENV == "sandbox"
    ? env.PLAID_SANDBOX_REDIRECT_URI
    : env.PLAID_REDIRECT_URI

export function linkTokenConfig(
  user: User,
  itemId?: string
): LinkTokenCreateRequest {
  const products = itemId ? [] : [Products.Transactions]
  return {
    redirect_uri,
    products,
    user: {
      client_user_id: user?.uid,
    },
    client_name: "florink",
    country_codes: [CountryCode.Us],
    language: "en",
  }
}
