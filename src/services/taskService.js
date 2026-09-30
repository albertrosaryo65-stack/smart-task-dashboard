// CRUD service for Tasks.
import { STORAGE_KEYS } from "../utils/constants";
import { getItem, setItem } from "./storageService";
import { generateId } from "../utils/helpers";

export function getAllTasks() {
  return getItem(STORAGE_KEYS.TASKS, []);
}

export function getTaskById(id) {
  return getAllTasks().find((t) => t.id === id) || null;
}

export function getTasksByProject(projectId) {
  return getAllTasks().filter((t) => t.projectId === projectId);
}

export function createTask(taskData) {
  const tasks = getAllTasks();
  const newTask = {
    id: generateId("task"),
    createdDate: new Date().toISOString().split("T")[0],
    tags: [],
    ...taskData,
  };
  setItem(STORAGE_KEYS.TASKS, [...tasks, newTask]);
  return newTask;
}

export function updateTask(id, updates) {
  const tasks = getAllTasks();
  const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
  setItem(STORAGE_KEYS.TASKS, updated);
  return updated.find((t) => t.id === id);
}

export function deleteTask(id) {
  const tasks = getAllTasks().filter((t) => t.id !== id);
  setItem(STORAGE_KEYS.TASKS, tasks);
}
