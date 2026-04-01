import { Link, useNavigate } from "react-router";
import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      await handleLogin(email, password); 
      navigate("/");
    } catch (error) {
      // Error already Redux mein dispatch ho gaya
      console.error("Login failed:", error);
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
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Sign in with your email and password.
          </p>

          <form onSubmit={submitForm} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-[var(--text)]">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg outline-none transition
              bg-[var(--bg)] border border-[var(--border)]
              text-[var(--text)]
              focus:border-[var(--accent-b)]
              focus:shadow-[0_0_0_3px_var(--accent-g)]"
              />
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
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg outline-none transition
              bg-[var(--bg)] border border-[var(--border)]
              text-[var(--text)]
              focus:border-[var(--accent-b)]
              focus:shadow-[0_0_0_3px_var(--accent-g)]"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold transition
            bg-[var(--accent)] text-white
            hover:brightness-110
            focus:outline-none
            focus:shadow-[0_0_0_3px_var(--accent-g)]"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
