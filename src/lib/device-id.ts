const KEY = "ai_device_id";
const LABEL_KEY = "ai_device_label";

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "d-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function detectLabel(): string {
  if (typeof navigator === "undefined") return "Dispositivo";
  const ua = navigator.userAgent;
  const platform =
    /iPhone/i.test(ua) ? "iPhone" :
    /iPad/i.test(ua) ? "iPad" :
    /Android/i.test(ua) ? "Android" :
    /Macintosh|Mac OS/i.test(ua) ? "Mac" :
    /Windows/i.test(ua) ? "Windows" :
    /Linux/i.test(ua) ? "Linux" : "Dispositivo";
  const browser =
    /Edg\//i.test(ua) ? "Edge" :
    /Chrome\//i.test(ua) ? "Chrome" :
    /Firefox\//i.test(ua) ? "Firefox" :
    /Safari\//i.test(ua) ? "Safari" : "Navegador";
  return `${platform} · ${browser}`;
}

export function getDeviceId(): string {
  if (typeof localStorage === "undefined") return "ssr";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function getDeviceLabel(): string {
  if (typeof localStorage === "undefined") return "Dispositivo";
  let label = localStorage.getItem(LABEL_KEY);
  if (!label) {
    label = detectLabel();
    localStorage.setItem(LABEL_KEY, label);
  }
  return label;
}

export function getUserAgent(): string {
  return typeof navigator !== "undefined" ? navigator.userAgent : "";
}
