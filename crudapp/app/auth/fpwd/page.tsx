"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";

function Page() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);

      await axios.post("/api/forgot-password", {
        email,
      });

      setSuccessMessage(
        "If this email exists, a password reset link has been sent.",
      );

      setEmail("");
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        className="bg-cover bg-center min-h-screen w-screen flex justify-center items-center"
        style={{
          backgroundImage: "url(/images/landing-background.svg)",
        }}
      >
        <div className="bg-gray-500 rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-blue-500 mb-4 text-center">
            Forgot Password
          </h2>

          {/* Alerts */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-3">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-200 rounded py-2 px-3 focus:outline-none focus:bg-white"
                placeholder="Enter your email"
              />
            </div>

            {/* Navigation Links */}
            <div className="flex justify-between items-center mb-3">
              <Link href="/" className="text-sm text-gray-200 hover:text-white">
                ← Home
              </Link>

              <Link
                href="/auth/login"
                className="text-sm text-gray-200 hover:text-white"
              >
                Back to Login
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded text-white font-bold transition duration-200 ${
                isLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <span className="flex justify-center items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
