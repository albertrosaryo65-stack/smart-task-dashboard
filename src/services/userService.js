// CRUD service for Team members (Users).
import { STORAGE_KEYS } from "../utils/constants";
import { getItem, setItem } from "./storageService";
import { generateId } from "../utils/helpers";

const AVATAR_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

export function getAllUsers() {
  const users = getItem(STORAGE_KEYS.USERS, []);
  let needsFix = false;
  const fixed = users.map((u) => {
    let updated = u;
    if (!updated.password) {
      needsFix = true;
      updated = { ...updated, password: "password123" };
    }
    if (updated.email && (updated.email !== updated.email.trim() || updated.email !== updated.email.trim().toLowerCase())) {
      needsFix = true;
      updated = { ...updated, email: updated.email.trim().toLowerCase() };
    }
    return updated;
  });
  if (needsFix) {
    setItem(STORAGE_KEYS.USERS, fixed);
  }
  return fixed;
}

export function getUserById(id) {
  return getAllUsers().find((u) => u.id === id) || null;
}

export function getCurrentUser() {
  const currentUserId = getItem(STORAGE_KEYS.CURRENT_USER, null);
  if (!currentUserId) return null;
  return getUserById(currentUserId);
}

export function loginUser(email, password) {
  if (!email || !password) return null;
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  const user = getAllUsers().find(
    (u) => (u.email || "").trim().toLowerCase() === cleanEmail
  );
  if (!user) return null;

  const expectedPassword = (user.password || "password123").trim();
  if (expectedPassword !== cleanPassword) return null;

  setItem(STORAGE_KEYS.CURRENT_USER, user.id);
  return user;
}

export function logoutUser() {
  setItem(STORAGE_KEYS.CURRENT_USER, null);
}

export function isAdmin(user) {
  return user?.role === "Project Manager";
}

export function createUser(userData) {
  const users = getAllUsers();
  const cleanEmail = (userData.email || "").trim().toLowerCase();
  const cleanPassword = (userData.password && userData.password.trim()) || "password123";

  const newUser = {
    id: generateId("user"),
    status: "Active",
    avatarColor: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
    ...userData,
    name: (userData.name || "").trim(),
    email: cleanEmail,
    password: cleanPassword,
  };
  setItem(STORAGE_KEYS.USERS, [...users, newUser]);
  return newUser;
}

export function updateUser(id, updates) {
  const users = getAllUsers();
  const cleanUpdates = { ...updates };
  if (cleanUpdates.name !== undefined) {
    cleanUpdates.name = cleanUpdates.name.trim();
  }
  if (cleanUpdates.email !== undefined) {
    cleanUpdates.email = cleanUpdates.email.trim().toLowerCase();
  }
  if (cleanUpdates.password !== undefined) {
    const trimmedPw = cleanUpdates.password ? cleanUpdates.password.trim() : "";
    if (trimmedPw) {
      cleanUpdates.password = trimmedPw;
    } else {
      delete cleanUpdates.password;
    }
  }
  const updated = users.map((u) => (u.id === id ? { ...u, ...cleanUpdates } : u));
  setItem(STORAGE_KEYS.USERS, updated);
  return updated.find((u) => u.id === id);
}

export function deleteUser(id) {
  const users = getAllUsers().filter((u) => u.id !== id);
  setItem(STORAGE_KEYS.USERS, users);
}
