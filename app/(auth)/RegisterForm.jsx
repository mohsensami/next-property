"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.target);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");

    const res = await fetch("/api/auth/signin-with-oauth", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const text = await res.text();
      setError(text || "Something failed");
      return;
    }

    router.push("/login");
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <div className="mt-1">
            <input
              name="name"
              type="name"
              autoComplete="name"
              required
              className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            password
          </label>
          <div className="mt-1">
            <input
              name="password"
              type="password"
              autoComplete="password"
              required
              className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </button>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Do you have an account?{" "}
            <a href="/login" className="text-sky-600 hover:text-sky-500">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
