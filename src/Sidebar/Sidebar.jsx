import "./sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Key,
  Code,
  Database,
  FileText,
  FileCog,
  Settings,
  LogOut,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "John Doe";

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("theme");
    window.location.href = "/login";
  };

  const menuTabs = [
    {
      title: "Dashboard",
      icon: Home,
      link: "/home",
      paths: ["home"],
    },
    {
      title: "Credentials",
      icon: Key,
      link: "/credentials",
      paths: ["credentials"],
    },
    {
      title: "Commands",
      icon: Key,
      link: "/commands",
      paths: ["commands"],
    },
    {
      title: "Scripts",
      icon: Code,
      link: "/scripts",
      paths: ["scripts", "add-script", "edit-script"],
    },
    {
      title: "Queries",
      icon: Database,
      link: "/queries",
      paths: ["queries", "add-query", "edit-query"],
    },
    {
      title: "Config Files",
      icon: FileCog,
      link: "/config-files",
      paths: ["config-files", "add-config-file", "edit-config-file"],
    },
    {
      title: "Fondet e skanuara",
      icon: FileCog,
      link: "/fondet-skanuara",
      paths: ["fondet-skanuara"],
    },
    {
      title: "Notes",
      icon: FileText,
      link: "/notes",
      paths: ["notes", "add-note", "edit-note"],
    },
  ];

  const settingsTabs = [
    {
      title: "Configurations",
      icon: Settings,
      link: "/configurations",
      paths: ["configurations"],
    },
  ];

  const isActive = (paths) => {
    return paths.some((path) => location.pathname.includes(path));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-icon">
          <FontAwesomeIcon icon={faShieldHalved} />
        </div>

        <div className="logo-text">
          <span className="logo-text-title">Config Vaults</span>
          <span className="logo-text-subtitle">Secure dashboard</span>
        </div>
      </div>

      <div className="sidebar-subtitle">Menu</div>

      <nav className="sidebar-nav">
        {menuTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.title}
              to={tab.link}
              className={() =>
                `sidebar-link ${isActive(tab.paths) ? "active" : ""}`
              }
            >
              <Icon size={22} />
              <span>{tab.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-subtitle">Settings</div>

        <nav className="sidebar-nav sidebar-nav-footer">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.title}
                to={tab.link}
                className={() =>
                  `sidebar-link ${isActive(tab.paths) ? "active" : ""}`
                }
              >
                <Icon size={22} />
                <span>{tab.title}</span>
              </NavLink>
            );
          })}

          <button className="sidebar-link logout-btn" onClick={logout}>
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
