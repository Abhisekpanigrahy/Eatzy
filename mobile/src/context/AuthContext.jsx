import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authApi';
import { getToken, setToken, removeToken } from '../storage/storageHelpers';
import * as OrderPollingService from '../services/OrderPollingService';
import { requestPermissionsIfNeeded } from '../services/NotificationService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore token from AsyncStorage on mount
  useEffect(() => {
    const restore = async () => {
      const stored = await getToken();
      if (stored) {
        setTokenState(stored);
        OrderPollingService.start();
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await apiLogin(email, password);
      if (res.data.success) {
        await setToken(res.data.token);
        setTokenState(res.data.token);
        setUser({ name: res.data.name || '', email });
        OrderPollingService.start();
        requestPermissionsIfNeeded();
        return true;
      } else {
        setError(res.data.message || 'Login failed');
        return false;
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await apiRegister(name, email, password);
      if (res.data.success) {
        await setToken(res.data.token);
        setTokenState(res.data.token);
        setUser({ name, email });
        OrderPollingService.start();
        requestPermissionsIfNeeded();
        return true;
      } else {
        setError(res.data.message || 'Registration failed');
        return false;
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    // Update state immediately for instant UI response
    setTokenState(null);
    setUser(null);
    setError(null);
    
    // Perform cleanup in background
    OrderPollingService.stop();
    removeToken().catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
