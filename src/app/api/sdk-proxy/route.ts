import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";
import { get } from "lodash";

export async function POST(request: Request) {
  const req = await request.json();

  const { apiPath, payload } = req;

  if (!process.env.SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 });
  }

  // Initialize Skyfire Client
  const client = new SkyfireClient({
    apiKey: process.env.SKYFIRE_API_KEY,
    environment: process.env.SKYFIRE_APP_ENV || "production",
  });

  client.account;

  let res;
  try {
    const apiCall = get(client, apiPath);
    res = await apiCall(payload);
    console.log(res);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      const error = err as any;
      return Response.json(
        { message: error.body || error.message },
        { status: error.code },
      );
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }

  if (!res) return Response.json({ message: "Not Found" }, { status: 400 });

  // Return result without payment information
  return Response.json(res);
}
