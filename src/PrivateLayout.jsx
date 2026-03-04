import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "./Hooks/useAuth";

const PrivateLayout = () => {
  const { user, logout, loading } = useAuth();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => logout(), 2 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [user, logout]);

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateLayout;
