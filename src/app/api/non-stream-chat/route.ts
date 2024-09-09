import { SKYFIRE_API_KEY, SKYFIRE_ENV } from "@/src/config/env";
import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";

export async function POST(request: Request) {
  const req = await request.json();

  const { messages, model } = req;

  if (!SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 });
  }

  // Initialize Skyfire Client
  const client = new SkyfireClient({
    apiKey: SKYFIRE_API_KEY,
    environment: SKYFIRE_ENV,
  });

  let res;
  try {
    switch (req.chatType) {
      case "openrouter":
        // Call OpenRouter Chat Completion API from SDK
        res = await client.chat.createOpenRouterChatCompletionWithHttpInfo({
          messages: messages, // e.g. [{ content: "what is the sum of 10 + 11?", role: "user" }],
          model, // model: "gpt-4o",
        });
        break;
      case "openai":
        // Call OPenAI Chat Completion API from SDK
        res = await client.chat.createOpenAIChatCompletionWithHttpInfo({
          messages: messages, // e.g. [{ content: "what is the sum of 10 + 11?", role: "user" }],
          model, // model: "gpt-4o",
        });

        break;
    }
  } catch (err) {
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

  /*
   * Process payment information
   * Payments are processed asynchronously and the response from the SDK does not contain payment information.
   * We can use the referenceId from the response headers to fetch the payment information.
   */
  const referenceId = res.headers["skyfire-payment-reference-id"];
  if (referenceId) {
    try {
      const paymentRes =
        await client.account.wallet.getClaimByReferenceId(referenceId);
      if (paymentRes) {
        // Return result with payment information
        return Response.json({
          ...res,
          data: {
            ...res.data,
            payment: paymentRes,
          },
        });
      }
    } catch (err) {
      // no-op
    }
  }

  // Return result without payment information
  return Response.json(res);
}
