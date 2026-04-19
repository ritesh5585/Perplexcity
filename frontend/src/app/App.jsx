import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.router.jsx";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";

const App = () => {
  const { handleGetMe } = useAuth();
  const loading = useSelector((state) => state.auth.loading);


  useEffect(() => {
    handleGetMe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
