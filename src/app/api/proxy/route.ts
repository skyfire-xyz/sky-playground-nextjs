import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";

export async function POST(request: Request) {
  const req = await request.json();

  const { messages, model } = req;

  if (!process.env.SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 400 });
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

  console.log(res, "res");

  if (!res)
    return Response.json({ message: "Internal Server Error" }, { status: 500 });

  return Response.json(res);
}
