// Simple key-value settings service.
import { STORAGE_KEYS } from "../utils/constants";
import { getItem, setItem } from "./storageService";

export function getSettings() {
  return getItem(STORAGE_KEYS.SETTINGS, {
    theme: "light",
    notificationsEnabled: true,
    emailAlerts: false,
  });
}

export function updateSettings(updates) {
  const settings = getSettings();
  const updated = { ...settings, ...updates };
  setItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}
