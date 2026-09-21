const ADMIN_SESSION = "honesty-admin-v1";

/** SHA-256 of `mkweli:` + password. Password is not stored in the repo. */
const ADMIN_HASH =
  "22c156c9fbf40329168640b533954105c1b20c1504ef577f7092728d9fbd4db2";

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function checkAdminLogin(user: string, password: string): Promise<boolean> {
  const hex = await sha256Hex(`${user.trim()}:${password}`);
  return hex === ADMIN_HASH;
}

export function adminIsIn(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION) === "1";
  } catch {
    return false;
  }
}

export function setAdminIn(on: boolean) {
  try {
    if (on) sessionStorage.setItem(ADMIN_SESSION, "1");
    else sessionStorage.removeItem(ADMIN_SESSION);
  } catch {
    /* ignore */
  }
}

export function clearStoryKeys() {
  try {
    sessionStorage.removeItem("honesty-street-v2");
    const drop: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("honesty-story-")) drop.push(key);
    }
    for (const key of drop) sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
