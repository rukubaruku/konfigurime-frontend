import { NavLink } from "react-router-dom";
import { Home, Key, Code, Database, FileCog, Terminal } from "lucide-react";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-container">
        <NavItem to="/home" icon={<Home size={22} />} label="Home" />
        <NavItem
          to="/credentials"
          icon={<Key size={22} />}
          label="Credentials"
        />
        <NavItem
          to="/commands"
          icon={<Terminal size={22} />}
          label="Commands"
        />
        <NavItem to="/scripts" icon={<Code size={22} />} label="Scripts" />
        <NavItem to="/queries" icon={<Database size={22} />} label="Queries" />
        <NavItem
          to="/config-files"
          icon={<FileCog size={22} />}
          label="Config Files"
        />
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

export default Navbar;
