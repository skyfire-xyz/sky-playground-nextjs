# Skyfire Playground

This Next.js application serves as a playground to demonstrate how to utilize the Skyfire SDK in a real-world web application context.

The primary goal of this project is to help developers understand and implement the Skyfire SDK within a Next.js environment. It showcases practical examples of SDK integration.

## Getting Started

1. **Installation**

   - Clone the repository:
     ```bash
     git clone git@github.com:skyfire-xyz/sky-nextjs-demo.git
     cd sky-nextjs-demo
     ```
   - Install dependencies:
     ```bash
     yarn install
     ```

2. **Skyfire API Key Setup**

   - Sign up at [Skyfire Dashboard](https://app.skyfire.xyz) to create an account.
   - After signing up, create an API key from your dashboard.
   - Set the API key as an environment variable in `.env` file:

   ```bash
   SKYFIRE_API_KEY=your_api_key_here
   ```

3. **Running the App**

   - Start the development server:
     ```bash
     yarn dev
     ```

### Tech Stack

- **Next.js**: React framework for building the application
- **Skyfire SDK**: Core SDK for AI model integration and services
- **Redux**: State management library
- **Tailwind CSS**: Utility-first CSS framework
- **Flowbite React**: UI component library based on Tailwind CSS
