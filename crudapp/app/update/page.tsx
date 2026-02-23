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
              </div>
            )
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
