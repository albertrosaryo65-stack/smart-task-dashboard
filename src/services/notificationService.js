// CRUD service for Notifications.
import { STORAGE_KEYS } from "../utils/constants";
import { getItem, setItem } from "./storageService";
import { generateId } from "../utils/helpers";

export function getAllNotifications() {
  return getItem(STORAGE_KEYS.NOTIFICATIONS, []);
}

export function getUnreadCount() {
  return getAllNotifications().filter((n) => !n.read).length;
}

export function createNotification(message, type = "general") {
  const notifications = getAllNotifications();
  const newNotification = {
    id: generateId("notif"),
    message,
    type,
    read: false,
    createdDate: new Date().toISOString().split("T")[0],
  };
  setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotification, ...notifications]);
  return newNotification;
}

export function markAsRead(id) {
  const notifications = getAllNotifications();
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
}

export function markAllAsRead() {
  const notifications = getAllNotifications().map((n) => ({ ...n, read: true }));
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

export function deleteNotification(id) {
  const notifications = getAllNotifications().filter((n) => n.id !== id);
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
}
