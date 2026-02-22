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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
const Dashboard = () => {
  const [theme, setTheme] = useState("light");
  const [recentCredentials, setRecentCredentials] = useState([]);
  const [credentialsNr, setCredentialsNr] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      alert("Log in to see dashboard");
      navigate("/login");
    }
  }, [userId]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3109/credentials/dashboard",
      );

      setCredentialsNr(response.data.data.count);
      setRecentCredentials(response.data.data.recent);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
            <div className="widget-value">{credentialsNr}</div>
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
          <div className="recent-activity">
            <div className="recent-activity-header">
              <div className="recent-activity-header-left">
                <div className="recent-activity-header-left-icon">
                  <Key size={22} />
                </div>
                <div className="recent-activity-header-left-title">
                  <div className="recent-activity-header-left-title-text">
                    Recent credentials
                  </div>
                  <div className="recent-activity-header-left-subtitle-text">
                    Latest added credentials
                  </div>
                </div>
              </div>
              <div className="recent-activity-header-right"></div>
              <NavLink
                to="/credentials"
                className="recent-activity-header-right-link"
              >
                View all <ArrowRight size={18} />
              </NavLink>
            </div>
            {credentialsNr === 0 ? (
              <div className="recent-empty">
                <Key size={64} />
                <div className="recent-empty-title">
                  {" "}
                  No credentials added yet
                </div>
              </div>
            ) : (
              <div className="recent-activity-list">
                {recentCredentials.map((cred) => (
                  <NavLink
                    to={`/credentials/${cred.id}`}
                    className="credential-item"
                  >
                    <div className="credential-item-data">
                      <div className="credential-item-icon">
                        <Key size={22} />
                      </div>
                      <div className="cretential-item-title">
                        <div className="cretential-item-email">
                          {cred.email}
                        </div>
                        <div className="credential-item-title-text">
                          {cred.title}
                        </div>
                      </div>
                    </div>
                    <div className="credential-item-time">{cred.time}</div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="security-notice">
          <div className="security-notice-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div className="security-notice-content">
            <div className="security-notice-content-title">Security Notice</div>
            <div className="security-notice-content-subtitle">
              All credentials are encrypted with AES-256 encryption.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
