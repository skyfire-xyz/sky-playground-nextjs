import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";
import type { Claim, ClaimsResponse } from "@skyfire-xyz/skyfire-sdk";

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

async function getPaymentInformation(
  client: SkyfireClient,
  referenceId: string,
): Promise<Claim | undefined> {
  if (!referenceId) return;
  try {
    const paymentRes =
      await client.account.wallet.getClaimByReferenceId(referenceId);
    return paymentRes;
  } catch (err) {
    // no-op
  }
}
