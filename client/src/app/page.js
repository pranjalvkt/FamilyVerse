'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="p-4">
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button onClick={() => signIn('google')} className="px-4 py-2 bg-blue-500 text-white rounded">
        Sign in with Google
      </button>
    </div>
  );
}
