"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function LanguageSwitcher() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("google-translate-script")) {
      setReady(true);
      return;
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
        setReady(true);
      }
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex items-center">
      <div
        id="google_translate_element"
        className="gt-wrap"
        aria-label="Translate this page"
      />
      {!ready && (
        <span className="text-xs text-muted-foreground">Loading…</span>
      )}
    </div>
  );
}