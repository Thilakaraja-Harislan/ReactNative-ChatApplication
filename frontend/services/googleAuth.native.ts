import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

if (!GOOGLE_WEB_CLIENT_ID) {
  console.warn(
    "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not configured"
  );
}

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

export {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  GOOGLE_WEB_CLIENT_ID,
};