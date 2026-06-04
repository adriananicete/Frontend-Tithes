import { useEffect, useState } from "react";
import { LuBell, LuBellOff, LuBellRing } from "react-icons/lu";
import {
  disablePush,
  enablePush,
  getPushStatus,
  pushSupported,
} from "@/lib/push";

// A row for the Header settings popover that lets the user turn phone push
// notifications on/off. Hidden entirely when the browser can't do push.
export function PushToggle() {
  const [status, setStatus] = useState("default");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getPushStatus().then((s) => active && setStatus(s));
    return () => {
      active = false;
    };
  }, []);

  if (!pushSupported() || status === "unsupported") return null;

  const toggle = async () => {
    setBusy(true);
    try {
      if (status === "subscribed") setStatus(await disablePush());
      else setStatus(await enablePush());
    } catch {
      // Permission denied or subscribe failed — reflect the latest state.
      setStatus(await getPushStatus());
    } finally {
      setBusy(false);
    }
  };

  const denied = status === "denied";
  const on = status === "subscribed";
  const Icon = denied ? LuBellOff : on ? LuBellRing : LuBell;

  const label = busy
    ? "Please wait…"
    : denied
    ? "Notifications blocked"
    : on
    ? "Notifications on · turn off"
    : "Enable notifications";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || denied}
      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-accent text-gray-700 dark:text-foreground disabled:opacity-60"
      title={denied ? "Allow notifications in your browser settings to enable." : undefined}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
