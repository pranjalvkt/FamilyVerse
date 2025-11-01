'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    const loadUser = async () => {
      try {
        let res;
        if (session?.user) {
          // Google user → fetch from backend
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });
        } else {
          const token = localStorage.getItem("token");
          if (!token) {
            router.push("/login");
            return;
          }
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        const data = await res.json();
        setUser(data);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [session, status, router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          bio: user.bio,
          location: user.location,
        }),
      });
      const data = await res.json();
      setUser(data.user);
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  if (!user)
    return (
      <div className="text-center text-gray-600 mt-10">
        No user data found.
      </div>
    );

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

        <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-4">{user.email}</p>

        <div className="text-left">
          <label className="block text-sm text-gray-600 mb-1">Bio</label>
          <textarea
            value={user.bio || ""}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
            className="w-full border rounded-lg p-2 mb-3"
          />

          <label className="block text-sm text-gray-600 mb-1">Location</label>
          <input
            type="text"
            value={user.location || ""}
            onChange={(e) => setUser({ ...user, location: e.target.value })}
            className="w-full border rounded-lg p-2 mb-4"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
