import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import "./configurations.css";
import { SunMoon, LogOut, Palette } from "lucide-react";

const Configurations = () => {
  const [tabActive, setTabActive] = useState("general");
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
  return (
    <div className="configurations">
      <PageHeader />

      <div className="configurations-container">
        <div className="configurations-header">
          <div className="configurations-title">Configurations</div>
          <div className="configurations-subtitle">
            Manage your account and preferences
          </div>
        </div>

        <div className="configurations-tabs">
          <div
            className={`configuration-tab ${
              tabActive === "general" ? "active" : ""
            }`}
            onClick={() => setTabActive("general")}
          >
            General
          </div>

          <div
            className={`configuration-tab ${
              tabActive === "categories" ? "active" : ""
            }`}
            onClick={() => setTabActive("categories")}
          >
            Categories
          </div>

          <div
            className={`configuration-tab ${
              tabActive === "security" ? "active" : ""
            }`}
            onClick={() => setTabActive("security")}
          >
            Security
          </div>
        </div>

        <div className="configurations-content">
          {tabActive === "general" && (
            <div className="configurations-general">
              <div className="configurations-general-item">
                <div className="configurations-general-item-title">
                  <Palette size={22} />
                  Apearance
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
                  <LogOut size={22} />
                  Session
                </div>
                <div className="configurations-general-item-content">
                  <div className="configurations-general-item-content-header">
                    <div className="configurations-general-item-header-text">
                      <div className="configurations-general-item-content-title">
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
          )}
          {tabActive === "categories" && <div>Categories Content</div>}
          {tabActive === "security" && <div>Security Content</div>}
        </div>
      </div>
    </div>
  );
};

export default Configurations;
