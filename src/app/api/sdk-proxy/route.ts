import {
  SKYFIRE_API_KEY,
  SKYFIRE_ENV,
  SKYFIRE_SDK_BASELINE_URL,
} from "@/src/config/env";
import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";
import { get, invoke } from "lodash";

export async function POST(request: Request) {
  const req = await request.json();

  const { apiPath, payload } = req;

  if (!process.env.SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 });
  }

  // Initialize Skyfire Client
  const client = new SkyfireClient({
    apiKey: SKYFIRE_API_KEY,
    environment: SKYFIRE_ENV,
    baseUrl: SKYFIRE_SDK_BASELINE_URL,
  });

  client.account;

  let res;
  try {
    // e.g. client.account.wallet.getWalletBalanceForUser
    res = await invoke(client, apiPath, payload);
  } catch (err) {
    const error = err as any;
    return Response.json(
      { message: `Call to ${apiPath} | Error: ${error.body || error.message}` },
      { status: error.code },
    );
  }

  if (!res) return Response.json({ message: "Not Found" }, { status: 400 });

  // Return result without payment information
  return Response.json(res);
}
