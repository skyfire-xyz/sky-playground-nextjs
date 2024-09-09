import { SKYFIRE_API_KEY, SKYFIRE_ENDPOINT_URL } from "@/src/config/env";

export async function POST(request: Request) {
  const req = await request.json();
  const { messages, model, chatType } = req;

  if (!SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 });
  }

  const streamResponse = await fetch(
    `${SKYFIRE_ENDPOINT_URL}/proxy/${chatType}/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "skyfire-api-key": SKYFIRE_API_KEY,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    },
  );

  if (!streamResponse.ok) {
    return Response.json(
      { message: "API request failed" },
      { status: streamResponse.status },
    );
  }

  // Create a TransformStream to process the incoming data
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      // Process the chunk if needed
      controller.enqueue(chunk);
    },
  });

  // Pipe the response body through the transform stream
  if (streamResponse.body) {
    const stream = streamResponse.body.pipeThrough(transformStream);
    // Create and return a streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "skyfire-payment-reference-id":
          streamResponse.headers.get("skyfire-payment-reference-id") || "",
        Connection: "keep-alive",
      },
    });
  }
}
