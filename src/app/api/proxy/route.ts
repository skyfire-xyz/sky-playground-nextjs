import axios from "axios";
import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";
import { API_BASE_URL } from "@/src/config/envs";

export async function POST(request: Request) {
  const req = await request.json();

  const { messages, model } = req;

  if (!process.env.SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 });
  }

  const client = new SkyfireClient({
    apiKey: process.env.SKYFIRE_API_KEY,
    environment: process.env.SKYFIRE_APP_ENV || "production",
  });

  let res;
  try {
    switch (req.chatType) {
      case "openrouter":
        res = await client.chat.createOpenRouterChatCompletionWithHttpInfo({
          messages: messages,
          model,
        });

        break;
      case "openai":
        res = await client.chat.createOpenAIChatCompletionWithHttpInfo({
          messages: messages,
          model,
        });

        break;
    }
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

  // Query Payment Information with referenceId
  let paymentRes;
  try {
    const referenceId = res.headers["skyfire-payment-reference-id"];

    // TODO: Use SDK when endpoint is available.
    paymentRes = await axios.get(
      `${API_BASE_URL}/v1/wallet/claimByReferenceId/${referenceId}`,
      {
        headers: {
          "skyfire-api-key": process.env.SKYFIRE_API_KEY,
        },
      },
    );
  } catch (err) {
    // no-op
  }

  if (paymentRes) {
    return Response.json({
      ...res,
      data: {
        ...res.data,
        payment: paymentRes.data,
      },
    });
  }

  return Response.json(res);
}
