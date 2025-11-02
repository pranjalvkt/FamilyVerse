'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({ bio: '', location: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Detect Google vs Custom Login
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user) {
      // Logged in via Google (NextAuth)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role || 'viewer',
        authType: 'google',
      });
    } else {
      // Custom email/password JWT flow
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch user profile from backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({ ...data, authType: 'custom' });
          setEditableUser({
            bio: data?.bio || '',
            location: data?.location || '',
          });
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/login');
        });
    }
  }, [session, router, status]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    const token =
      user.authType === 'google'
        ? user.backendToken || session?.user?.backendToken
        : localStorage.getItem('token');

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/update`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editableUser),
      }
    );

    if (res.ok) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
    setIsSaving(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }
  console.log(user);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={
              user.image ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
            alt="User avatar"
            className="w-28 h-28 rounded-full shadow-md mb-4 object-cover"
          />
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <span
            className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'owner'
                ? 'bg-purple-100 text-purple-600'
                : user.role === 'editor'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {user.role}
          </span>
        </div>

        {/* Editable Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={editableUser.bio}
              onChange={(e) =>
                setEditableUser({ ...editableUser, bio: e.target.value })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={editableUser.location}
              onChange={(e) =>
                setEditableUser({ ...editableUser, location: e.target.value })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your city or country"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
