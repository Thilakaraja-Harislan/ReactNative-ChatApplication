import { GoogleSignin } from "@react-native-google-signin/google-signin";

const webClientId =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

if (!webClientId) {
  console.warn(
    "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not configured"
  );
}

GoogleSignin.configure({
  webClientId,
  offlineAccess: false,
});

export { GoogleSignin };