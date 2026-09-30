// Seeds localStorage with demo data the first time the app runs.
import { STORAGE_KEYS } from "../utils/constants";
import { getItem, setItem } from "./storageService";
import {
  seedUsers,
  seedProjects,
  seedTasks,
  seedNotifications,
  seedSettings,
  seedEmailTemplates,
} from "../data/seedData";

export function seedDatabaseIfNeeded() {
  const alreadySeeded = getItem(STORAGE_KEYS.SEEDED, false);
  if (alreadySeeded) return;

  setItem(STORAGE_KEYS.USERS, seedUsers);
  setItem(STORAGE_KEYS.PROJECTS, seedProjects);
  setItem(STORAGE_KEYS.TASKS, seedTasks);
  setItem(STORAGE_KEYS.NOTIFICATIONS, seedNotifications);
  setItem(STORAGE_KEYS.SETTINGS, seedSettings);
  setItem(STORAGE_KEYS.EMAIL_TEMPLATES, seedEmailTemplates);
  setItem(STORAGE_KEYS.EMAIL_LOG, []);
  setItem(STORAGE_KEYS.SEEDED, true);
}
