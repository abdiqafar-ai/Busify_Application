"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+ app directory
import { useSearchParams } from "next/navigation"; // To handle query parameters
import Link from "next/link";
import apiService from "../services/api"; // Ensure this file exists and implements login, forgot-password, and reset-password

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token"); // Extract the reset token from the URL (if present)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); // For resetting the password
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handler for the standard login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const response = await apiService.post("/login", { email, password });

      if (response && response.access_token) {
        localStorage.setItem("user_token", response.access_token);
        const userRole = response.user?.role?.toLowerCase();

        // Role-based redirect
        switch (userRole) {
          case "admin":
            router.push("/dashboard/admin");
            break;
          case "company_owner":
            router.push("/dashboard/company-owner");
            break;
          case "driver":
            router.push("/dashboard/driver");
            break;
          case "passenger":
          default:
            router.push("/dashboard/passenger");
            break;
        }
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.msg || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };


  // Handler for the forgot password form submission
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const response = await apiService.post("/forgot-password", { email });
      if (response && response.msg) {
        setSuccessMessage(
          "Password reset instructions have been sent to your email."
        );
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.msg || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the reset password form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const response = await apiService.post("/reset-password", {
        reset_token: resetToken,
        new_password: newPassword,
      });
      if (response && response.msg) {
        setSuccessMessage(
          "Password reset successfully! Redirecting to login..."
        );
        setTimeout(() => router.push("/login"), 3000); // Redirect to login after 3 seconds
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.msg || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {resetToken ? "Reset Password" : "Login"}
        </h1>
        {error && (
          <p className="mb-4 text-center text-red-500 text-sm">{error}</p>
        )}
        {successMessage && (
          <p className="mb-4 text-center text-green-500 text-sm">
            {successMessage}
          </p>
        )}

        {resetToken ? (
          // Reset Password Form
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <Link
                  href="/signup"
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                  Sign Up
                </Link>
              </div>
            </form>
            {/* Forgot Password Form */}
            <div className="mt-6">
              <form onSubmit={handleForgotPassword}>
                <h2 className="mb-2 text-center text-gray-600">
                  Forgot Password?
                </h2>
                <p className="mb-4 text-center text-sm text-gray-500">
                  Enter your email to receive password reset instructions.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-l focus:outline-none focus:shadow-outline"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                  >
                    {isLoading ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
