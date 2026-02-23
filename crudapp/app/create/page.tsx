"use client";
import Link from "next/link";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [logged, setLogged] = useState(false);
  const [loggedMsg, setLoggedMsg] = useState(false);
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
  const checkLogged = async () => {
    try {
      const response = await axios.get("/api/getme", {
        headers: { tok: Cookies.get("tok") },
      });

      setUserEmail(response.data.email);
      setLogged(true);
    } catch (error) {
      console.log("Not logged in");
    } finally {
      setPageLoading(false); // stop skeleton
    }
  };
  async function delayedCode2() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoggedMsg(false);
  }
  const handleLogout = () => {
    axios
      .get("/api/disconnect", {
        headers: {
          tok: Cookies.get("tok"),
        },
      })
      .then(async (response) => {
        console.log(response.data);
        setUserEmail("");
        setLogged(false);
        setLoggedMsg(true);
        delayedCode2();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  useEffect(() => {
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
  async function delayedCode() {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    setErrorMessage("");
    setSuccessMessage("");
  }
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.post("/api/addworker", userData);
      setSuccessMessage("Worker Successfully Added");

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
    } catch (error) {
      setErrorMessage("Addition Unsuccessful");
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <div>
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
      {loggedMsg && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-gray-300 rounded-lg shadow-lg p-8 w-1/2 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Logged Out Successfully!
            </h1>
            <p className="text-gray-700 text-lg mb-4">
              You have been logged out of the system.
            </p>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto mt-24 px-4">
        {pageLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse space-y-6">
            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>

            <div className="h-12 bg-gray-300 rounded-lg w-full"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Create New User
            </h2>

            {errorMessage && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

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

              {/* Submit */}
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
        )}
      </div>
    </div>
  );
};

export default Page;
