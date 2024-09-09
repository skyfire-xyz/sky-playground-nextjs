import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";

export async function GET(request: Request) {
  if (!process.env.SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 });
  }
  const url = new URL(request.url);
  const referenceId = url.searchParams.get("referenceId");

  if (!referenceId) {
    return Response.json({ message: "Missing Reference ID" }, { status: 404 });
  }

  const client = new SkyfireClient({
    apiKey: process.env.SKYFIRE_API_KEY,
    environment: process.env.SKYFIRE_APP_ENV || "production",
  });

  let res;
  try {
    res = await client.account.wallet.getClaimByReferenceId(referenceId);
  } catch (err) {
    const error = err as any;
    return Response.json({ message: error.message }, { status: error.code });
  }

  if (!res) return Response.json({ message: "Not Found" }, { status: 400 });

  return Response.json(res);
}
