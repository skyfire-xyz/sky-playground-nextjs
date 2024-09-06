export type ProxyType = "openai" | "openrouter" | "openrouter-stream" | string;

export type Model = {
  model: string;
  proxyType: ProxyType;
};

export type APICallConfig = {
  /** path of the proxy call */
  path: string;
  method: "GET" | "POST";
  /**
   * object payload of the data for put requests. Templates are supported in the payload.
   */
  payload?: any;
  /**
   * the data path to extract the data from the response to make it available for other api calls.
   * If not provided, the whole api call response is used.
   */
  dataPath?: string;
};

export type ModelMessage = { content: string; role: string };

export type ModelInputConfig = {
  instruction: string;
  placeholder: string;
  defaultValue?: string;
};
export type ModelInputModal = {
  title: string;
  userInputs: ModelInputConfig[];
};
export type ModelTemplate = {
  title: string;
  model: string;
  inputModal?: ModelInputModal;
  /**
   * the user message prompt to pass to llm to get an response that will be
   * passed to the chat panel.
   */
  prompt?: string;
  /**
   * Services used by the template.
   */
  services?: string;
  /**
   * a description of the template and what it does.
   */
  description?: string;
  proxyType: ProxyType;
  /** an optional list of api calls to call before a stream call to chat */
  apiCalls?: APICallConfig[];
  stream?: boolean;
  /**
   * the messages to pass to llm for chat completion, this will be pass to the chat panel to show to the user.
   * Use this if you need to use templates ({{api_0}}) in the messages or when you need to pass multiple messages and roles.
   * Either messages or prompt can be used, but if messages are provided, prompt will be ignored.
   */
  messages?: ModelMessage[];
};

