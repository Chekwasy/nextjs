"use client";

import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [logged, setLogged] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Universal change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  // Logout
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

  // Delete Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDeleteLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.delete("/api/deleteworker", {
        headers: {
          tok: Cookies.get("tok"),
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
        },
      });

      setSuccessMessage("Worker Successfully Deleted");
      setUserData({ firstname: "", lastname: "", email: "" });
    } catch {
      setErrorMessage("Delete Unsuccessful");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="bg-gray-800 py-4 fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto px-4 flex justify-between">
          <Link href="/">
            <div className="text-lg font-bold text-white">CrudApp</div>
          </Link>

          {pageLoading ? (
            <div className="w-32 h-6 bg-gray-500 animate-pulse rounded"></div>
          ) : (
            logged && (
              <div className="flex items-center space-x-4">
                <div className="text-gray-300">{userEmail}</div>
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                  <Image
                    src="/images/landing-background.svg"
                    alt="Profile"
                    width={40}
                    height={40}
                  />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            )
          )}
        </div>
      </nav>

      {/* 🔥 PAGE SKELETON */}
      {pageLoading ? (
        <div className="max-w-md mx-auto mt-24 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-24">
          <h2 className="text-lg font-bold mb-4">Delete User</h2>

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
              type="text"
              name="firstname"
              placeholder="First Name"
              value={userData.firstname}
              onChange={handleChange}
              className="w-full bg-gray-200 rounded py-2 px-3"
              required
            />

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={userData.lastname}
              onChange={handleChange}
              className="w-full bg-gray-200 rounded py-2 px-3"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              className="w-full bg-gray-200 rounded py-2 px-3"
              required
            />

            <button
              type="submit"
              disabled={deleteLoading}
              className={`w-full py-2 px-4 rounded font-bold text-white ${
                deleteLoading
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-700"
              }`}
            >
              {deleteLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Deleting...
                </span>
              ) : (
                "Delete User"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
