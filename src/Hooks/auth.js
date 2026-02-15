import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const lastActive = localStorage.getItem("lastActive");
    const now = Date.now();

    if (!userId || (lastActive && now - lastActive > 120000)) {
      localStorage.removeItem("userId");
      localStorage.removeItem("lastActive");
      navigate("/login");
    } else {
      localStorage.setItem("lastActive", now);
    }
  }, [navigate]);
};
