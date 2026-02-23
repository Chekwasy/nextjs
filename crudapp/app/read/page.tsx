"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";

const Page = () => {
  const [pg, setPg] = useState(1);
  const [items, setItems] = useState([
    {
      id: 1,
      firstname: "",
      lastname: "",
      age: "",
      department: "",
      address: "",
      mobile: "",
      sex: "",
      nationality: "",
      email: "",
      dateadded: "",
      lastupdate: "",
    },
  ]);
  const [logged, setLogged] = useState(false);
  const [loggedMsg, setLoggedMsg] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [workersLoading, setWorkersLoading] = useState(true);
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
  const checkLogged = () => {
    axios
      .get("/api/getme", {
        headers: {
          tok: Cookies.get("tok"),
        },
      })
      .then(async (response) => {
        setUserEmail(response.data.email);
        setLogged(true);
      })
      .catch((error) => {
        console.log(error.message);
      });
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
    const init = async () => {
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

    init();
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
  const handlePrevious = () => {
    if (pg !== 1) {
      setPg(pg - 1);
    }
  };
  const handleNext = () => {
    setPg(pg + 1);
  };
  useEffect(() => {
    const fetchWorkers = async () => {
      setWorkersLoading(true);

      try {
        const response = await axios.get("/api/viewworkers", {
          headers: {
            tok: Cookies.get("tok"),
            pg: pg.toString(),
          },
        });

        const dd = response.data.workers;

        if (dd.length !== 0) {
          setItems(dd);
        } else if (pg > 1) {
          setPg((prev) => prev - 1);
        }
      } catch (error) {
        console.log("Failed fetching workers");
      } finally {
        setWorkersLoading(false);
      }
    };

    fetchWorkers();
  }, [pg]);
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div className="max-w-6xl mx-auto mt-24 px-4">
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
                className="bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-xl"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {item.firstname} {item.lastname}
                  </h2>
                  <span className="text-sm text-gray-500">
                    User Information
                  </span>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "First Name", value: item.firstname },
                    { label: "Last Name", value: item.lastname },
                    { label: "Age", value: item.age },
                    { label: "Department", value: item.department },
                    { label: "Address", value: item.address },
                    { label: "Mobile", value: item.mobile },
                    { label: "Sex", value: item.sex },
                    { label: "Nationality", value: item.nationality },
                    { label: "Email", value: item.email },
                    { label: "Date Added", value: item.dateadded },
                    { label: "Last Update", value: item.lastupdate },
                  ].map((field, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                    >
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {field.label}
                      </div>
                      <div className="text-gray-800 font-medium mt-1">
                        {field.value || "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            disabled={workersLoading || pg === 1}
            onClick={handlePrevious}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              workersLoading || pg === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            Previous
          </button>

          <div className="text-gray-600 font-medium">Page {pg}</div>

          <button
            disabled={workersLoading}
            onClick={handleNext}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              workersLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            {workersLoading ? "Loading..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
