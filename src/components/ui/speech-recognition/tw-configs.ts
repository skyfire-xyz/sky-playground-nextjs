const config = {
  keyframes: {
    "wave-sm": {
      "0%": { opacity: "0.35", height: "5px" },
      "100%": { opacity: "1", height: "12px" },
    },
    "wave-md": {
      "0%": { opacity: "0.35", height: "10px" },
      "100%": { opacity: "1", height: "20px" },
    },
    "wave-lg": {
      "0%": { opacity: "0.35", height: "10px" },
      "100%": { opacity: "1", height: "30px" },
    },
  },
  animation: {
    "wave-sm": "wave-sm ease-in-out infinite alternate",
    "wave-md": "wave-md ease-in-out infinite alternate",
    "wave-lg": "wave-lg ease-in-out infinite alternate",
  },
};

export default config;
