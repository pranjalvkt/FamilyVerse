"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { GiFamilyTree } from "react-icons/gi";
import { MdInfoOutline } from "react-icons/md";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Handle Google login (via NextAuth)
    if (session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        authType: "google",
      });
    }
    // Handle simple email/password login (token-based)
    else {
      const token = localStorage.getItem("token");
      if (token) {
        // Fetch user profile from your backend (optional)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) =>
            setUser({
              name: data.name,
              email: data.email,
              role: data.role,
              image: data.image || "/default-avatar.png",
              authType: "custom",
            })
          )
          .catch(() => localStorage.removeItem("token"));
      }
    }
  }, [session]);

  const handleLogout = async () => {
    if (user?.authType === "google") {
      await signOut({ callbackUrl: "/login" });
    } else {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <div className="pt-16">
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Branding */}
            <div className="flex-shrink-0 flex items-center">
              <h1
                className="text-2xl font-bold text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors duration-300"
                onClick={() => router.push("/")}
              >
                FamilyVerse
              </h1>
            </div>
            {user && (
              <div className="hidden md:flex items-center space-x-8">
                <div className="relative">
                  <button
                    onClick={() => router.push("/")}
                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                  >
                    <FaHome className="h-6 w-6"/>
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => router.push("/about")}
                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                  >
                    <MdInfoOutline className="h-6 w-6"/>
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => router.push("/family")}
                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                  >
                    <GiFamilyTree className="h-6 w-6"/>
                  </button>
                </div>
              </div>
            )}

            {user ? (
              <div className="hidden md:flex items-center space-x-8">
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <Image src={user.image || "/default-avatar.png"} alt={user.name} className="w-9 h-9 rounded-full border border-gray-300" width={10} height={10}/>
                  </button>

                  {/* Dropdown */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setMenuOpen(false)}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Sign out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Links */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <ul className="flex flex-col space-y-1 px-6 py-4">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link href="/family" onClick={() => setMenuOpen(false)}>
                Family
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left">
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="text-left"
                >
                  Login
                </button>
              )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
