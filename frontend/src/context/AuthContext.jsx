import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getDeviceFingerprint } from '../utils/biometric';
import { supabase } from '../lib/supabaseClient';
import { signIn, signOut } from '../services/authService';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(async config => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
     config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  // Zero Trust: Always attach device fingerprint
  config.headers['X-Device-Fingerprint'] = getDeviceFingerprint();
  return config;
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = session.user.app_metadata?.role || session.user.user_metadata?.role || session.user.role;
        setUser({ ...session.user, ...session.user.user_metadata, role });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = session.user.app_metadata?.role || session.user.user_metadata?.role || session.user.role;
        setUser({ ...session.user, ...session.user.user_metadata, role });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await signIn(email, password);
  };

  const logout = async () => {
    if (user?.id) {
        localStorage.removeItem(`zkp_proofs_${user.id}`);
    }
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

