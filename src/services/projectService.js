// CRUD service for Projects. Components should always go through
// these functions instead of touching localStorage directly.
import { STORAGE_KEYS } from "../utils/constants";
import { getItem, setItem } from "./storageService";
import { generateId } from "../utils/helpers";

export function getAllProjects() {
  return getItem(STORAGE_KEYS.PROJECTS, []);
}

export function getProjectById(id) {
  return getAllProjects().find((p) => p.id === id) || null;
}

export function createProject(projectData) {
  const projects = getAllProjects();
  const newProject = {
    id: generateId("proj"),
    ...projectData,
  };
  setItem(STORAGE_KEYS.PROJECTS, [...projects, newProject]);
  return newProject;
}

export function updateProject(id, updates) {
  const projects = getAllProjects();
  const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
  setItem(STORAGE_KEYS.PROJECTS, updated);
  return updated.find((p) => p.id === id);
}

export function deleteProject(id) {
  const projects = getAllProjects().filter((p) => p.id !== id);
  setItem(STORAGE_KEYS.PROJECTS, projects);
}
