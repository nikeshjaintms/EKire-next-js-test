// components/TawkChat.js
"use client"; // if you're using app router

import { useRef } from "react";
import dynamic from "next/dynamic";

// Import Tawk only on client
const TawkMessengerReact = dynamic(
  () => import("@tawk.to/tawk-messenger-react"),
  { ssr: false }
);

export default function TawkChat() {
  const tawkRef = useRef();

  return (
    <TawkMessengerReact
      propertyId={process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}
      widgetId={process.env.NEXT_PUBLIC_TAWK_WIDGET_ID}
      ref={tawkRef}
      onLoad={() => console.log("Tawk loaded")}
    />
  );
}
