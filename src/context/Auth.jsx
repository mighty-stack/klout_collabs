import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      const data = await api('/profile');
      setUser(data.user);
      setProfile(data.profile);
      return data.profile;
    } catch (err) {
      setProfile(null);
      setProfileError(err.message);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { user: u } = await api('/auth/me');
      setUser(u);
      if (u.role === 'brand' || u.role === 'creator') await refreshProfile();
      else setProfile(null);
      return u;
    } catch (err) {
      // 401 (no session) and 403 (deactivated, rejected) both mean "not signed in".
      if (!(err instanceof ApiError) || ![0, 401, 403].includes(err.status)) console.error(err);
      setUser(null);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    const { user: u } = await api('/auth/login', { method: 'POST', body: { email, password } });
    setUser(u);
    if (u.role === 'brand' || u.role === 'creator') await refreshProfile();
    else setProfile(null);
    return u;
  }, [refreshProfile]);

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setProfile(null);
      setProfileError('');
    }
  }, []);

  const value = useMemo(() => ({
    user, profile, profileLoading, profileError, loading, login, logout, refresh, refreshProfile, setUser, setProfile,
  }), [user, profile, profileLoading, profileError, loading, login, logout, refresh, refreshProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
