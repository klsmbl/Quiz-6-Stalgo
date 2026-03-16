import { USER_ADD, USER_DELETE, USER_SET_ALL, USER_UPDATE } from "../constants/userConstants";
import { ensureAdminUser } from "../../utils/storage";

const initialState = {
  users: ensureAdminUser(),
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_SET_ALL:
      return {
        ...state,
        users: action.payload,
      };
    case USER_ADD:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case USER_UPDATE:
      return {
        ...state,
        users: state.users.map((user) => (user.email === action.payload.originalEmail ? {
          ...user,
          ...action.payload.data,
        } : user)),
      };
    case USER_DELETE:
      return {
        ...state,
        users: state.users.filter((user) => user.email !== action.payload),
      };
    default:
      return state;
  }
}
