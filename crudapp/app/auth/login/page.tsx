"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const encodestr = btoa(email + ":" + password);

      const response = await axios.post("/api/connect", {
        auth_header: `Basic ${encodestr}`,
      });

      Cookies.set("tok", response.data.token, {
        expires: 7,
        path: "/",
      });

      setSuccessMessage("Login Successful");

      // Small delay for UX
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      setErrorMessage("Login Unsuccessful");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen w-screen flex justify-center items-center"
      style={{ backgroundImage: "url(/images/landing-background.svg)" }}
    >
      <div className="bg-gray-500 rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-3xl font-bold text-blue-500 mb-4 text-center">
          Admin Login
        </h2>

        {/* Home Button */}
        <div className="flex justify-between mb-4">
          <Link href="/" className="text-sm text-blue-300 hover:text-white">
            ← Home
          </Link>

          <Link
            href="/auth/signup"
            className="text-sm text-blue-300 hover:text-white"
          >
            Signup
          </Link>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLSubmit}>
          <div className="mb-4">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 focus:outline-none focus:bg-white"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 focus:outline-none focus:bg-white"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-bold text-white transition duration-200 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
