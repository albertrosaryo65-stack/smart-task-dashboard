// CRUD + rendering for editable email templates.
// Templates are plain {subject, body} strings with {{placeholder}} tokens
// that get substituted at send time. No real email is ever transmitted —
// this app has no backend/SMTP integration (see emailLogService).
import { STORAGE_KEYS } from "../utils/constants";
import { getItem, setItem } from "./storageService";
import { seedEmailTemplates } from "../data/seedData";

export function getAllTemplates() {
  return getItem(STORAGE_KEYS.EMAIL_TEMPLATES, seedEmailTemplates);
}

export function getTemplate(key) {
  return getAllTemplates()[key] || null;
}

export function updateTemplate(key, updates) {
  const templates = getAllTemplates();
  const updated = { ...templates, [key]: { ...templates[key], ...updates } };
  setItem(STORAGE_KEYS.EMAIL_TEMPLATES, updated);
  return updated[key];
}

export function resetTemplate(key) {
  return updateTemplate(key, seedEmailTemplates[key]);
}

// Replaces every {{token}} in a string with values[token], leaving any
// unmatched token in place so gaps are visible rather than silently dropped.
export function renderTemplateString(str, values) {
  return str.replace(/{{\s*(\w+)\s*}}/g, (match, token) =>
    token in values ? String(values[token]) : match
  );
}

export function renderTemplate(key, values) {
  const template = getTemplate(key);
  if (!template) return null;
  return {
    subject: renderTemplateString(template.subject, values),
    body: renderTemplateString(template.body, values),
  };
}
