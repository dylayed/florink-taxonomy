import { NextApiRequest } from "next"

import { linkTokenConfig } from "@/config/plaid"
import { plaidClient } from "@/lib/plaid"
import { getCurrentUser } from "@/lib/session"

export async function POST(req: NextApiRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response(null, { status: 404 })
    }

    const { itemId } = req.body
    const config = linkTokenConfig(user, itemId)
    const createTokenResponse = await plaidClient.linkTokenCreate(config)
    return new Response(JSON.stringify(createTokenResponse.data))
  } catch (error) {
    console.log(error)
    return new Response(null, { status: 500 })
  }
}
