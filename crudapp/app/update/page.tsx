"use client";

import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [userData, setUserData] = useState({
    age: "",
    department: "",
    address: "",
    email: "",
    mobile: "",
    sex: "",
    nationality: "",
    tok: Cookies.get("tok"),
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [logged, setLogged] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(",")[1];

      try {
        await axios.post("/api/picpush", {
          tok: Cookies.get("tok"),
          image: base64,
          type: file.type,
          name: "profilepic",
        });

        setProfilePicUrl(result);
      } catch {
        console.log("Upload failed");
      }
    };

    reader.readAsDataURL(file);
  };
  const handleLogout = async () => {
    try {
      await axios.get("/api/disconnect", {
        headers: { tok: Cookies.get("tok") },
      });

      setLogged(false);
      setUserEmail("");
    } catch {
      console.log("Logout failed");
    }
  };

  // Universal handler (input + select)
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Check Login
  useEffect(() => {
    const checkLogged = async () => {
      try {
        const response = await axios.get("/api/getme", {
          headers: { tok: Cookies.get("tok") },
        });
        setUserEmail(response.data.email);
        setLogged(true);
      } catch {
        setLogged(false);
      } finally {
        setPageLoading(false);
      }
    };

    checkLogged();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get("/api/getpic", {
        headers: { tok: Cookies.get("tok") },
      });

      setProfilePicUrl(res.data.url);
    };

    fetchProfile();
  }, []);

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.put("/api/updateworker", userData);
      setSuccessMessage("Worker Successfully Updated");

      setUserData({
        age: "",
        department: "",
        address: "",
        mobile: "",
        email: "",
        sex: "",
        nationality: "",
        tok: Cookies.get("tok"),
      });
    } catch {
      setErrorMessage("Update Unsuccessful");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="bg-gray-800 py-4 fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="text-lg font-bold text-white cursor-pointer">
              CrudApp
            </div>
          </Link>

          {/* Navbar Skeleton While Checking Login */}
          {pageLoading ? (
            <div className="flex space-x-6 items-center animate-pulse">
              <div className="h-6 w-16 bg-gray-600 rounded"></div>
              <div className="h-6 w-16 bg-gray-600 rounded"></div>
              <div className="h-6 w-16 bg-gray-600 rounded"></div>
              <div className="h-6 w-16 bg-gray-600 rounded"></div>
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            </div>
          ) : (
            <>
              {/* Desktop Nav Links */}
              <ul className="md:flex hidden items-center space-x-6">
                <li>
                  <Link
                    href="/create"
                    className="text-gray-300 hover:text-white"
                  >
                    Create
                  </Link>
                </li>
                <li>
                  <Link href="/read" className="text-gray-300 hover:text-white">
                    Read
                  </Link>
                </li>
                <li>
                  <Link
                    href="/update"
                    className="text-gray-300 hover:text-white"
                  >
                    Update
                  </Link>
                </li>
                <li>
                  <Link
                    href="/delete"
                    className="text-gray-300 hover:text-white"
                  >
                    Delete
                  </Link>
                </li>

                {logged && (
                  <li
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-500 cursor-pointer"
                  >
                    Logout
                  </li>
                )}
              </ul>

              {/* Right Side (Email + Profile) */}
              {logged && (
                <div className="flex items-center space-x-4">
                  <div className="text-gray-300 hidden md:block">
                    {userEmail}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profileUpload"
                    onChange={handleImageUpload}
                  />

                  {/* Profile Circle Clickable */}
                  <label
                    htmlFor="profileUpload"
                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-gray-400 hover:border-white transition"
                  >
                    <Image
                      src={profilePicUrl || "/default-profile.jpg"}
                      width={40}
                      height={40}
                      alt="Profile"
                    />
                  </label>
                </div>
              )}

              {/* Mobile Menu Button */}
              {!menuOpen && (
                <button
                  className="md:hidden text-gray-200"
                  onClick={() => setMenuOpen(true)}
                >
                  Menu
                </button>
              )}

              {menuOpen && (
                <ul className="md:hidden absolute top-full right-0 bg-gray-700 text-white w-48 py-3 space-y-2">
                  <li>
                    <button
                      className="w-full text-left px-4"
                      onClick={() => setMenuOpen(false)}
                    >
                      X
                    </button>
                  </li>

                  <li>
                    <Link href="/create" className="block px-4">
                      Create
                    </Link>
                  </li>
                  <li>
                    <Link href="/read" className="block px-4">
                      Read
                    </Link>
                  </li>
                  <li>
                    <Link href="/update" className="block px-4">
                      Update
                    </Link>
                  </li>
                  <li>
                    <Link href="/delete" className="block px-4">
                      Delete
                    </Link>
                  </li>

                  {logged && (
                    <li
                      onClick={handleLogout}
                      className="px-4 cursor-pointer text-red-400"
                    >
                      Logout
                    </li>
                  )}
                </ul>
              )}
            </>
          )}
        </div>
      </nav>

      {/* PAGE SKELETON */}
      {pageLoading ? (
        <div className="max-w-md mx-auto mt-24 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-24">
          <h2 className="text-lg font-bold mb-4">Update User Data</h2>

          {errorMessage && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-3">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter email to update"
              className="w-full bg-gray-200 rounded py-2 px-3"
              required
            />

            <input
              type="number"
              name="age"
              value={userData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full bg-gray-200 rounded py-2 px-3"
            />

            {/* Department Select */}
            <select
              name="department"
              value={userData.department}
              onChange={handleChange}
              className="w-full bg-gray-200 rounded py-2 px-3"
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>

            {/* Sex Select */}
            <select
              name="sex"
              value={userData.sex}
              onChange={handleChange}
              className="w-full bg-gray-200 rounded py-2 px-3"
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            {/* Nationality Select */}
            <select
              name="nationality"
              value={userData.nationality}
              onChange={handleChange}
              className="w-full bg-gray-200 rounded py-2 px-3"
            >
              <option value="">Select Nationality</option>
              <option value="Nigerian">Nigerian</option>
              <option value="Ghanaian">Ghanaian</option>
              <option value="Kenyan">Kenyan</option>
            </select>

            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full bg-gray-200 rounded py-2 px-3"
            />

            <input
              type="text"
              name="mobile"
              value={userData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full bg-gray-200 rounded py-2 px-3"
            />

            <button
              type="submit"
              disabled={formLoading}
              className={`w-full py-2 px-4 rounded font-bold text-white ${
                formLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              {formLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Updating...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
