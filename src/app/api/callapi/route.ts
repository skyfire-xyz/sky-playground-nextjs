import { SKYFIRE_API_KEY, SKYFIRE_ENDPOINT_URL } from "@/src/config/env";
import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";
import { get, invoke } from "lodash";

// TODO: Use the Skyfire SDK to make those API calls

export async function POST(request: Request) {
  const req = await request.json();

  const { config, apiData, userInput } = req;

  if (!SKYFIRE_API_KEY) {
    return Response.json({ message: "Missing API Key" }, { status: 401 });
  }

  // Initialize Skyfire Client
  const client = new SkyfireClient({
    apiKey: process.env.SKYFIRE_API_KEY,
    environment: process.env.SKYFIRE_APP_ENV || "production",
  });

  // replace api_x placeholders with data from previous api calls
  const replacePlaceholders = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        for (const data of apiData) {
          const regex = new RegExp(`{{${data.key}}}`, "g");
          obj[key] = obj[key].replace(
            regex,
            JSON.stringify(data.value).replace(/"/g, ""),
          );
        }
        if (userInput) {
          for (let index = 0; index < userInput.length; index++) {
            const value = userInput[index];
            const regex = new RegExp(`{{user_input_${index}}}`, "g");
            obj[key] = obj[key].replace(regex, value);
          }
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        replacePlaceholders(obj[key]);
      }
    }
  };

  replacePlaceholders(config);
  const payload = config.payload;
  let path = config.path;
  let sdkPath = config.sdkPath;

  try {
    if (sdkPath) {
      try {
        const sdkAPIResponse = await invoke(client, sdkPath, payload);
        if (config.dataPath && sdkAPIResponse) {
          return Response.json(get(sdkAPIResponse, config.dataPath));
        }
        return Response.json(sdkAPIResponse);
      } catch (err) {
        const error = err as any;
        return Response.json(
          {
            message: `Call to ${sdkPath} | Error: ${error.body || error.message}`,
          },
          { status: error.code },
        );
      }
    } else {
      // Call the BE API directly
      const apiResponse = await fetch(`${SKYFIRE_ENDPOINT_URL}/${path}`, {
        method: config.method,
        headers: {
          "skyfire-api-key": SKYFIRE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }
      let jsonResponse = null;
      const contentType = apiResponse.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        jsonResponse = await apiResponse.json();
      }
      if (config.dataPath && jsonResponse) {
        return Response.json(get(jsonResponse, config.dataPath));
      }
      return Response.json(jsonResponse);
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
}
