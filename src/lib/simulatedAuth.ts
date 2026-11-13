import type { AppState, AuthSession, UserAccount } from '../types';

export const SIMULATED_USER_ID = 'usr-simulated';

const simulatedUser: UserAccount = {
  id: SIMULATED_USER_ID,
  username: 'visitor',
  passwordHash: '',
  displayName: '访客体验',
  joinedClassIds: [],
  createdAt: '2020-01-01T00:00:00.000Z',
};

export function getSimulatedSession(): AuthSession {
  return {
    userId: simulatedUser.id,
    username: simulatedUser.username,
    displayName: simulatedUser.displayName,
  };
}

export function ensureSimulatedUser(state: AppState): AppState {
  if (state.users.some((u) => u.id === SIMULATED_USER_ID)) {
    return state;
  }
  return { ...state, users: [...state.users, { ...simulatedUser }] };
}

export function resolveSession(
  stored: AuthSession | null,
  state: AppState,
): AuthSession {
  if (stored && state.users.some((u) => u.id === stored.userId)) {
    return stored;
  }
  return getSimulatedSession();
}

/** Session present for UI (includes default visitor simulation). */
export function isUiAuthenticated(session: AuthSession | null): boolean {
  return session !== null;
}
