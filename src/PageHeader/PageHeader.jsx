import { useLocation, useNavigate } from "react-router-dom";
import "./pageHeader.css";
import { useEffect, useState } from "react";
import lightMode from "../Assets/Images/lightMode.png";
import darkMode from "../Assets/Images/darkMode.png";
import { MoveLeft } from "lucide-react";

const PageHeader = () => {
  const location = useLocation();
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

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

  const isScriptRoute =
    location.pathname.startsWith("/scripts/add-script") ||
    location.pathname.startsWith("/scripts/edit-script");

  const isQueryRoute =
    location.pathname.startsWith("/queries/add-query") ||
    location.pathname.startsWith("/queries/edit-query");

  const isconfigFilesRoute =
    location.pathname.startsWith("/config-files/add-file") ||
    location.pathname.startsWith("/config-files/edit-file");

  const showReturnButton = isScriptRoute || isQueryRoute || isconfigFilesRoute;

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
      title: "Add Script",
      path: "/add-script",
    },
    {
      title: "Config Files",
      path: "/config-files",
    },
    {
      title: "Notes",
      path: "/notes",
    },
    {
      title: "Configurations",
      path: "/configurations",
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
        {showReturnButton && (
          <button
            className="return-btn"
            onClick={() =>
              navigate(
                isScriptRoute
                  ? "/scripts"
                  : isQueryRoute
                    ? "/queries"
                    : isconfigFilesRoute
                      ? "/config-files"
                      : "",
              )
            }
          >
            <MoveLeft size={20} />
            {isScriptRoute
              ? "Return to Scripts"
              : isQueryRoute
                ? "Return to Queries"
                : isconfigFilesRoute
                  ? "Return to Configuration files"
                  : ""}
          </button>
        )}
        <button onClick={toggleTheme} className="toggle-theme">
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
