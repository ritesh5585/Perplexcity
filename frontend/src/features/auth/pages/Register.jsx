import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import { setVerified } from "../auth.slice";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { checkEmailVerified } from "../services/auth.api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [checking, setChecking] = useState(false);

  const { sending, verified, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { handleRegister, handleVerifyEmail, handleCheckVerification } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (email && !verified) {
      checkEmailVerified(email)
        .then((data) => {
          if (data.verified) dispatch(setVerified(true));
        })
        .catch(() => { });
    }
  }, [email]);


  const onVerifyClick = async () => {
    await handleVerifyEmail(email);
    setEmailSent(true);
  };

  const onManualCheckClick = async () => {
    setChecking(true);
    await handleCheckVerification(email);
    setChecking(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(username, email, password);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
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
                                bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]
                                focus:border-[var(--accent-b)] focus:shadow-[0_0_0_3px_var(--accent-g)]"
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailSent(false);
                }}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition
                                bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]
                                focus:border-[var(--accent-b)] focus:shadow-[0_0_0_3px_var(--accent-g)]"
              />

              {/* Verify Button + Status */}
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onVerifyClick}
                    disabled={sending || !email || verified}
                    className="px-3 py-1.5 rounded-md text-sm font-medium
                                      bg-[var(--accent)] text-white disabled:opacity-40"
                  >
                    {sending ? "Sending..." : verified ? "Verified ✅" : "Verify"}
                  </button>

                  {/* Manual Fallback Button */}
                  {emailSent && !verified && (
                    <button
                      type="button"
                      onClick={onManualCheckClick}
                      disabled={checking}
                      className="px-3 py-1.5 rounded-md text-sm font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
                    >
                      {checking ? "Checking..." : "I've Verified"}
                    </button>
                  )}
                </div>

                {/* Status Messages */}
                <div className="flex items-center gap-3">
                  {emailSent && !verified && (
                    <span className="text-xs text-yellow-400 animate-pulse">
                      📧 Email bheja! Link click karo...
                    </span>
                  )}
                  {verified && (
                    <span className="text-xs text-green-400">
                      ✅ Email verified! Ab register karo.
                    </span>
                  )}
                </div>
              </div>
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
                                bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]
                                focus:border-[var(--accent-b)] focus:shadow-[0_0_0_3px_var(--accent-g)]"
              />
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* Register Button */}
            <button
              type="submit"
              disabled={!verified}
              className="w-full py-3 rounded-lg font-semibold transition
                            bg-[var(--accent)] text-white hover:brightness-110
                            focus:outline-none focus:shadow-[0_0_0_3px_var(--accent-g)]
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
