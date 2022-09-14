import { useState, useEffect, useCallback } from "react";

// https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
export default function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  const getWindowDimensions = useCallback(() => {
    const winWidth = hasWindow ? window.innerWidth : null;
    const winHeight = hasWindow ? window.innerHeight : null;
    return {
      winWidth,
      winHeight,
    };
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    if (hasWindow) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow, getWindowDimensions]);

  return windowDimensions;
}
