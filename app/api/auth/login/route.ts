export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    console.log(searchParams);
    return Response.json({ foo: "bar" })
  }