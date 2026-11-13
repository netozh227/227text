import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AppState,
  AuthSession,
  ClassArchive,
  Photo,
  PrivacyScope,
  UserAccount,
} from '../types';
import { hashPassword, verifyPassword } from '../lib/crypto';
import {
  ensureSimulatedUser,
  getSimulatedSession,
  resolveSession,
} from '../lib/simulatedAuth';
import {
  loadAppState,
  loadSession,
  saveAppState,
  saveSession,
} from '../storage/persistence';

interface AppContextValue {
  state: AppState;
  session: AuthSession | null;
  joinedClassIds: string[];
  register: (
    username: string,
    password: string,
    displayName: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  login: (
    username: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
  joinClass: (classId: string) => { ok: true } | { ok: false; message: string };
  leaveClass: (classId: string) => void;
  addPhoto: (input: Omit<Photo, 'id' | 'createdAt'>) => { ok: true; photo: Photo } | { ok: false; message: string };
  updatePhotoPrivacy: (photoId: string, privacy: PrivacyScope) => void;
  deletePhoto: (photoId: string) => { ok: true } | { ok: false; message: string };
  getUser: (userId: string) => UserAccount | undefined;
  persist: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function findUserByUsername(state: AppState, username: string): UserAccount | undefined {
  const normalized = username.trim().toLowerCase();
  return state.users.find((u) => u.username.toLowerCase() === normalized);
}

function initApp(): { state: AppState; session: AuthSession } {
  const state = ensureSimulatedUser(loadAppState());
  const session = resolveSession(loadSession(), state);
  saveAppState(state);
  saveSession(session);
  return { state, session };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(initApp);
  const [state, setState] = useState<AppState>(() => initial.state);
  const [session, setSession] = useState<AuthSession | null>(() => initial.session);

  const persistState = useCallback((next: AppState) => {
    setState(next);
    saveAppState(next);
  }, []);

  const currentUser = useMemo(() => {
    if (!session) return undefined;
    return state.users.find((u) => u.id === session.userId);
  }, [session, state.users]);

  const joinedClassIds = currentUser?.joinedClassIds ?? [];

  const register = useCallback(
    async (username: string, password: string, displayName: string) => {
      if (username.trim().length < 2)
        return { ok: false as const, message: '用户名至少 2 个字符' };
      if (password.length < 4)
        return { ok: false as const, message: '密码至少 4 个字符（模拟环境）' };
      if (findUserByUsername(state, username))
        return { ok: false as const, message: '用户名已被注册' };

      const user: UserAccount = {
        id: `usr-${crypto.randomUUID()}`,
        username: username.trim(),
        passwordHash: await hashPassword(password),
        displayName: displayName.trim() || username.trim(),
        joinedClassIds: [],
        createdAt: new Date().toISOString(),
      };
      const next = { ...state, users: [...state.users, user] };
      persistState(next);
      const sess: AuthSession = {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
      };
      setSession(sess);
      saveSession(sess);
      return { ok: true as const };
    },
    [persistState, state],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const user = findUserByUsername(state, username);
      if (!user) return { ok: false as const, message: '用户不存在，请先注册' };
      if (!(await verifyPassword(password, user.passwordHash)))
        return { ok: false as const, message: '密码错误' };
      const sess: AuthSession = {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
      };
      setSession(sess);
      saveSession(sess);
      return { ok: true as const };
    },
    [state],
  );

  const logout = useCallback(() => {
    const simulated = getSimulatedSession();
    setSession(simulated);
    saveSession(simulated);
  }, []);

  const updateUserClasses = useCallback(
    (userId: string, classIds: string[]) => {
      const users = state.users.map((u) =>
        u.id === userId ? { ...u, joinedClassIds: classIds } : u,
      );
      persistState({ ...state, users });
    },
    [persistState, state],
  );

  const joinClass = useCallback(
    (classId: string) => {
      if (!session) return { ok: false as const, message: '请先登录后再加入班级' };
      const cls = state.classes.find((c) => c.id === classId);
      if (!cls) return { ok: false as const, message: '班级不存在' };
      const user = state.users.find((u) => u.id === session.userId);
      if (!user) return { ok: false as const, message: '用户不存在' };
      if (user.joinedClassIds.includes(classId))
        return { ok: false as const, message: '您已在该班级档案中' };
      updateUserClasses(user.id, [...user.joinedClassIds, classId]);
      return { ok: true as const };
    },
    [session, state, updateUserClasses],
  );

  const leaveClass = useCallback(
    (classId: string) => {
      if (!session) return;
      const user = state.users.find((u) => u.id === session.userId);
      if (!user) return;
      updateUserClasses(
        user.id,
        user.joinedClassIds.filter((id) => id !== classId),
      );
    },
    [session, state, updateUserClasses],
  );

  const addPhoto = useCallback(
    (input: Omit<Photo, 'id' | 'createdAt'>) => {
      if (!session) return { ok: false as const, message: '请先登录' };
      if (!joinedClassIds.includes(input.classId))
        return { ok: false as const, message: '仅可向已加入的班级上传照片' };
      const photo: Photo = {
        ...input,
        id: `ph-${crypto.randomUUID()}`,
        uploadedBy: session.userId,
        createdAt: new Date().toISOString(),
      };
      persistState({ ...state, photos: [...state.photos, photo] });
      return { ok: true as const, photo };
    },
    [session, joinedClassIds, persistState, state],
  );

  const updatePhotoPrivacy = useCallback(
    (photoId: string, privacy: PrivacyScope) => {
      if (!session) return;
      const photo = state.photos.find((p) => p.id === photoId);
      if (!photo || photo.uploadedBy !== session.userId) return;
      const photos = state.photos.map((p) =>
        p.id === photoId ? { ...p, privacy } : p,
      );
      persistState({ ...state, photos });
    },
    [session, persistState, state],
  );

  const deletePhoto = useCallback(
    (photoId: string) => {
      if (!session) return { ok: false as const, message: '请先登录' };
      const photo = state.photos.find((p) => p.id === photoId);
      if (!photo) return { ok: false as const, message: '照片不存在' };
      if (photo.uploadedBy !== session.userId && photo.uploadedBy !== 'system-seed')
        return { ok: false as const, message: '只能删除自己上传的照片' };
      if (photo.uploadedBy === 'system-seed')
        return { ok: false as const, message: '示例影像不可删除' };
      const photos = state.photos.filter((p) => p.id !== photoId);
      persistState({ ...state, photos });
      return { ok: true as const };
    },
    [session, persistState, state],
  );

  const value: AppContextValue = {
    state,
    session,
    joinedClassIds,
    register,
    login,
    logout,
    joinClass,
    leaveClass,
    addPhoto,
    updatePhotoPrivacy,
    deletePhoto,
    getUser: (id) => state.users.find((u) => u.id === id),
    persist: () => saveAppState(state),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useSchool(id: string) {
  const { state } = useApp();
  return state.schools.find((s) => s.id === id);
}

export function useClass(id: string): ClassArchive | undefined {
  const { state } = useApp();
  return state.classes.find((c) => c.id === id);
}

export function usePhoto(id: string): Photo | undefined {
  const { state } = useApp();
  return state.photos.find((p) => p.id === id);
}
