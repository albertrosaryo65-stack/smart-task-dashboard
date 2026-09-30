// Generic localStorage read/write helpers.
// All other services build on top of this file so that swapping
// localStorage for a real backend API later only requires changing
// this one layer.

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage`, error);
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write "${key}" to localStorage`, error);
  }
}

export function removeItem(key) {
  localStorage.removeItem(key);
}
