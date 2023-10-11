import { Configuration, PlaidApi, PlaidEnvironments} from "plaid";
import { env } from "env.mjs";

export const plaidClient = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.NEXT_PUBLIC_PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
}));