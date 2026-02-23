"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [logged, setLogged] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [profilePicUrl, setProfilePicUrl] = useState<string>(
    "/default-profile.jpg",
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  /* -------------------- CHECK LOGIN -------------------- */
  useEffect(() => {
    const checkLogged = async () => {
      try {
        const res = await axios.get("/api/getme", {
          headers: { tok: Cookies.get("tok") },
        });

        setUserEmail(res.data.email);
        setLogged(true);
      } catch {
        setLogged(false);
      } finally {
        setPageLoading(false);
      }
    };

    checkLogged();
  }, []);

  /* -------------------- FETCH PROFILE PIC -------------------- */
  useEffect(() => {
    if (!logged) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/getpic", {
          headers: { tok: Cookies.get("tok") },
        });

        if (res.data?.url) {
          setProfilePicUrl(res.data.url);
        }
      } catch {
        setProfilePicUrl("/default-profile.jpg");
      }
    };

    fetchProfile();
  }, [logged]);

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    try {
      await axios.get("/api/disconnect", {
        headers: { tok: Cookies.get("tok") },
      });

      setLogged(false);
      setUserEmail("");
      setMessage({ type: "success", text: "Logged out successfully" });
    } catch {
      setMessage({ type: "error", text: "Logout failed" });
    }

    setTimeout(() => setMessage(null), 2500);
  };

  /* -------------------- IMAGE UPLOAD -------------------- */
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Invalid image file" });
      return;
    }

    if (file.size > 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be less than 1MB" });
      return;
    }

    setUploading(true);

    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(",")[1];

      try {
        await axios.post("/api/picpush", {
          tok: Cookies.get("tok"),
          image: base64,
          type: file.type,
          name: "profilepic",
        });

        // Refresh profile picture
        const res = await axios.get("/api/getpic", {
          headers: { tok: Cookies.get("tok") },
        });

        setProfilePicUrl(res.data.url);
        setMessage({ type: "success", text: "Profile updated!" });
      } catch {
        setMessage({ type: "error", text: "Upload failed" });
      } finally {
        setUploading(false);
        setTimeout(() => setMessage(null), 2500);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: "url(/images/landing-background.svg)" }}
    >
      {/* ================= NAVBAR ================= */}
      <nav className="bg-gray-800 py-4 fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold text-white">
            CrudApp
          </Link>

          {pageLoading ? (
            <div className="flex space-x-4 animate-pulse">
              <div className="h-6 w-16 bg-gray-600 rounded" />
              <div className="h-6 w-16 bg-gray-600 rounded" />
              <div className="h-6 w-16 bg-gray-600 rounded" />
              <div className="w-10 h-10 bg-gray-600 rounded-full" />
            </div>
          ) : (
            <>
              <ul className="hidden md:flex items-center space-x-6 text-gray-300">
                <li>
                  <Link href="/create">Create</Link>
                </li>
                <li>
                  <Link href="/read">Read</Link>
                </li>
                <li>
                  <Link href="/update">Update</Link>
                </li>
                <li>
                  <Link href="/delete">Delete</Link>
                </li>
                {logged && (
                  <li
                    onClick={handleLogout}
                    className="cursor-pointer hover:text-red-400"
                  >
                    Logout
                  </li>
                )}
              </ul>

              {logged && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 hidden md:block">
                    {userEmail}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    id="profileUpload"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  <label
                    htmlFor="profileUpload"
                    className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-gray-400 hover:border-white transition"
                  >
                    <Image
                      src={profilePicUrl}
                      fill
                      alt="Profile"
                      className="object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      {/* ================= MESSAGE TOAST ================= */}
      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-6 py-3 rounded shadow-lg text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <div className="flex items-center justify-start pt-28 px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl">
          <h1 className="text-3xl font-bold mb-4">Worker Management System</h1>

          <p className="text-gray-700 mb-4">
            Manage workers efficiently. Create, update, view and delete records
            easily.
          </p>

          {!logged && (
            <div className="space-y-2">
              <Link
                href="/auth/login"
                className="block text-blue-600 hover:underline"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="block text-blue-600 hover:underline"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
