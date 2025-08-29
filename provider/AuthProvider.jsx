"use client"
import { supabase } from "@/lib/supabase/supabase-client";
import React, { createContext, useState, useEffect, useContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState()

  useEffect(() => {
    let isMounted = true;

    // Get user from Supabase session on mount
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!isMounted) return;
        if (error) {
          setUser(null);
        } else if (session && session.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUser(session?.user || null);
    });

    // Cleanup
    return () => {
      isMounted = false;
      if (authListener && typeof authListener.subscription?.unsubscribe === "function") {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext