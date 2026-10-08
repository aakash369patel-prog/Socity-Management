import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiClient, getAuthToken, setAuthToken, setUnauthorizedHandler } from '../services/apiClient';
import { switchCurrentSociety } from '../services/societyService';
import type { AuthUser } from '../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setCurrentSociety: (societyId: number) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout');
    } catch {
      // ignore — token may already be invalid
    }
    setAuthToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
    });
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    apiClient
      .get<{ data: AuthUser }>('/user')
      .then(({ data }) => setUser(data.data))
      .catch(() => setAuthToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post<{ token: string; user: AuthUser }>('/login', {
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });
    setAuthToken(data.token);
    setUser(data.user);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await apiClient.get<{ data: AuthUser }>('/user');
    setUser(data.data);
  }, []);

  const setCurrentSociety = useCallback(async (societyId: number) => {
    const updated = await switchCurrentSociety(societyId);
    setUser(updated);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshUser,
      setCurrentSociety,
      isAuthenticated: !!user,
    }),
    [user, loading, login, logout, refreshUser, setCurrentSociety]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
