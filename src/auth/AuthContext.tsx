import { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';

type User = {
  id: number;
  username: string;
  email: string;
  role: {
    name: string;
  };
};

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  initialized: boolean;
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken); // 👈 pedimos el usuario al backend
    } else {
      setInitialized(true);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch {
      logout(); // token inválido
    } finally {
      setInitialized(true);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    fetchUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
        initialized,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
