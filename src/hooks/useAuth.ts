import { useState, useEffect } from "react";

const AUTH_URL = "https://functions.poehali.dev/82f956f3-6c93-49ed-83ac-f39205b22409";
const TOKEN_KEY = "bookverse_token";

export interface User {
  id: number;
  display_name: string;
  nickname: string;
  xp: number;
  level: number;
  coins: number;
  books_read: number;
  reviews_count: number;
  bookmarks_count: number;
  followers_count: number;
  avatar_emoji: string;
  bio: string;
  social_telegram: string;
  social_instagram: string;
  social_twitter: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    fetch(`${AUTH_URL}?action=me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data && !data.error) setUser(data); })
      .finally(() => setLoading(false));
  }, []);

  const register = async (email: string, nickname: string, display_name: string, password: string) => {
    const r = await fetch(`${AUTH_URL}?action=register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nickname, display_name, password }),
    });
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user as User;
  };

  const login = async (email: string, password: string) => {
    const r = await fetch(`${AUTH_URL}?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user as User;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return { user, loading, register, login, logout };
}
