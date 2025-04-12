"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiService from "../services/api"; // adjust the relative path if needed

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setTimeout(() => router.push("/login"), 3000);
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
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        {error && (
          <p className="mb-4 text-center text-red-500 text-sm">{error}</p>
        )}
        {successMessage && (
          <p className="mb-4 text-center text-green-500 text-sm">
            {successMessage}
          </p>
        )}
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
      </div>
    </div>
  );
};

export default ResetPasswordPage;