export const availableTemplates: ModelTemplate[] = [
  {
    title: "Tell me a story",
    proxyType: "openrouter",
    stream: true,
    services: "GPT-4o",
    model: "gpt-4o",
    prompt: "tell me a bedtime story",
  },
  {
    title: "Teach me how to best cook a steak",
    proxyType: "openrouter",
    stream: true,
    services: "Gemini-Pro-1.5",
    model: "google/gemini-pro-1.5",
    prompt: "what's the best way to cook a steak",
  },
  {
    title: "Show my current balance",
    proxyType: "openrouter",
    stream: true,
    services: "User Account + GPT-4o",
    model: "openai/chatgpt-4o-latest",
    apiCalls: [
      {
        path: "v1/wallet/balance",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. The assitant will fetch the JSON data of the user's balance. If asked for wallet ballance, the escrow.available part of the JSON is the user's usable balance. All amounts in the JSON is in the smallest USDC unit. When showing to the user, divide all amounts by 10^6, to show the user-friendly USDC unit.",
        role: "system",
      },
      {
        content: "User's wallet details. \n{{api_0}}",
        role: "assistant",
      },
      {
        content: "What is my balance?",
        role: "user",
      },
    ],
  },
  {
    title: "Show my last 5 transactions",
    proxyType: "openrouter",
    stream: true,
    services: "User Account + GPT-4o",
    model: "openai/chatgpt-4o-latest",
    apiCalls: [
      {
        path: "v1/wallet/claims?size=5",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. The assistant will get user's payments in JSON via the API. When answering for how many payments the user made, show the last 5 payments. Show the id, destination, amount and date. Do not show the source or status. Show the date in a user friendly format including the time in PST (indicate PST). All payment amounts should be divided 10^6, to and shown as USDC.",
        role: "system",
      },
      {
        content: "User payments\n{{api_0}}",
        role: "assistant",
      },
      {
        content: "My last 5 payments?",
        role: "user",
      },
    ],
  },
  {
    title: "Email me Twitter trends",
    proxyType: "openrouter",
    stream: true,
    inputModal: {
      title: "Choose your Twitter Topic",
      userInputs: [
        {
          placeholder: "Default: Football",
          instruction: "Send me an email of today’s top Tweets about:",
          defaultValue: "Football",
        },
        {
          placeholder: "Email Address",
          instruction: "Enter your email address:",
          defaultValue: "",
        },
      ],
    },
    model: "openai/chatgpt-4o-latest",
    services: "Vetric + Email + GPT-4o",
    description:
      "Enter a Twitter topic and an email with the top tweets is sent to you.",
    apiCalls: [
      {
        path: "v1/receivers/vetric/twitter/top?query={{user_input_0}}",
        method: "GET",
      },
      {
        path: "proxy/openrouter/v1/chat/completions",
        method: "POST",
        payload: {
          model: "openai/chatgpt-4o-latest",
          messages: [
            {
              content:
                "Return an HTML formatted response.  All line breaks and '\n' should be replaced with BR tags. The content is a summary of today's top Tweets about {{user_input_0}} using the following JSON data of top tweets about AI. Include all details about all the tweets in the data, do not miss anything. Provide links to the tweet if available. {{api_0}}",
              role: "user",
            },
          ],
        },
        dataPath: "choices[0].message.content",
      },
      {
        path: "v1/receivers/toolkit/send-email",
        method: "POST",
        payload: {
          emailData: "{{api_1}}",
          recipientEmail: "{{user_input_1}}",
        },
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. You have the ability to get top Tweets about a top and send it to the user's email. If the user askes for the email you send, give the email content and the email address you sent to. Return to the user a user friendly response",
        role: "system",
      },
      {
        content: `Send me an email of today’s top Tweets about {{user_input_0}}.`,
        role: "user",
      },
      {
        content: "Email sent to {{user_input_1}}.\nEmailed content: {{api_1}}",
        role: "assistant",
      },
      {
        content:
          "Tell me the content in a user friendly format with links and images and what email address you sent to.",
        role: "user",
      },
    ],
  },
  {
    title: "Analyze a company's income statements",
    proxyType: "openrouter",
    stream: true,
    inputModal: {
      title: "Input a Company",
      userInputs: [
        {
          placeholder: "Default: Tesla",
          instruction:
            "Enter the name of a company to analyze its income statements:",
          defaultValue: "Tesla",
        },
        {
          placeholder: "Default: 5",
          instruction:
            "How many years of income statements you want a report on:",
          defaultValue: "5",
        },
      ],
    },
    model: "openai/chatgpt-4o-latest",
    description:
      "Enter a company and view a summary of its income statements from the past years.",
    services: "Financial Datasets AI + GPT-4o",
    apiCalls: [
      {
        path: "proxy/openrouter/v1/chat/completions",
        method: "POST",
        payload: {
          messages: [
            {
              content:
                "Return the ticker of the company if the company is publicly traded. If there is more than one ticker, select the parent company's ticker. Do not output any other words or punctuation.",
              role: "system",
            },
            {
              content: "{{user_input_0}}",
              role: "user",
            },
          ],
        },
        dataPath: "choices[0].message.content",
      },
      {
        path: "proxy/financial-datasets-ai/financials/income-statements?ticker={{api_0}}&period=annual&limit={{user_input_1}}",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. The assistant will provide you {{user_input_1}} years of a company's financial information. Briefly summarize each year on separate paragraphs in your response (each year should have its own brief paragraph, starting with '{year}:' in bold). Otheriwse, limit line breaks in your response. Include the company's ticker in your reponse: {{api_0}}. If you are not given any information, assume that the balance sheets were not available since the company requested is likely privately held. Limit line breaks in your response.",
        role: "system",
      },
      {
        content:
          "How is {{user_input_0}} doing right now financially, based on its income statments?",
        role: "user",
      },
      {
        content: "Financial information: {{api_1}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Find cocktail recipes with my at-home ingredients",
    proxyType: "openrouter",
    stream: true,
    inputModal: {
      title: "List your Cocktail Ingredients",
      userInputs: [
        {
          placeholder: "Default: vodka, white rum",
          instruction: "List your available cocktail ingredients:",
          defaultValue: "vodka, white rum",
        },
      ],
    },
    model: "openai/chatgpt-4o-latest",
    services: "API-Ninja + GPT-4o",
    description:
      "Enter a list of ingredients and view cocktail recipes containing all ingredients.",
    apiCalls: [
      {
        path: "proxy/openrouter/v1/chat/completions",
        method: "POST",
        payload: {
          model: "openai/chatgpt-4o-latest",
          messages: [
            {
              content:
                "You will be given several cocktail ingredients. Reformat the input so it is comma separated list, keeping a max of one space in between words if needed. If there are any duplicate ingredients, remove one duplicate. If there are missing commas, you should infer where to place new commas as long as you recognize the ingredient. If any item in the input is not a commonly known cocktail ingredient, remove the list item. Ensure you do not output any new ingredient that does not exist in the user input (double check this by ensuring that your output has a maximum number of words as the number of words in the input). Do not output anything else.",
              role: "system",
            },
            {
              content: "List: {{user_input_0}}",
              role: "user",
            },
          ],
        },
        dataPath: "choices[0].message.content",
      },
      {
        path: "proxy/api-ninja/v1/cocktail?ingredients={{api_0}}",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. You have the ability to get cocktail recipes that all use a list of ingredients. If the user asks you for cocktail recipes, first say: 'Here are some cocktail recipes you can try with (remove quotes and insert an 'and' before the last ingredient in the list) {{api_0}}!' Then return the list in a user friendly format (emojis if applicable). Limit the number line breaks in your response.",
        role: "system",
      },
      {
        content: "Get cocktail recipes that use a list of ingredients",
        role: "user",
      },
      {
        content: "Recipes: {{api_1}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Get a company's current stock price",
    proxyType: "openrouter",
    stream: true,
    inputModal: {
      title: "Input a Company",
      userInputs: [
        {
          placeholder: "Default: Apple",
          instruction: "Enter a company to check its current stock price:",
          defaultValue: "Apple",
        },
      ],
    },
    model: "openai/chatgpt-4o-latest",
    services: "API-Ninja + GPT-4o",
    description: "Enter a company to check its current stock price.",
    apiCalls: [
      {
        path: "proxy/openrouter/v1/chat/completions",
        method: "POST",
        payload: {
          model: "openai/chatgpt-4o-latest",
          messages: [
            {
              content:
                "Return the ticker of the company. Do not output any other words or punctuation. If there is more than one ticker, select one. Company: {{user_input_0}}",
              role: "user",
            },
          ],
        },
        dataPath: "choices[0].message.content",
      },
      {
        path: "proxy/api-ninja/v1/stockprice?ticker={{api_0}}",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. You have the ability to get a company's ticker and retrieve its current stock price. If the user asks you for a company's stock price, return the price in a user friendly format (emojis if applicable). Include all information from the API including: ticker, name, price, and exchange. Do not output anything regarding having trouble fetching data. Limit unnecessary line breaks.",
        role: "system",
      },
      {
        content: "Show {{user_input_0}} current stock price",
        role: "user",
      },
      {
        content: "Price: {{api_1}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Email me a cookie recipe",
    proxyType: "openrouter",
    stream: true,
    model: "perplexity/llama-3.1-sonar-huge-128k-online",
    services: "Perplexity + Email",
    inputModal: {
      title: "Enter your email address",
      userInputs: [
        {
          placeholder: "Email Address",
          instruction: "Enter your email address:",
          defaultValue: "",
        },
      ],
    },
    apiCalls: [
      {
        path: "proxy/openrouter/v1/chat/completions",
        method: "POST",
        payload: {
          model: "openai/chatgpt-4o-latest",
          messages: [
            {
              content:
                "Return an HTML formatted response. Find a recipe for chocalate chip cookies. Include all the ingredients and the steps to make the cookies. Include the time it takes to make the cookies. Include the temperature to bake the cookies. Include the number of cookies the recipe makes. Include the calories per cookie. Include the link to the recipe. Include the source of the recipe. Include the date the recipe was published. Include the author of the recipe.",
              role: "user",
            },
          ],
        },
        dataPath: "choices[0].message.content",
      },
      {
        path: "v1/receivers/toolkit/send-email",
        method: "POST",
        payload: {
          recipientEmail: "{{user_input_0}}",
          emailData: "{{api_0}}",
        },
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. You have the ability to get cookie recipes and send it to the user's email. If the user askes for the email you send, give the email content and the email address you sent to. Return to the user a user friendly response",
        role: "system",
      },
      {
        content: "Email sent to {{user_input_0}}.\nEmailed content: {{api_0}}",
        role: "assistant",
      },
      {
        content:
          "Show me the content in a user friendly format with links and images and what email address you sent to.",
        role: "user",
      },
    ],
  },
  {
    title: "Find a popular date spot near me",
    proxyType: "openrouter",
    stream: true,
    inputModal: {
      title: "Input a City",
      userInputs: [
        {
          placeholder: "Default: San Jose",
          instruction: "Enter a city of your choice:",
          defaultValue: "San Jose",
        },
      ],
    },

    model: "openai/chatgpt-4o-latest",

    services: "Vetric + GPT-4o",

    description: "Enter a city and view Instagram popular date locations.",

    apiCalls: [
      {
        path: "proxy/openrouter/v1/chat/completions",

        method: "POST",

        payload: {
          model: "openai/chatgpt-4o-latest",

          messages: [
            {
              content:
                "Given a city, infer the latitude and longitude. Do not use degree signs or NSEW. Output only: latitude, longitude. Ensure the coordinates are comma separated and accurate, with proper negative signs where if needed.",

              role: "system",
            },

            {
              content: "City: {{user_input_0}}",

              role: "user",
            },
          ],
        },

        dataPath: "choices[0].message.content",
      },

      {
        path: "v1/receivers/vetric/instagram/location-map?coordinates={{api_0}}",

        method: "GET",
      },
    ],

    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. You have the ability to get two popular date locations on Instagram in a specified city. If the user asks you for popular date locations, return the information given to you by the assistant in a user friendly format using emojis if applicable. First output 'Here are two Instagram popular date locations in {{user_input_0}}. Then output name (in bold), then category, number of Instagram posts, price range (use emojis), website ('Website: {website_url}' where the url is not embedded), and lastly location. Description titles should be bolded. Do not number the locations. Include horizontal lines between listings as a visual separator and limit unnecessary line breaks.",

        role: "system",
      },

      {
        content: "Find popular date locations in {{user_input_0}}",

        role: "user",
      },

      {
        content: "Date locations: {{api_1}}",

        role: "assistant",
      },
    ],
  },
  {
    title: "Find LinkedIn jobs",
    proxyType: "openrouter",
    stream: true,
    inputModal: {
      title: "Input a Company:",
      userInputs: [
        {
          placeholder: "Default: openAI",
          instruction: "Enter a company to search its LinkedIn jobs:",
          defaultValue: "Open AI",
        },
      ],
    },
    model: "openai/chatgpt-4o-latest",
    services: "Vetric + GPT-4o",
    description: "Enter a company and view its available jobs on LinkedIn.",
    apiCalls: [
      {
        path: "proxy/openrouter/v1/chat/completions",
        method: "POST",
        payload: {
          messages: [
            {
              content:
                "Given a company, return its LinkedIn public identifier. For example, 'Open AI' has the LinkedIn public identifier: openai. Do not output any other words or punctuation in your response.",
              role: "system",
            },
            {
              content: "Company: {{user_input_0}}",
              role: "user",
            },
          ],
        },
        dataPath: "choices[0].message.content",
      },
      {
        path: "v1/receivers/vetric/linkedin/job-search?query={{api_0}}",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. The assistant will get {{api_0}} jobs from LinkedIn via the API. When answering for {{api_0}}'s job listings, first output (do not wrap quotes around the company name {{api_0}}): 'Here are a few {{api_0}} jobs on LinkedIn!' Then include job title (in bold without prefix 'Title:' or any similar descriptor), then location (with prefix 'Location:'), listing date ('Posted Date:'), and finally url ('Link to Application' embedded bolded with chain link emoji). Ensure that title is the only field without a prefix, and that all other prefixes are bolded and begin with an appropriate emoji. Use a user friendly format. Include horizontal lines between listings as a visual separator and limit unnecessary line breaks.",
        role: "system",
      },
      {
        content: "Show me {{api_0}} jobs on LinkedIn.",
        role: "user",
      },
      {
        content: "Jobs: {{api_1}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Find a dinner recipe with my at-home ingredients",

    proxyType: "openrouter",
    stream: true,

    model: "openai/chatgpt-4o-latest",

    services: "GPT-4o",

    inputModal: {
      title: "List your Dinner Ingredients",
      userInputs: [
        {
          placeholder: "Default: beef, peas, carrots",
          instruction: "List your available dinner ingredients:",
          defaultValue: "beef, peas, carrots",
        },
      ],
    },

    description:
      "Enter a list of ingredients and view a dinner recipe containing all ingredients.",

    messages: [
      {
        content:
          "Based on the ingredients you are given, give a creative recipe that the user can make with only the listed ingredients, showing measurements. Assume seasoning is available. If you cannot give a recipe based on the ingredients provided, give a recipe with minimal additional ingredients needed. If no ingredients are given, state give instructions on how to make buttered toast. Use a user friendly format (emojis if applicable). After listing the name of the dish in bold, write a short (2 sentences max) blurb on where the dish is most commonly eaten or where it orginates from (do not output 'Blurb:' or any other similar title). Then give the 'Ingredients:' then 'Instructions:'. Limit line breaks in your response.",

        role: "system",
      },

      {
        content:
          "What can I make with the following ingredients: {{user_input_0}}",

        role: "user",
      },
      {
        content: "Financial information: {{api_1}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Discover a new hobby",
    proxyType: "openrouter",
    stream: true,
    model: "openai/chatgpt-4o-latest",
    services: "API-Ninja + GPT-4o",
    apiCalls: [
      {
        path: "proxy/api-ninja/v1/hobbies?category=general",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. You have the ability to get a general hobby and its corresponding Wikipedia link. When asked about finding a hobby, return the hobby, a short blurb on the hobby (3 sentences max), and the wikipedia link ('Click to Learn More on Wiki' bolded with chain link emoji) in a user friendly format (using emojis where applicable). Limit unnecessary line breaks.",
        role: "system",
      },
      {
        content: "Show me a new hobby",
        role: "user",
      },
      {
        content: "Hobby: {{api_0}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Shop Facebook Marketplace in SF",
    proxyType: "openrouter",
    stream: true,
    inputModal: {
      title: "Search an Item",
      userInputs: [
        {
          placeholder: "Default: bicycle",
          instruction: "Enter an item to search Facebook Marketplace for:",
          defaultValue: "bicycle",
        },
      ],
    },
    model: "openai/chatgpt-4o-latest",
    services: "Vetric + GPT-4o",
    description:
      "Enter an item and view listings on Facebook Marketplace near San Francisco area.",

    apiCalls: [
      {
        path: "v1/receivers/vetric/facebook/marketplace-search?query={{user_input_0}}",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. The assistant will get {{user_input_0}} listings from Facebook Marketplace via the API. When answering for the latest {{user_input_0}} listings, a user friendly format (emojis if applicable). Include: name/brief description (in bold), price (account for the offset: amount includes two extra digits for cents; if price is $0 then show 'FREE' instead of $0), location (ensure this has city name, without km distance or shipping info), 'Link to Listing' (bolded and embedded with a link to the posting: https://www.facebook.com/marketplace/item/{entity_id}/), and lastly the image. Include horizontal lines between listings as a visual separator and limit unnecessary line breaks.",
        role: "system",
      },
      {
        content: "Show me the latest {{user_input_0}} listings.",
        role: "user",
      },
      {
        content: "Listings: {{api_0}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Find upcoming live music events",
    proxyType: "openrouter",
    stream: true,
    model: "openai/chatgpt-4o-latest",
    services: "Vetric + GPT-4o",
    apiCalls: [
      {
        path: "v1/receivers/vetric/facebook/event-search?query=music",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. The assistant will get upcoming music events on Facebook via the API. If asked about upcoming music events, order them from soonest to latest dates, if possible. Use a user friendly format (emojis if applicable). Any embedded links should be bolded. Include horizontal lines between listings as a visual separator and limit unnecessary line breaks.",
        role: "system",
      },
      {
        content: "Find upcoming music events on Facebook.",
        role: "user",
      },
      {
        content: "Events: {{api_0}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Find an Instagram profile",
    proxyType: "openrouter",
    stream: true,
    inputModal: {
      title: "Search for Someone",
      userInputs: [
        {
          placeholder: "Default: Kevin Hart",
          instruction: "Enter a name to search on Instagram:",
          defaultValue: "Kevin Hart",
        },
      ],
    },
    model: "openai/chatgpt-4o-latest",
    description: "Enter a name and view relevant profiles on Instagram.",
    services: "Vetric + GPT-4o",
    apiCalls: [
      {
        path: "v1/receivers/vetric/instagram/people-search?query={{user_input_0}}",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. The assistant will get Instagram profiles given a name via the API. If asked about finding an Instagram profile, use a user friendly format (emojis if applicable). First show username (beginning with '@' and bolded, followed by green check sign emoji and '(Verified)' if verified, if not do not show anything), then 'Name:' (bolded) full_name (not bolded), 2-link emoji followed by bolded and embedded 'Link to Profile', and finally a brief note about the profile (1 sentence max). Any embedded links should be bolded. Include horizontal lines between listings as a visual separator and limit unnecessary line breaks.",
        role: "system",
      },
      {
        content: "Find Instagram profiles for the name {{user_input_0}}",
        role: "user",
      },
      {
        content: "Profiles: {{api_0}}",
        role: "assistant",
      },
    ],
  },
  {
    title: "Discover a famous quote",
    proxyType: "openrouter",
    stream: true,
    model: "openai/chatgpt-4o-latest",
    services: "API-Ninja + GPT-4o",
    apiCalls: [
      {
        path: "proxy/api-ninja/v1/quotes?category=",
        method: "GET",
      },
    ],
    messages: [
      {
        content:
          "You're a chat bot for the Skyfire Playground. You have the ability to get a famous quote and its author. When asked about finding a famous quote, first output the quote (do not output 'Quote:' or any other similar title), then write a short analysis of the quote (3 sentences max, do not output 'Analysis:' or any other similar title), and finally show the author (in bold) and in parentheses a short description of the author (not in bold). The output should all in a user friendly format. Limit unnecessary line breaks.",
        role: "system",
      },
      {
        content: "Show me a famous quote",
        role: "user",
      },
      {
        content: "Quote: {{api_0}}",
        role: "assistant",
      },
    ],
  },
];

export const availableModels: Model[] = [
  { model: "openai/chatgpt-4o-latest", proxyType: "openrouter" },
  { model: "openai/gpt-4-0314", proxyType: "openrouter" },
  { model: "openai/gpt-4", proxyType: "openrouter" },
  { model: "openai/gpt-3.5-turbo-0301", proxyType: "openrouter" },
  { model: "openai/gpt-3.5-turbo-0125", proxyType: "openrouter" },
  { model: "openai/gpt-3.5-turbo", proxyType: "openrouter" },
  {
    model: "perplexity/llama-3.1-sonar-huge-128k-online",
    proxyType: "openrouter",
  },
  { model: "sao10k/l3-lunaris-8b", proxyType: "openrouter" },
  { model: "aetherwiing/mn-starcannon-12b", proxyType: "openrouter" },
  { model: "openai/gpt-4o-2024-08-06", proxyType: "openrouter" },
  { model: "meta-llama/llama-3.1-405b", proxyType: "openrouter" },
  { model: "01-ai/yi-vision", proxyType: "openrouter" },
  { model: "01-ai/yi-large-fc", proxyType: "openrouter" },
  { model: "01-ai/yi-large-turbo", proxyType: "openrouter" },
  { model: "nothingiisreal/mn-celeste-12b", proxyType: "openrouter" },
  { model: "google/gemini-pro-1.5-exp", proxyType: "openrouter" },
  {
    model: "perplexity/llama-3.1-sonar-large-128k-online",
    proxyType: "openrouter",
  },
  {
    model: "perplexity/llama-3.1-sonar-large-128k-chat",
    proxyType: "openrouter",
  },
  {
    model: "perplexity/llama-3.1-sonar-small-128k-online",
    proxyType: "openrouter",
  },
  {
    model: "perplexity/llama-3.1-sonar-small-128k-chat",
    proxyType: "openrouter",
  },
  { model: "meta-llama/llama-3.1-70b-instruct", proxyType: "openrouter" },
  { model: "meta-llama/llama-3.1-8b-instruct:free", proxyType: "openrouter" },
  { model: "meta-llama/llama-3.1-8b-instruct", proxyType: "openrouter" },
  { model: "meta-llama/llama-3.1-405b-instruct", proxyType: "openrouter" },
  {
    model: "cognitivecomputations/dolphin-llama-3-70b",
    proxyType: "openrouter",
  },
  { model: "mistralai/codestral-mamba", proxyType: "openrouter" },
  { model: "mistralai/mistral-nemo", proxyType: "openrouter" },
  { model: "openai/gpt-4o-mini-2024-07-18", proxyType: "openrouter" },
  { model: "openai/gpt-4o-mini", proxyType: "openrouter" },
  { model: "qwen/qwen-2-7b-instruct:free", proxyType: "openrouter" },
  { model: "qwen/qwen-2-7b-instruct", proxyType: "openrouter" },
  { model: "google/gemma-2-27b-it", proxyType: "openrouter" },
  { model: "alpindale/magnum-72b", proxyType: "openrouter" },
  { model: "nousresearch/hermes-2-theta-llama-3-8b", proxyType: "openrouter" },
  { model: "google/gemma-2-9b-it:free", proxyType: "openrouter" },
  { model: "google/gemma-2-9b-it", proxyType: "openrouter" },
  { model: "openrouter/flavor-of-the-week", proxyType: "openrouter" },
  { model: "sao10k/l3-stheno-8b", proxyType: "openrouter" },
  { model: "ai21/jamba-instruct", proxyType: "openrouter" },
  { model: "01-ai/yi-large", proxyType: "openrouter" },
  { model: "anthropic/claude-3.5-sonnet", proxyType: "openrouter" },
  { model: "anthropic/claude-3.5-sonnet:beta", proxyType: "openrouter" },
  { model: "sao10k/l3-euryale-70b", proxyType: "openrouter" },
  { model: "microsoft/phi-3-medium-4k-instruct", proxyType: "openrouter" },
  {
    model: "cognitivecomputations/dolphin-mixtral-8x22b",
    proxyType: "openrouter",
  },
  { model: "qwen/qwen-2-72b-instruct", proxyType: "openrouter" },
  { model: "openchat/openchat-8b", proxyType: "openrouter" },
  { model: "nousresearch/hermes-2-pro-llama-3-8b", proxyType: "openrouter" },
  { model: "mistralai/mistral-7b-instruct-v0.3", proxyType: "openrouter" },
  { model: "mistralai/mistral-7b-instruct:free", proxyType: "openrouter" },
  { model: "mistralai/mistral-7b-instruct", proxyType: "openrouter" },
  { model: "mistralai/mistral-7b-instruct:nitro", proxyType: "openrouter" },
  { model: "microsoft/phi-3-mini-128k-instruct:free", proxyType: "openrouter" },
  { model: "microsoft/phi-3-mini-128k-instruct", proxyType: "openrouter" },
  {
    model: "microsoft/phi-3-medium-128k-instruct:free",
    proxyType: "openrouter",
  },
  { model: "microsoft/phi-3-medium-128k-instruct", proxyType: "openrouter" },
  { model: "neversleep/llama-3-lumimaid-70b", proxyType: "openrouter" },
  { model: "google/gemini-flash-1.5", proxyType: "openrouter" },
  { model: "deepseek/deepseek-coder", proxyType: "openrouter" },
  { model: "deepseek/deepseek-chat", proxyType: "openrouter" },
  {
    model: "perplexity/llama-3-sonar-large-32k-online",
    proxyType: "openrouter",
  },
  { model: "perplexity/llama-3-sonar-large-32k-chat", proxyType: "openrouter" },
  {
    model: "perplexity/llama-3-sonar-small-32k-online",
    proxyType: "openrouter",
  },
  { model: "perplexity/llama-3-sonar-small-32k-chat", proxyType: "openrouter" },
  { model: "meta-llama/llama-guard-2-8b", proxyType: "openrouter" },
  { model: "meta-llama/llama-3-70b", proxyType: "openrouter" },
  { model: "meta-llama/llama-3-8b", proxyType: "openrouter" },
  { model: "openai/gpt-4o-2024-05-13", proxyType: "openrouter" },
  { model: "openai/gpt-4o", proxyType: "openrouter" },
  { model: "openai/gpt-4o:extended", proxyType: "openrouter" },
  { model: "allenai/olmo-7b-instruct", proxyType: "openrouter" },
  { model: "qwen/qwen-4b-chat", proxyType: "openrouter" },
  { model: "qwen/qwen-7b-chat", proxyType: "openrouter" },
  { model: "qwen/qwen-14b-chat", proxyType: "openrouter" },
  { model: "qwen/qwen-32b-chat", proxyType: "openrouter" },
  { model: "qwen/qwen-72b-chat", proxyType: "openrouter" },
  { model: "qwen/qwen-110b-chat", proxyType: "openrouter" },
  { model: "neversleep/llama-3-lumimaid-8b", proxyType: "openrouter" },
  { model: "neversleep/llama-3-lumimaid-8b:extended", proxyType: "openrouter" },
  { model: "snowflake/snowflake-arctic-instruct", proxyType: "openrouter" },
  { model: "lynn/soliloquy-l3", proxyType: "openrouter" },
  { model: "sao10k/fimbulvetr-11b-v2", proxyType: "openrouter" },
  { model: "meta-llama/llama-3-70b-instruct", proxyType: "openrouter" },
  { model: "meta-llama/llama-3-70b-instruct:nitro", proxyType: "openrouter" },
  { model: "meta-llama/llama-3-8b-instruct:free", proxyType: "openrouter" },
  { model: "meta-llama/llama-3-8b-instruct", proxyType: "openrouter" },
  { model: "meta-llama/llama-3-8b-instruct:nitro", proxyType: "openrouter" },
  { model: "meta-llama/llama-3-8b-instruct:extended", proxyType: "openrouter" },
  { model: "mistralai/mixtral-8x22b-instruct", proxyType: "openrouter" },
  { model: "microsoft/wizardlm-2-7b", proxyType: "openrouter" },
  { model: "microsoft/wizardlm-2-8x22b", proxyType: "openrouter" },
  { model: "mistralai/mixtral-8x22b", proxyType: "openrouter" },
  { model: "google/gemini-pro-1.5", proxyType: "openrouter" },
  { model: "openai/gpt-4-turbo", proxyType: "openrouter" },
  { model: "cohere/command-r-plus", proxyType: "openrouter" },
  { model: "databricks/dbrx-instruct", proxyType: "openrouter" },
  { model: "sophosympatheia/midnight-rose-70b", proxyType: "openrouter" },
  { model: "cohere/command-r", proxyType: "openrouter" },
  { model: "cohere/command", proxyType: "openrouter" },
  { model: "anthropic/claude-3-haiku", proxyType: "openrouter" },
  { model: "anthropic/claude-3-haiku:beta", proxyType: "openrouter" },
  { model: "anthropic/claude-3-sonnet", proxyType: "openrouter" },
  { model: "anthropic/claude-3-sonnet:beta", proxyType: "openrouter" },
  { model: "anthropic/claude-3-opus", proxyType: "openrouter" },
  { model: "anthropic/claude-3-opus:beta", proxyType: "openrouter" },
  { model: "mistralai/mistral-large", proxyType: "openrouter" },
  { model: "google/gemma-7b-it:free", proxyType: "openrouter" },
  { model: "google/gemma-7b-it", proxyType: "openrouter" },
  { model: "google/gemma-7b-it:nitro", proxyType: "openrouter" },
  {
    model: "nousresearch/nous-hermes-2-mistral-7b-dpo",
    proxyType: "openrouter",
  },
  { model: "meta-llama/codellama-70b-instruct", proxyType: "openrouter" },
  { model: "recursal/eagle-7b", proxyType: "openrouter" },
  { model: "openai/gpt-4-turbo-preview", proxyType: "openrouter" },
  { model: "openai/gpt-3.5-turbo-0613", proxyType: "openrouter" },
  {
    model: "nousresearch/nous-hermes-2-mixtral-8x7b-sft",
    proxyType: "openrouter",
  },
  {
    model: "nousresearch/nous-hermes-2-mixtral-8x7b-dpo",
    proxyType: "openrouter",
  },
  { model: "mistralai/mistral-medium", proxyType: "openrouter" },
  { model: "mistralai/mistral-small", proxyType: "openrouter" },
  { model: "mistralai/mistral-tiny", proxyType: "openrouter" },
  { model: "austism/chronos-hermes-13b", proxyType: "openrouter" },
  { model: "nousresearch/nous-hermes-yi-34b", proxyType: "openrouter" },
  { model: "mistralai/mistral-7b-instruct-v0.2", proxyType: "openrouter" },
  {
    model: "cognitivecomputations/dolphin-mixtral-8x7b",
    proxyType: "openrouter",
  },
  { model: "google/gemini-pro-vision", proxyType: "openrouter" },
  { model: "google/gemini-pro", proxyType: "openrouter" },
  { model: "recursal/rwkv-5-3b-ai-town", proxyType: "openrouter" },
  { model: "rwkv/rwkv-5-world-3b", proxyType: "openrouter" },
  { model: "mistralai/mixtral-8x7b-instruct", proxyType: "openrouter" },
  { model: "mistralai/mixtral-8x7b-instruct:nitro", proxyType: "openrouter" },
  { model: "mistralai/mixtral-8x7b", proxyType: "openrouter" },
  {
    model: "togethercomputer/stripedhyena-hessian-7b",
    proxyType: "openrouter",
  },
  { model: "togethercomputer/stripedhyena-nous-7b", proxyType: "openrouter" },
  { model: "gryphe/mythomist-7b:free", proxyType: "openrouter" },
  { model: "gryphe/mythomist-7b", proxyType: "openrouter" },
  { model: "01-ai/yi-6b", proxyType: "openrouter" },
  { model: "01-ai/yi-34b", proxyType: "openrouter" },
  { model: "01-ai/yi-34b-chat", proxyType: "openrouter" },
  { model: "nousresearch/nous-capybara-7b:free", proxyType: "openrouter" },
  { model: "nousresearch/nous-capybara-7b", proxyType: "openrouter" },
  { model: "openchat/openchat-7b:free", proxyType: "openrouter" },
  { model: "openchat/openchat-7b", proxyType: "openrouter" },
  { model: "neversleep/noromaid-20b", proxyType: "openrouter" },
  { model: "anthropic/claude-instant-1.1", proxyType: "openrouter" },
  { model: "anthropic/claude-2.1", proxyType: "openrouter" },
  { model: "anthropic/claude-2.1:beta", proxyType: "openrouter" },
  { model: "anthropic/claude-2", proxyType: "openrouter" },
  { model: "anthropic/claude-2:beta", proxyType: "openrouter" },
  { model: "teknium/openhermes-2.5-mistral-7b", proxyType: "openrouter" },
  { model: "openai/gpt-4-vision-preview", proxyType: "openrouter" },
  { model: "lizpreciatior/lzlv-70b-fp16-hf", proxyType: "openrouter" },
  { model: "alpindale/goliath-120b", proxyType: "openrouter" },
  { model: "undi95/toppy-m-7b:free", proxyType: "openrouter" },
  { model: "undi95/toppy-m-7b", proxyType: "openrouter" },
  { model: "undi95/toppy-m-7b:nitro", proxyType: "openrouter" },
  { model: "openrouter/auto", proxyType: "openrouter" },
  { model: "openai/gpt-4-1106-preview", proxyType: "openrouter" },
  { model: "openai/gpt-3.5-turbo-1106", proxyType: "openrouter" },
  { model: "google/palm-2-codechat-bison-32k", proxyType: "openrouter" },
  { model: "google/palm-2-chat-bison-32k", proxyType: "openrouter" },
  { model: "teknium/openhermes-2-mistral-7b", proxyType: "openrouter" },
  { model: "open-orca/mistral-7b-openorca", proxyType: "openrouter" },
  { model: "jondurbin/airoboros-l2-70b", proxyType: "openrouter" },
  { model: "xwin-lm/xwin-lm-70b", proxyType: "openrouter" },
  { model: "mistralai/mistral-7b-instruct-v0.1", proxyType: "openrouter" },
  { model: "openai/gpt-3.5-turbo-instruct", proxyType: "openrouter" },
  { model: "pygmalionai/mythalion-13b", proxyType: "openrouter" },
  { model: "openai/gpt-4-32k-0314", proxyType: "openrouter" },
  { model: "openai/gpt-4-32k", proxyType: "openrouter" },
  { model: "openai/gpt-3.5-turbo-16k", proxyType: "openrouter" },
  { model: "nousresearch/nous-hermes-llama2-13b", proxyType: "openrouter" },
  { model: "phind/phind-codellama-34b", proxyType: "openrouter" },
  { model: "meta-llama/codellama-34b-instruct", proxyType: "openrouter" },
  { model: "huggingfaceh4/zephyr-7b-beta:free", proxyType: "openrouter" },
  { model: "mancer/weaver", proxyType: "openrouter" },
  { model: "anthropic/claude-instant-1.0", proxyType: "openrouter" },
  { model: "anthropic/claude-1.2", proxyType: "openrouter" },
  { model: "anthropic/claude-1", proxyType: "openrouter" },
  { model: "anthropic/claude-instant-1", proxyType: "openrouter" },
  { model: "anthropic/claude-instant-1:beta", proxyType: "openrouter" },
  { model: "anthropic/claude-2.0", proxyType: "openrouter" },
  { model: "anthropic/claude-2.0:beta", proxyType: "openrouter" },
  { model: "undi95/remm-slerp-l2-13b", proxyType: "openrouter" },
  { model: "undi95/remm-slerp-l2-13b:extended", proxyType: "openrouter" },
  { model: "google/palm-2-codechat-bison", proxyType: "openrouter" },
  { model: "google/palm-2-chat-bison", proxyType: "openrouter" },
  { model: "gryphe/mythomax-l2-13b", proxyType: "openrouter" },
  { model: "gryphe/mythomax-l2-13b:nitro", proxyType: "openrouter" },
  { model: "gryphe/mythomax-l2-13b:extended", proxyType: "openrouter" },
  { model: "meta-llama/llama-2-70b-chat", proxyType: "openrouter" },
  { model: "meta-llama/llama-2-13b-chat", proxyType: "openrouter" },
];
