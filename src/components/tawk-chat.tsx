"use client";

import { useEffect } from "react";

const TAWK_SRC = "https://embed.tawk.to/6a2490d3f81b7b1c2d8ac629/1jqfdbetc";

export function TawkChat() {
  useEffect(() => {
    // Guard against double-injection on hot reloads or re-mounts
    if (document.querySelector(`script[src="${TAWK_SRC}"]`)) return;

    const s1 = document.createElement("script");
    s1.src = TAWK_SRC;
    s1.async = true;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    s0?.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
}
