import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";

export async function GET(request: Request) {
  if (!process.env.SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 });
  }

  const client = new SkyfireClient({
    apiKey: process.env.SKYFIRE_API_KEY,
    environment: process.env.SKYFIRE_APP_ENV || "production",
  });

  let res;
  try {
    res = await client.account.wallet.getWalletBalanceForUser();
  } catch (err) {
    if (err instanceof Error) {
      const error = err as any;
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }

  if (!res) return Response.json({ message: "Not Found" }, { status: 400 });

  return Response.json(res);
}
