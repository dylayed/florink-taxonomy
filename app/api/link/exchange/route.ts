import { db } from "@/lib/db"
import { plaidClient } from "@/lib/plaid"
import { getCurrentUser } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response(null, { status: 404 })
    }
    const { publicToken, institutionId, linkSessionId } = await req.json()

    const snapshot = await db
      .collection("items")
      .where("institutionId", "==", institutionId)
      .where("userId", "==", user.uid)
      .get()

    if (!snapshot.empty) {
      return new Response(
        "You have already linked an item at this institution.",
        { status: 409 }
      )
    }

    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })
    const { access_token: accessToken, item_id: itemId } = response.data
    const res = await db.collection("items").add({
      plaidInstitutionId: institutionId,
      plaidAccessToken: accessToken,
      plaidItemId: itemId,
      plaidLinkSessionId: linkSessionId,
      userId: user.uid,
    })

    // TODO: schedule transactions import based on item id.
    return new Response(JSON.stringify({ id: res.id }), { status: 201 })
  } catch (error) {
    console.error(error)
    // return new Response(JSON.stringify("INTERNAL ERROR"), { status: 500 })
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
