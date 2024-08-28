import { useEffect, useState } from "react";

export default function usePlaygroundContentHeight(offset?: number) {
  const [mainContentHeight, setMainContentHeight] = useState(0);

  useEffect(() => {
    const adjustMainContentHeight = () => {
      const padding = 24;
      const headerElement = document.getElementById("main-nav");
      const menuElement = document.getElementById("playground-menu");
      const chatMenuElement = document.getElementById("chat-menu");
      const chatInputElement = document.getElementById("chat-input");
      const balanceBarElement = document.getElementById("balance-bar");

      const headerHeight = headerElement ? headerElement.offsetHeight : 0;
      const menuHeight = menuElement ? menuElement.offsetHeight : 0;
      const chatMenuHeight = chatMenuElement
        ? chatMenuElement.offsetHeight + padding * 2
        : 0;
      const chatInputHeight = chatInputElement
        ? chatInputElement.offsetHeight
        : 0;
      const balanceBarHeight = balanceBarElement
        ? balanceBarElement.offsetHeight
        : 0;

      const availableHeight =
        window.innerHeight -
        headerHeight -
        menuHeight -
        chatMenuHeight -
        chatInputHeight -
        balanceBarHeight;

      const calculatedHeight = availableHeight - padding * 3 - (offset || 0);
      setMainContentHeight(calculatedHeight); // Manually adjust padding
    };

    // Adjust height on initial render
    adjustMainContentHeight();

    // Adjust height on window resize
    window.addEventListener("resize", adjustMainContentHeight);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", adjustMainContentHeight);
    };
  }, []);

  return mainContentHeight;
}
