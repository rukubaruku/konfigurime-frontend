import "./sidebar.css";
import { NavLink } from "react-router-dom";
import {
  Home,
  Key,
  Code,
  Database,
  FileText,
  FileCog,
  User,
  LogOut,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const userName = localStorage.getItem("userName") || "John Doe";

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.location.href = "/login";
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
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Home size={22} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/credentials"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Key size={22} />
          <span>Credentials</span>
        </NavLink>

        <NavLink
          to="/scripts"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Code size={22} />
          <span>Scripts</span>
        </NavLink>

        <NavLink
          to="/queries"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Database size={22} />
          <span>Queries</span>
        </NavLink>

        <NavLink
          to="/config-files"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FileCog size={22} />
          <span>Config Files</span>
        </NavLink>

        <NavLink
          to="/notes"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FileText size={22} />
          <span>Notes</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-subtitle">Settings</div>

        <nav className="sidebar-nav sidebar-nav-footer">
          <div className="sidebar-link user-link">
            <User size={22} />
            <span>{userName}</span>
          </div>

          <button className="sidebar-link logout-btn" onClick={logout}>
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
