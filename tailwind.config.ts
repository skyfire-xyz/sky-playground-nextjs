import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";
import speechRecognition from "./src/components/ui/speech-recognition/tw-configs";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  plugins: [flowbite.plugin()],
  theme: {
    fontFamily: {
      instrument: ["var(--font-instrument)"],
    },
    extend: {
      ...speechRecognition,
    },
  },
};
export default config;
