import { useEffect, useState } from "react";
import { Toaster as SileoToaster } from "sileo";
import "sileo/styles.css";

// Sileo toaster mount. Position is viewport-aware: desktop pins to the
// top-right corner, mobile (<640px) switches to top-center so the toast
// sits centered above the thumb zone instead of hugging an edge. Width is
// clamped to the viewport on small screens via the @media override in
// index.css (--sileo-width).
//
// Sileo's default toast lifetime is 6000ms, which felt sluggish — dropped
// to 3000ms (snappier than the old sonner setup's 4000ms).
export function Toaster(props) {
  const [position, setPosition] = useState("top-right");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setPosition(mq.matches ? "top-center" : "top-right");
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
