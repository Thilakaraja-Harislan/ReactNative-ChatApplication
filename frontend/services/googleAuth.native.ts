import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  GOOGLE_WEB_CLIENT_ID,
};