"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

type AuthSessionContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setSessionValue: (session: Session | null) => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({
  initialSession,
  children,
}: {
  initialSession: Session | null;
  children: React.ReactNode;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(initialSession);
  const [loading, setLoading] = useState(!initialSession);

  const setSessionValue = useCallback((nextSession: Session | null) => {
    setSession(nextSession);
    setLoading(false);
  }, []);

  useEffect(() => {
    setSessionValue(initialSession);
    setLoading(!initialSession);
  }, [initialSession, setSessionValue]);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const {
        data: { session: latestSession },
      } = await supabase.auth.getSession();
      if (isMounted) {
        setSessionValue(latestSession);
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSessionValue(newSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, setSessionValue]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const {
      data: { session: latestSession },
    } = await supabase.auth.getSession();
    setSessionValue(latestSession);
  }, [supabase, setSessionValue]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      refresh,
      setSessionValue,
    }),
    [session, loading, refresh, setSessionValue],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider");
  }
  return context;
}
