interface ModelIconsProps {
  model: string;
}

export default function ModelIcons({ model }: ModelIconsProps) {
  switch (model) {
    case "skyfire":
      return (
        <img src="/images/skyfire-icon.svg" className="h-4 w-4 rounded-full" />
      );
    case "openai":
      return <img src="/images/providers/OpenAI.svg" className="h-4 w-4" />;
    case "openrouter":
      return <img src="/images/providers/OpenRouter.svg" className="h-4 w-4" />;
  }
  return null;
}
