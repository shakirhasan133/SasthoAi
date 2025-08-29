"use client"

import useAuth from "@/hooks/use-auth";
import { redirect } from "next/navigation";

export default function PrivateLayout({ children }) {
  const {loading, user} = useAuth()
  if(loading) {
    return <h1>Loading</h1>
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {children}
    </>
  );
}
