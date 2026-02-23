"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Page = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    department: "",
    address: "",
    mobile: "",
    sex: "",
    nationality: "",
    email: "",
    tok: Cookies.get("tok"),
  });

  const [userEmail, setUserEmail] = useState("");
  const [logged, setLogged] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
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

  /* -------------------- FORM -------------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await axios.post("/api/addworker", userData);
      setMessage({ type: "success", text: "Worker Successfully Added" });

      setUserData({
        firstname: "",
        lastname: "",
        age: "",
        department: "",
        address: "",
        mobile: "",
        sex: "",
        nationality: "",
        email: "",
        tok: Cookies.get("tok"),
      });
    } catch {
      setMessage({ type: "error", text: "Addition Unsuccessful" });
    } finally {
      setFormLoading(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  return (
    <div>
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

      {/* ================= FORM ================= */}
      <div className="max-w-4xl mx-auto mt-28 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Create New User</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>

            {/* Age + Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={userData.department}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>

            {/* Address + Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={userData.mobile}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Sex + Nationality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Sex
                </label>
                <select
                  name="sex"
                  value={userData.sex}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={userData.nationality}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Nationality</option>
                  <option value="Nigerian">Nigerian</option>
                  <option value="Ghanaian">Ghanaian</option>
                  <option value="Kenyan">Kenyan</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              disabled={formLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                formLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              type="submit"
            >
              {formLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                "Create User"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
