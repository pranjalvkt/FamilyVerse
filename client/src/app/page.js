'use client';

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Wait until NextAuth finishes checking the session
    if (status === "loading") return;

    // 1️⃣ Logged in via Google (NextAuth)
    if (session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        authType: "google",
      });
      return;
    }

    // 2️⃣ Logged in via custom JWT
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally: fetch user profile using token
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) =>
          setUser({
            name: data.name,
            email: data.email,
            role: data.role,
            authType: "custom",
          })
        )
        .catch(() => {
          localStorage.removeItem("token");
          router.push("/login");
        });
    } else {
      // No Google session or custom JWT
      router.push("/login");
    }
  }, [status, session, router]);

  const handleLogout = async () => {
    if (user?.authType === "google") {
      await signOut({ callbackUrl: "/login" });
    } else {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading your account...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
        {user.image && (
          <img
            src={user.image}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto mb-4 shadow"
          />
        )}

        <h2 className="text-2xl font-semibold mb-2">Welcome, {user.name} 👋</h2>
        <p className="text-gray-600 mb-6">{user.email}</p>

        {user.role && (
          <p className="text-sm text-gray-500 mb-4">Role: {user.role}</p>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}