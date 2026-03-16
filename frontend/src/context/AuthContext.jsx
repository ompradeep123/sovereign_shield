import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { signIn, signOut } from '../services/authService';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(async config => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
     config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ? { ...session.user, ...session.user.user_metadata } : null;
      setUser(authUser);
      setIsLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ? { ...session.user, ...session.user.user_metadata } : null;
      setUser(authUser);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await signIn(email, password);
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

