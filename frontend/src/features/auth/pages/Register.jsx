import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {useAuth} from "../hook/useAuth" 
import { useSelector } from "react-redux";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { sending, verified } = useSelector((state) => state.auth);

  const { handleRegister, handleVerifyEmail } = useAuth();

  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      await handleRegister(username, email, password);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <section className="min-h-screen px-4 py-10 text-[var(--text)] bg-[var(--bg)] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
        <div
          className="w-full max-w-md rounded-2xl p-8 backdrop-blur
      bg-[var(--bg-side)] border border-[var(--border)] shadow-[var(--shadow)]"
        >
          <h1 className="text-3xl font-bold text-[var(--accent)]">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Register with your username, email, and password.
          </p>

          <form onSubmit={submitForm} className="mt-8 space-y-5">
            {/* Username */}
            <div>
              <label className="mb-2 block text-sm text-[var(--text)]">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition
              bg-[var(--bg)] border border-[var(--border)]
              text-[var(--text)]
              focus:border-[var(--accent-b)]
              focus:shadow-[0_0_0_3px_var(--accent-g)]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-[var(--text)]">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition
              bg-[var(--bg)] border border-[var(--border)]
              text-[var(--text)]
              focus:border-[var(--accent-b)]
              focus:shadow-[0_0_0_3px_var(--accent-g)]"
              />

              <button
                type="button"
                onClick={() => handleVerifyEmail(email)}
                disabled={sending || !email}
                className="mt-2 px-3 py-1.5 rounded-md text-sm font-medium
              bg-[var(--accent)] text-white
              disabled:opacity-40"
              >
                {sending ? "Sending..." : "Verify"}
              </button>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-[var(--text)]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition
              bg-[var(--bg)] border border-[var(--border)]
              text-[var(--text)]
              focus:border-[var(--accent-b)]
              focus:shadow-[0_0_0_3px_var(--accent-g)]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!verified}
              className="w-full py-3 rounded-lg font-semibold transition
            bg-[var(--accent)] text-white
            hover:brightness-110
            focus:outline-none
            focus:shadow-[0_0_0_3px_var(--accent-g)]
            disabled:opacity-40"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
