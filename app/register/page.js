"use client";

import { useState } from "react";
import { ApiClient } from "../../apiClient/apiClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserRegisterPage() {
  // Updated form state to include confirmPassword
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if all fields are filled
    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Please enter all fields.");
      return;
    }
    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const apiClient = new ApiClient();
      const response = await apiClient.register(form.email, form.password);

      if (response && response.accessToken) {
        router.push("/plants");
      } else {
        setError("Register successful but no token received");
      }
    } catch (err) {
      console.error("Register error:", err.response || err);
      setError(
        err.response?.data?.message || "Invalid credentials or server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-100 relative overflow-hidden">
        <img
    src="/tree3.png"
    alt="Bonsai tree artwork"
    className="w-full bottom-0 lg:bottom-[-50] md:max-w-2/4 lg:max-w-2/6 mx-auto h-auto object-contain z-1 absolute opacity-10 "
  />
      {/* Zen circle element */}
      <div className="absolute top-8 right-8 opacity-15 ">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-amber-600"
          />
        </svg>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        {/* Simple title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extralight text-amber-600 mb-2 tracking-widest">
            植物
          </h1>
          <p className="text-sm text-amber-600/70 font-light tracking-wide">
            Shokubutsu
          </p>
        </div>

        {/* Clean register form */}
        <form
          onSubmit={handleSubmit}
          className="bg-lime-100/40 p-12 w-full h-110  max-w-sm border border-amber-600/20"
        >
          <h2 className="text-xl font-extralight mb-10 text-amber-600 text-center tracking-wider">
            登録
          </h2>

          <div className="mb-1">
            <label
              htmlFor="email"
              className="block text-xs font-normal text-amber-600/80 mb-3 tracking-wide uppercase"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-0 py-3 border-0 border-b border-amber-600/30 bg-transparent text-amber-600 focus:outline-none focus:border-amber-600 duration-300 placeholder-amber-600/50"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-1">
            <label
              htmlFor="password"
              className="block text-xs font-normal text-amber-600/80 mb-3 tracking-wide uppercase"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-0 py-3 border-0 border-b border-amber-600/30 bg-transparent text-amber-600 focus:outline-none focus:border-amber-600 transition-colors duration-300 placeholder-amber-600/50"
              placeholder="••••••••"
              autoComplete="new-password" // Updated to new-password for registration
              required
            />
          </div>

          {/* New Confirm Password field */}
          <div className="mb-1">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-normal text-amber-600/80 mb-3 tracking-wide uppercase"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-0 py-3 border-0 border-b border-amber-600/30 bg-transparent text-amber-600 focus:outline-none focus:border-amber-600 transition-colors duration-300 placeholder-amber-600/50"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <div className="mb-8">
              <p className="text-red-600 text-xs text-center font-light">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-amber-100 py-3 px-6 font-light transition-colors duration-200 focus:outline-none focus:bg-amber-700 hover:bg-amber-700 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Registration link */}
        <div className="mt-10 text-center z-10">
          <p className="text-amber-600/70 mb-4 font-light text-sm">
            Already have an account?
          </p>
          <Link href="/">
            <button className="text-amber-600 py-2 px-6 font-light hover:text-amber-700 transition-colors duration-200 border-b border-amber-600/30 hover:border-amber-600">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}