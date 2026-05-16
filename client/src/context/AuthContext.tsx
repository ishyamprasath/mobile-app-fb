import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, login as apiLogin, register as apiRegister } from '../lib/api';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    designation: string;
    department: string;
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tvs_token');

    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe()
      .then((fetchedUser) => setUser(fetchedUser))
      .catch(() => {
        localStorage.removeItem('tvs_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(identifier, password) {
        const response = await apiLogin(identifier, password);
        localStorage.setItem('tvs_token', response.token);
        setUser(response.user);
        return response.user;
      },
      async register(payload) {
        const response = await apiRegister(payload);
        localStorage.setItem('tvs_token', response.token);
        setUser(response.user);
        return response.user;
      },
      logout() {
        localStorage.removeItem('tvs_token');
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
