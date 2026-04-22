// Auth utilities using localStorage

export interface User {
  fullName: string;
  email: string;
  password: string;
  verified: boolean;
}

const USERS_KEY = "apheenx_users";
const CURRENT_USER_KEY = "apheenx_current_user";
const PENDING_EMAIL_KEY = "apheenx_pending_email";

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(
  fullName: string,
  email: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, message: "Email already registered" };
  }
  users.push({ fullName, email, password, verified: false });
  saveUsers(users);
  localStorage.setItem(PENDING_EMAIL_KEY, email);
  return { success: true, message: "Account created" };
}

export function signin(
  email: string,
  password: string,
  remember: boolean
): { success: boolean; message: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, message: "Account not found" };
  if (user.password !== password)
    return { success: false, message: "Invalid password" };
  if (!user.verified)
    return { success: false, message: "Please verify your account first" };

  if (remember) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
  return { success: true, message: "Signed in" };
}

export function verifyAccount(email?: string): {
  success: boolean;
  message: string;
} {
  const pendingEmail =
    email || localStorage.getItem(PENDING_EMAIL_KEY) || "";
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === pendingEmail);
  if (idx === -1)
    return { success: false, message: "Account not found" };
  users[idx].verified = true;
  saveUsers(users);
  localStorage.removeItem(PENDING_EMAIL_KEY);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[idx]));
  return { success: true, message: "Account verified" };
}

export function getPendingEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(PENDING_EMAIL_KEY) || "";
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const data =
    localStorage.getItem(CURRENT_USER_KEY) ||
    sessionStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function signout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
}
