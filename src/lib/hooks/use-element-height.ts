import { useState, useEffect, useCallback } from "react";

const useElementHeightExcludingContents = (
  elementRef: React.RefObject<HTMLElement>,
): { height: number | null; emptyHeight: number | null } => {
  const [height, setHeight] = useState<number | null>(null);
  const [emptyHeight, setEmptyHeight] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const calculateHeightWithoutContents = useCallback(() => {
    if (elementRef.current) {
      const element = elementRef.current;

      // Temporarily hide the contents
      const children = Array.from(element.children);
      children.forEach(
        (child) => ((child as HTMLElement).style.display = "none"),
      );

      // Measure the height of the empty container
      const emptyHeight = element.offsetHeight;

      // Restore the original contents
      children.forEach((child) => ((child as HTMLElement).style.display = ""));

      return emptyHeight;
    }
    return null;
  }, [elementRef]);

  useEffect(() => {
    const updateHeights = () => {
      if (elementRef.current) {
        setHeight(elementRef.current.offsetHeight);
        setIsCalculating(true);
        const newEmptyHeight = calculateHeightWithoutContents();
        setEmptyHeight(newEmptyHeight);
        setIsCalculating(false);
      }
    };

    // Initial height calculation
    updateHeights();

    // Debounce the resize event handler
    const handleResize = () => {
      setTimeout(updateHeights, 100);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [elementRef, calculateHeightWithoutContents]);

  return { height, emptyHeight };
};

export default useElementHeightExcludingContents;
