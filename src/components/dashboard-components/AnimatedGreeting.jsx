import { useEffect, useMemo, useState } from "react";

// Greeting prefixes shown before the user's name. The set depends on the time
// of day and whether it's Sunday; the component cycles through them every 10s.
function buildPrefixes(now) {
  const hour = now.getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const isSunday = now.getDay() === 0;
  return [
    ...(isSunday ? ["Happy Sunday"] : []),
    "Welcome",
    timeGreeting,
  ];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TYPING_MS = 45; // per character
const WAVE_MS = 1500; // matches the .joscm-wave keyframe (+buffer)
const CYCLE_MS = 10000; // switch to the next greeting every 10s

/**
 * One greeting line: types out `text` character by character, then waves the
 * hand once. Remounted (via a `key`) each cycle, so state resets naturally with
 * no in-effect setState. Under reduced motion it renders the full line at once.
 */
function GreetingLine({ text, reduced, className }) {
  const [typed, setTyped] = useState(reduced ? text : "");
  const [waving, setWaving] = useState(false);

  // Typing effect — all setState happens inside the interval callback.
  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setWaving(true);
      }
    }, TYPING_MS);
    return () => clearInterval(timer);
  }, [text, reduced]);

  // Rest the hand after the wave has played once.
  useEffect(() => {
    if (!waving) return;
    const t = setTimeout(() => setWaving(false), WAVE_MS);
    return () => clearTimeout(t);
  }, [waving]);

  const done = typed === text;
  const showCaret = !reduced && !done;

  return (
    <p className={className} aria-label={text}>
      <span aria-hidden="true">{typed}</span>
      {showCaret && <span className="joscm-caret" aria-hidden="true">|</span>}
      {done && (
        <>
          {" "}
          <span
            className={waving ? "joscm-wave" : "inline-block"}
            aria-hidden="true"
          >
            👋
          </span>
        </>
      )}
    </p>
  );
}

/**
 * Dashboard hero greeting. Cycles through time/Sunday-aware greetings every 10s;
 * each is typed out and followed by a hand wave. A changing `key` remounts the
 * inner line so its typing restarts cleanly.
 */
export function AnimatedGreeting({ name = "there", className = "" }) {
  const prefixes = useMemo(() => buildPrefixes(new Date()), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || prefixes.length < 2) return;
    const cycle = setInterval(
      () => setIndex((i) => (i + 1) % prefixes.length),
      CYCLE_MS
    );
    return () => clearInterval(cycle);
  }, [reduced, prefixes.length]);

  const text = `${prefixes[index % prefixes.length]}, ${name}`;

  return (
    <GreetingLine key={index} text={text} reduced={reduced} className={className} />
  );
}
