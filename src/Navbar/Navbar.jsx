import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Menu, Settings, User, BookCheck } from "lucide-react";
import "./navbar.css";
import axiosInstance from "../Utils/axiosInstance";

const menuRoutes = [
  "/credentials",
  "/commands",
  "/scripts",
  "/queries",
  "/config-files",
  "/notes",
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const userRef = useRef(null);

  const userName = localStorage.getItem("userName") || "User";

  const isMenusActive = open || menuRoutes.includes(location.pathname);
  const isUserActive = userOpen || location.pathname === "/profile";
  const handleMenuToggle = () => {
    setOpen((prev) => !prev);
    setUserOpen(false);
  };

  const handleUserToggle = () => {
    setUserOpen((prev) => !prev);
    setOpen(false);
  };

  const handleCloseAll = () => {
    setOpen(false);
    setUserOpen(false);
  };

  const handleLogout = useCallback(async () => {
    try {
      await axiosInstance.post("/user/logout");
    } catch (err) {}

    localStorage.removeItem("token");

    window.location.href = "/login";
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        userRef.current &&
        !userRef.current.contains(e.target)
      ) {
        handleCloseAll();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuLabels = {
    "/credentials": "Credentials",
    "/commands": "Commands",
    "/scripts": "Scripts",
    "/queries": "Queries",
    "/config-files": "Config Files",
    "/notes": "Notes",
  };

  const activeMenuLabel = menuLabels[location.pathname] || "Menus";

  return (
    <nav className="navbar">
      <ul className="nav-container">
        <NavItem to="/home" icon={<Home size={22} />} label="Home" />
        <li
          ref={menuRef}
          className={`nav-item ${isMenusActive ? "active" : ""}`}
        >
          <div className="nav-link" onClick={handleMenuToggle}>
            <div className="nav-icon">
              <Menu size={22} />
            </div>
            <span className="nav-label">
              {isMenusActive ? activeMenuLabel : "Menus"}
            </span>
          </div>

          <div className={`dropdown ${open ? "show" : ""}`}>
            <NavDropdownItem to="/credentials" onClick={handleCloseAll}>
              Credentials
            </NavDropdownItem>
            <NavDropdownItem to="/commands" onClick={handleCloseAll}>
              Commands
            </NavDropdownItem>
            <NavDropdownItem to="/scripts" onClick={handleCloseAll}>
              Scripts
            </NavDropdownItem>
            <NavDropdownItem to="/queries" onClick={handleCloseAll}>
              Queries
            </NavDropdownItem>
            <NavDropdownItem to="/config-files" onClick={handleCloseAll}>
              Config Files
            </NavDropdownItem>

            <NavDropdownItem to="/notes" onClick={handleCloseAll}>
              Notes
            </NavDropdownItem>
          </div>
        </li>
        <NavItem
          to="/fondet-skanuara"
          icon={<BookCheck size={22} />}
          label="Fondet"
        />

        <NavItem
          to="/configurations"
          icon={<Settings size={22} />}
          label="Configs"
        />
        <li
          ref={userRef}
          className={`nav-item ${isUserActive ? "active" : ""}`}
        >
          <div className="nav-link" onClick={handleUserToggle}>
            <div className="nav-icon">
              <User size={22} />
            </div>
            <span className="nav-label">
              {isUserActive ? userName : "User"}
            </span>
          </div>

          <div className={`dropdown ${userOpen ? "show" : ""}`}>
            <NavDropdownItem to="/profile" onClick={handleCloseAll}>
              Profile
            </NavDropdownItem>

            <button className="dropdown-item logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
    >
      <div className="nav-link">
        <div className="nav-icon">{icon}</div>
        <span className="nav-label">{label}</span>
      </div>
    </NavLink>
  );
};

const NavDropdownItem = ({ to, children, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `dropdown-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
};

export default Navbar;
