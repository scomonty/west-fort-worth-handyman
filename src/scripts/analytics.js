export function trackEvent(name, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}