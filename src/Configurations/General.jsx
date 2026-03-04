import { useEffect, useState } from "react";
import { SunMoon, LogOut, Palette } from "lucide-react";
import "./configurations.css";
const General = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("theme");
    window.location.href = "/login";
  };
  return (
    <div className="configurations-general">
      <div className="configurations-general-item">
        <div className="configurations-general-item-title">
          <Palette size={22} /> Appearance
        </div>
        <div className="configurations-general-item-content">
          <div className="configurations-general-item-content-header">
            <SunMoon size={24} />
            <div className="configurations-general-item-header-text">
              <div className="configurations-general-item-content-title">
                Theme
              </div>
              <div className="configurations-general-item-content-subtitle">
                Currently using {theme} mode
              </div>
            </div>
          </div>
          <div
            className="configurations-general-item-content-action"
            onClick={toggleTheme}
          >
            Switch to {theme === "light" ? "dark" : "light"}
          </div>
        </div>
      </div>

      <div className="configurations-general-item">
        <div className="configurations-general-item-title">
          <LogOut size={22} /> Session
        </div>
        <div className="configurations-general-item-content">
          <div className="configurations-general-item-content-header">
            <div className="configurations-general-item-header-text">
              <div
                className="configurations-general-item-content-title"
                onClick={handleLogOut}
              >
                Logout
              </div>
              <div className="configurations-general-item-content-subtitle">
                End your current session
              </div>
            </div>
          </div>
          <div
            className="configurations-general-item-content-action session"
            onClick={toggleTheme}
          >
            <LogOut size={22} /> Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
