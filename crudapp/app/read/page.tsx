"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Page = () => {
  const [pg, setPg] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [logged, setLogged] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [workersLoading, setWorkersLoading] = useState(true);
  const [profilePicUrl, setProfilePicUrl] = useState("/default-profile.jpeg");
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  /* ================= CHECK LOGIN ================= */
  useEffect(() => {
    const init = async () => {
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

    init();
  }, []);

  /* ================= FETCH PROFILE PIC ================= */
  useEffect(() => {
    if (!logged) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/getpic", {
          headers: { tok: Cookies.get("tok") },
        });

        setProfilePicUrl(res.data.url);
      } catch {
        // Fallback to asset image
        setProfilePicUrl("/images/default-profile.jpeg");
      }
    };

    fetchProfile();
  }, [logged]);

  /* ================= LOGOUT ================= */
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

  /* ================= IMAGE UPLOAD ================= */
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

  /* ================= FETCH WORKERS ================= */
  useEffect(() => {
    const fetchWorkers = async () => {
      setWorkersLoading(true);

      try {
        const res = await axios.get("/api/viewworkers", {
          headers: {
            tok: Cookies.get("tok"),
            pg: pg.toString(),
          },
        });

        const data = res.data.workers;

        if (data.length !== 0) {
          setItems(data);
        } else if (pg > 1) {
          setPg((prev) => prev - 1);
        }
      } catch {
        setMessage({ type: "error", text: "Failed fetching workers" });
      } finally {
        setWorkersLoading(false);
      }
    };

    if (logged) fetchWorkers();
  }, [pg, logged]);

  return (
    <div className="min-h-screen bg-gray-50">
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
                      key={profilePicUrl}
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

      {/* ================= TOAST ================= */}
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

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto pt-28 px-4 pb-16">
        {workersLoading ? (
          <div className="space-y-8 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="h-6 w-1/3 bg-gray-300 rounded mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {items.map((item) => (
              <div
                key={item.email}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {item.firstname} {item.lastname}
                  </h2>
                  <span className="text-sm text-gray-500">
                    User Information
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(item).map(
                    ([key, value]) =>
                      key !== "id" && (
                        <div
                          key={key}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                        >
                          <div className="text-xs uppercase text-gray-500">
                            {key}
                          </div>
                          <div className="mt-1 font-medium text-gray-800">
                            {value ? String(value) : "-"}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-center items-center mt-10 gap-6">
          <button
            disabled={workersLoading || pg === 1}
            onClick={() => setPg((prev) => prev - 1)}
            className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="font-medium text-gray-600">Page {pg}</span>

          <button
            disabled={workersLoading}
            onClick={() => setPg((prev) => prev + 1)}
            className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-40"
          >
            {workersLoading ? "Loading..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
