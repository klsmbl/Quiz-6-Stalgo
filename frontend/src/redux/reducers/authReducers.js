import { AUTH_SIGN_IN, AUTH_SIGN_OUT } from "../constants/authConstants";
import { getCurrentUser } from "../../utils/storage";

const initialState = {
  currentUser: getCurrentUser(),
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_SIGN_IN:
      return {
        ...state,
        currentUser: action.payload,
      };
    case AUTH_SIGN_OUT:
      return {
        ...state,
        currentUser: null,
      };
    default:
      return state;
  }
}
