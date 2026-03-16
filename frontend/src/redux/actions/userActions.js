import { USER_ADD, USER_DELETE, USER_SET_ALL, USER_UPDATE } from "../constants/userConstants";
import { saveUsers, syncCurrentUser } from "../../utils/storage";

export function setUsers(users) {
  saveUsers(users);
  syncCurrentUser(users);
  return {
    type: USER_SET_ALL,
    payload: users,
  };
}

export function addUser(user, users) {
  const nextUsers = [...users, user];
  saveUsers(nextUsers);
  syncCurrentUser(nextUsers);
  return {
    type: USER_ADD,
    payload: user,
  };
}

export function updateUser(updatedUser, users) {
  const nextUsers = users.map((user) => (user.email === updatedUser.originalEmail ? {
    ...user,
    ...updatedUser.data,
  } : user));
  saveUsers(nextUsers);
  syncCurrentUser(nextUsers);
  return {
    type: USER_UPDATE,
    payload: updatedUser,
  };
}

export function deleteUser(userEmail, users) {
  const nextUsers = users.filter((user) => user.email !== userEmail);
  saveUsers(nextUsers);
  syncCurrentUser(nextUsers);
  return {
    type: USER_DELETE,
    payload: userEmail,
  };
}
