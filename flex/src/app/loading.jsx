"use client";

import { useEffect, useRef } from "react";
import Loader from "@/components/Loader";

export default function Loading() {
  const loaderRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loaderRef.current) {
        loaderRef.current.animateOut();
      }
    }, 6000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return <Loader ref={loaderRef} />;
}
