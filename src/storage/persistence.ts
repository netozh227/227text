import type { AppState, AuthSession } from '../types';
import { seedData, STORAGE_VERSION } from '../data/seedData';

const DATA_KEY = 'gpa-app-state';
const SESSION_KEY = 'gpa-auth-session';

function mergeWithSeed(parsed: Partial<AppState>): AppState {
  const base = structuredClone(seedData);
  if (parsed.schools?.length) {
    const ids = new Set(parsed.schools.map((s) => s.id));
    base.schools = [
      ...base.schools.filter((s) => !ids.has(s.id)),
      ...parsed.schools,
    ];
  }
  if (parsed.classes?.length) {
    const ids = new Set(parsed.classes.map((c) => c.id));
    base.classes = [
      ...base.classes.filter((c) => !ids.has(c.id)),
      ...parsed.classes,
    ];
  }
  if (parsed.photos?.length) {
    const ids = new Set(parsed.photos.map((p) => p.id));
    base.photos = [
      ...base.photos.filter((p) => !ids.has(p.id)),
      ...parsed.photos,
    ];
  }
  if (parsed.users) {
    base.users = parsed.users;
  }
  base.version = STORAGE_VERSION;
  return base;
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return structuredClone(seedData);
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== STORAGE_VERSION) {
      return mergeWithSeed(parsed);
    }
    return parsed;
  } catch {
    return structuredClone(seedData);
  }
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(DATA_KEY, JSON.stringify({ ...state, version: STORAGE_VERSION }));
}

export function resetToSeed(): AppState {
  const fresh = structuredClone(seedData);
  saveAppState(fresh);
  return fresh;
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}
