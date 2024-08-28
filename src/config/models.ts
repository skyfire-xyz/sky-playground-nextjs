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
    services: "GPT-4o",
    model: "gpt-4o",
    prompt: "tell me a bedtime story",
  },
  {
    title: "Teach me how to best cook a steak",
    proxyType: "openrouter",
    services: "Gemini-Pro-1.5",
    model: "google/gemini-pro-1.5",
    prompt: "what's the best way to cook a steak",
  },
  {
    title: "Find a dinner recipe with my at-home ingredients",

    proxyType: "openrouter",

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
