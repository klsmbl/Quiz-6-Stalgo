const USERS_KEY = "cleanLinkUsers";
const CURRENT_USER_KEY = "cleanLinkCurrentUser";
const SELLER_APPLICATIONS_KEY = "cleanLinkSellerApplications";

const defaultAdminUser = {
  email: "admin@cleanlink.com",
  username: "cleanlinkadmin",
  phoneNumber: "09000000000",
  firstName: "System",
  lastName: "Admin",
  location: "Head Office",
  gender: "Prefer not to say",
  password: "Admin12345",
  role: "Admin",
};

function readJson(key, fallbackValue) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallbackValue));
  } catch {
    return fallbackValue;
  }
}

export function getUsers() {
  return readJson(USERS_KEY, []);
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSellerApplications() {
  return readJson(SELLER_APPLICATIONS_KEY, []);
}

export function saveSellerApplications(applications) {
  localStorage.setItem(SELLER_APPLICATIONS_KEY, JSON.stringify(applications));
}

export function getCurrentUser() {
  return readJson(CURRENT_USER_KEY, null);
}

export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function syncCurrentUser(users) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return;
  }

  const refreshedUser = users.find((user) => user.email === currentUser.email);

  if (refreshedUser) {
    setCurrentUser(refreshedUser);
    return;
  }

  clearCurrentUser();
}

export function ensureAdminUser() {
  const users = getUsers();
  const hasAdmin = users.some((user) => user.role === "Admin");

  if (hasAdmin) {
    return users;
  }

  const nextUsers = [defaultAdminUser, ...users];
  saveUsers(nextUsers);
  return nextUsers;
}

export function getDefaultAdminCredentials() {
  return {
    email: defaultAdminUser.email,
    password: defaultAdminUser.password,
  };
}