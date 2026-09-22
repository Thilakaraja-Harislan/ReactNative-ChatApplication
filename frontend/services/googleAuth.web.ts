declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Google Sign-In")),
      );
      return;
    }

    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();

    script.onerror = () => reject(new Error("Failed to load Google Sign-In"));

    document.head.appendChild(script);
  });
}

export async function renderGoogleButton(
  element: HTMLElement,
  onCredential: (idToken: string) => void,
): Promise<void> {
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not configured");
  }

  await loadGoogleScript();

  if (!window.google?.accounts?.id) {
    throw new Error("Google Identity Services is unavailable");
  }

window.google.accounts.id.initialize({
  client_id: GOOGLE_WEB_CLIENT_ID,

  callback: (response: { credential?: string }) => {
    if (!response.credential) {
      console.error("Google did not return an ID token");
      return;
    }

    onCredential(response.credential);
  },

  use_fedcm_for_button: true,
});

  element.innerHTML = "";

window.google.accounts.id.renderButton(element, {
  type: "standard",
  theme: "outline",
  size: "large",
  text: "continue_with",
  shape: "pill",
  width: 280,
});
}
