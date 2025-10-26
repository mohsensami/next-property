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
    <div style={{ maxWidth: 420, margin: "50px auto" }}>
      <h2>Create an account</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          required
          style={{ display: "block", marginBottom: 10 }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          style={{ display: "block", marginBottom: 10 }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={{ display: "block", marginBottom: 10 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
