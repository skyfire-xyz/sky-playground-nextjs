"use client";

import { breakpoints } from "@/src/config/breakpoints";
import { useEffect, useState } from "react";

function useDimentions() {
  const [dimentions, setDimentions] = useState({
    screenWidth: 0,
    screenHeight: 0,
  });
  useEffect(() => {
    const handleResize = () => {
      setDimentions({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimentions;
}

function useIsMobile() {
  const { screenWidth } = useDimentions();

  const isMobile = screenWidth && screenWidth < breakpoints.lg;
  return !!isMobile;
}

export default useIsMobile;
