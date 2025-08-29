"use client"
import { supabase } from "@/lib/supabase/supabase-client";
import React, { createContext, useState, useEffect, useContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user from Supabase session on mount
  useEffect(() => {
    const getUserFromSupabase = async () => {
      try {
      
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setUser(null);
        } else if (session && session.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    getUserFromSupabase();
    // Listen for auth changes
    const {data, error} = supabase.auth.onAuthStateChange((_event, session)=>{
      setUser(session?.user || null)
    })
  }, []);



  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext