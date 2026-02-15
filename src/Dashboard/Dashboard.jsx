import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import "./dashboard.css";
import {
  Key,
  Code,
  Database,
  FileText,
  FileCog,
  Waypoints,
  ArrowRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
const Dashboard = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);
  return (
    <div className="dashboard-page">
      <PageHeader />
      <div className="dashboard-page-content">
        <div className="dashboard-widgets">
          <div className="dashboard-widget">
            <div className="widget-icon">
              <Key size={22} color="hsl(158, 64%, 52%)" />
            </div>
            <div className="widget-value">0</div>
            <div className="widget-title">Credentials</div>
          </div>
          <div className="dashboard-widget">
            <div className="widget-icon">
              <Code size={24} color="hsl(213, 94%, 68%)" />
            </div>
            <div className="widget-value">0</div>
            <div className="widget-title">Scripts</div>
          </div>
          <div className="dashboard-widget">
            <div className="widget-icon">
              <Database size={24} color="hsl(270, 95%, 75%)" />
            </div>
            <div className="widget-value">0</div>
            <div className="widget-title">Queries</div>
          </div>
          <div className="dashboard-widget">
            <div className="widget-icon">
              <FileCog size={24} color="hsl(351, 55%, 60%)" />
            </div>
            <div className="widget-value">0</div>
            <div className="widget-title">Config Files</div>
          </div>
          <div className="dashboard-widget">
            <div className="widget-icon">
              <FileText size={24} color="hsl(43, 96%, 56%)" />
            </div>
            <div className="widget-value">0</div>
            <div className="widget-title">Notes</div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="quick-actions">
            <div className="quick-actions-header">
              <Waypoints size={22} /> Quick Actions
            </div>
            <div className="quick-actions-buttons">
              <NavLink to="/credentials/new" className="quick-actions-button">
                <Key size={24} />
                <div className="quick-actions-button-title">
                  Add new Credential
                </div>
                <ArrowRight size={20} className="quick-actions-arrow" />
              </NavLink>

              <NavLink to="/scripts/new" className="quick-actions-button">
                <Code size={24} />
                <div className="quick-actions-button-title">Add new Script</div>
                <ArrowRight size={20} className="quick-actions-arrow" />
              </NavLink>

              <NavLink to="/queries/new" className="quick-actions-button">
                <Database size={24} />
                <div className="quick-actions-button-title">Add new Query</div>
                <ArrowRight size={20} className="quick-actions-arrow" />
              </NavLink>

              <NavLink to="/config-files/new" className="quick-actions-button">
                <FileCog size={24} />
                <div className="quick-actions-button-title">
                  Add new Config File
                </div>
                <ArrowRight size={20} className="quick-actions-arrow" />
              </NavLink>

              <NavLink to="/notes/new" className="quick-actions-button">
                <FileText size={24} />
                <div className="quick-actions-button-title">Add new Note</div>
                <ArrowRight size={20} className="quick-actions-arrow" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
