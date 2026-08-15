"use client";

import { useCallback, useEffect, useState } from "react";
import { demoData } from "./demo-data";
import type { AppData } from "./types";
import { createClient, isSupabaseConfigured } from "./supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useRef } from "react";

const STORAGE_KEY = "apelsin-content-planner-v1";

export function usePlannerStore() {
  const [data, setDataState] = useState<AppData>(demoData);
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  const userIdRef = useRef<string | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCloud = isSupabaseConfigured();

  useEffect(() => {
    const loadLocal = () => {
      try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setDataState(JSON.parse(saved) as AppData); }
      catch { localStorage.removeItem(STORAGE_KEY); }
    };
    if (!isCloud) { loadLocal(); setReady(true); return; }
    const client = createClient(); clientRef.current = client;
    const loadCloud = async (userId: string) => {
      if (!client) return;
      const { data: row } = await client.from("settings").select("app_data").eq("user_id", userId).maybeSingle();
      if (row?.app_data) { const value = row.app_data as AppData; setDataState(value); localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); }
      else { loadLocal(); await client.from("settings").upsert({ user_id: userId, app_data: JSON.parse(localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(demoData)) }, { onConflict: "user_id" }); }
    };
    void client?.auth.getSession().then(async ({ data: sessionData }) => {
      const user = sessionData.session?.user; userIdRef.current = user?.id ?? null; setUserEmail(user?.email ?? null);
      if (user) await loadCloud(user.id); setReady(true);
    });
    const { data: listener } = client?.auth.onAuthStateChange((_event, session) => {
      const user = session?.user; userIdRef.current = user?.id ?? null; setUserEmail(user?.email ?? null);
      if (user) void loadCloud(user.id); setReady(true);
    }) ?? { data: { subscription: null } };
    return () => { listener.subscription?.unsubscribe(); if (syncTimerRef.current) clearTimeout(syncTimerRef.current); };
  }, [isCloud]);

  const setData = useCallback((next: AppData | ((current: AppData) => AppData)) => {
    setDataState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* storage can be unavailable */ }
      if (clientRef.current && userIdRef.current) {
        if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        syncTimerRef.current = setTimeout(() => { void clientRef.current?.from("settings").upsert({ user_id: userIdRef.current, app_data: value, updated_at: new Date().toISOString() }, { onConflict: "user_id" }); }, 350);
      }
      return value;
    });
  }, []);

  const reset = useCallback(() => setData(structuredClone(demoData)), [setData]);
  const signIn = useCallback(async (email: string) => {
    if (!clientRef.current) return "Supabase не настроен";
    const { error } = await clientRef.current.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    return error?.message ?? null;
  }, []);
  const signOut = useCallback(async () => { await clientRef.current?.auth.signOut(); userIdRef.current = null; setUserEmail(null); }, []);
  return { data, setData, ready, reset, isCloud, userEmail, signIn, signOut };
}
