"use client";

import { useEffect, useState, useRef } from "react";
import Loader from "./Loader";

export default function GlobalLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const minLoadingTime = 2500;
    const startTime = Date.now();

    const handleLoad = async () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(async () => {
        if (loaderRef.current) {
          await loaderRef.current.animateOut();
        }
        setLoading(false);
      }, remainingTime);
    };

    // Check if document is already loaded
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <>
      {loading && <Loader ref={loaderRef} />}
      <div style={{ visibility: loading ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  );
}
