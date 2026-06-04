/* Service worker for Web Push notifications (JOSCM Tithes). */

const ICON =
  "https://res.cloudinary.com/dks2psaem/image/upload/w_192,h_192,c_pad,b_white/v1763347986/joscm-logo_jq0zlo.png";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Incoming push → show a notification. Payload: { title, body, url }.
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "JOSCM Tithes";
  const options = {
    body: data.body || "",
    icon: ICON,
    badge: ICON,
    data: { url: data.url || "/dashboard" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Tap → focus an existing app window (and navigate it) or open a new one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((wins) => {
        for (const w of wins) {
          if ("focus" in w) {
            w.focus();
            if ("navigate" in w) w.navigate(url).catch(() => {});
            return;
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});
