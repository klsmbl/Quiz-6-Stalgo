import { AUTH_SIGN_IN, AUTH_SIGN_OUT } from "../constants/authConstants";
import { clearCurrentUser, setCurrentUser } from "../../utils/storage";

export function signIn(user) {
  setCurrentUser(user);
  return {
    type: AUTH_SIGN_IN,
    payload: user,
  };
}

export function signOut() {
  clearCurrentUser();
  return {
    type: AUTH_SIGN_OUT,
  };
}
