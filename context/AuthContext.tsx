import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import api from '../services/api';
import { setLogoutHandler } from '../services/authEvents';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

type Household = {
  id: number;
  name: string;
  joined_at: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  households: Household[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!accessToken;

  // Restore tokens on app start
  useEffect(() => {
    setLogoutHandler(logout);

    // bootstrap logic
    const bootstrapAuth = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const storedTokens = JSON.parse(credentials.password);
          setAccessToken(storedTokens.access);
          setRefreshToken(storedTokens.refresh);
          
          api.defaults.headers.common.Authorization =
            `Bearer ${storedTokens.access}`;
          
          // Fetch user from backend
          const meResponse = await api.get('auth/me/');
          setUser(meResponse.data);
          console.log("AuthContext user:", meResponse.data);
        }
      } catch (e) {
        console.warn('Failed to restore auth state');
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };




    bootstrapAuth();
  }, []);

const login = async (username: string, password: string) => {
  const response = await api.post('api/auth/login/', {
    username,
    password,
  });

  const { access, refresh } = response.data;

  setAccessToken(access);
  setRefreshToken(refresh);

  api.defaults.headers.common.Authorization = `Bearer ${access}`;

  // Fetch user info
  const meResponse = await api.get('auth/me/');
  const userData = meResponse.data;

  console.log("Loaded user:", userData);

  setUser(userData);

  await Keychain.setGenericPassword(
    'jwt',
    JSON.stringify({
      access,
      refresh,
      user: userData,
    })
  );
};

  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    delete api.defaults.headers.common.Authorization;
    await Keychain.resetGenericPassword();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
