'use client';

import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({ children }) {
  return <>
  <SessionProvider>
    <Navbar />
    <main>{children}</main>
  </SessionProvider>
  </>;
}