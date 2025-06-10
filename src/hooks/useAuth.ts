'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export const useAuth = () => {
  const router = useRouter();
  const { setToken, clearToken } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const signUp = useCallback(async (form: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to create account');

      const data = await res.json();
      setToken(data.token); // Save token in Zustand store

      router.push('/dashboard');
    } catch (error) {
      console.error('Sign-up error:', error);
    } finally {
      setLoading(false);
    }
  }, [router, setToken]);

  const signIn = useCallback(async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();
      setToken(data.token); // Save token in Zustand store

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }, [router, setToken]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      clearToken(); // Clear token from Zustand store
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [router, clearToken]);

  return {
    loading,
    signUp,
    signIn,
    signOut,
  };
};
