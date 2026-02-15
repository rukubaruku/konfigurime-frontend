import { useLocation } from "react-router-dom";
import "./pageHeader.css";
import { useEffect, useState } from "react";
import lightMode from "../Assets/Images/lightMode.png";
import darkMode from "../Assets/Images/darkMode.png";

const PageHeader = () => {
  const location = useLocation();
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

  const headerData = [
    {
      title: "Dashboard",
      path: "/home",
    },
    {
      title: "Credentials",
      path: "/credentials",
    },
    {
      title: "Queries",
      path: "/queries",
    },
    {
      title: "Scripts",
      path: "/scripts",
    },
    {
      title: "Config Files",
      path: "/config-files",
    },
    {
      title: "Notes",
      path: "/notes",
    },
  ];

  const currentHeader = headerData.find((item) =>
    location.pathname.startsWith(item.path),
  );

  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-header-left-title">
          {currentHeader?.title || "Page"}
        </div>
      </div>

      <div className="page-header-right">
        <button onClick={toggleTheme} className="theme-toggle">
          <img
            src={theme === "light" ? darkMode : lightMode}
            alt="Toggle theme"
            className="theme-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
