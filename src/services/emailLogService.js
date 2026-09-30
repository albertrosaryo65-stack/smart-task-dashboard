// Simulated outbound email log. This app has no backend or SMTP/email API
// integration, so "sending" an email means rendering the template and
// recording it here — visible proof the right content would go out, without
// making a real network call.
import { STORAGE_KEYS } from "../utils/constants";
import { getItem, setItem } from "./storageService";
import { generateId } from "../utils/helpers";

export function getAllEmails() {
  return getItem(STORAGE_KEYS.EMAIL_LOG, []);
}

export function logEmail({ to, from, subject, body, templateKey }) {
  const emails = getAllEmails();
  const entry = {
    id: generateId("email"),
    to,
    from,
    subject,
    body,
    templateKey,
    sentAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.EMAIL_LOG, [entry, ...emails]);
  return entry;
}

export function clearEmailLog() {
  setItem(STORAGE_KEYS.EMAIL_LOG, []);
}
