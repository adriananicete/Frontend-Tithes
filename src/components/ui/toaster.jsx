import { useEffect, useState } from "react";
import { Toaster as SileoToaster } from "sileo";
import "sileo/styles.css";

// Sileo toaster mount. Position is viewport-aware: desktop shows the toast
// top-center, mobile (<640px) switches to top-right. Width is clamped to
// the viewport on small screens via the @media override in index.css
// (--sileo-width).
//
// Sileo's default toast lifetime is 6000ms, which felt sluggish — dropped
// to 3000ms (snappier than the old sonner setup's 4000ms).
export function Toaster(props) {
  const [position, setPosition] = useState("top-center");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setPosition(mq.matches ? "top-right" : "top-center");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <SileoToaster
      position={position}
      theme="light"
      options={{ duration: 3000 }}
      {...props}
    />
  );
}
