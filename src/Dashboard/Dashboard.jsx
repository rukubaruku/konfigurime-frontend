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
  Terminal,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
const Dashboard = () => {
  const [theme, setTheme] = useState("light");
  const [recentCredentials, setRecentCredentials] = useState([]);
  const [credentialsNr, setCredentialsNr] = useState(0);
  const [scriptsNr, setScriptsNr] = useState(0);
  const [queriesNr, setQueriesNr] = useState(0);
  const [commandsNr, setCommandsNr] = useState(0);
  const [configFilesNr, setConfigFilesNr] = useState(0);
  const [notesNr, setNotesNr] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Log in to see dashboard");
      navigate("/login");
    }
  }, [token]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        credentialsRes,
        scriptsRes,
        queriesRes,
        commandsRes,
        configFilesRes,
        notesRes,
      ] = await Promise.all([
        axios.get(
          "https://konfigurime-api.arkiva.gov.al:3109/credentials/dashboard",
        ),
        axios.get(
          "https://konfigurime-api.arkiva.gov.al:3109/commands/dashboard",
        ),
        axios.get(
          "https://konfigurime-api.arkiva.gov.al:3109/scripts/dashboard",
        ),
        axios.get(
          "https://konfigurime-api.arkiva.gov.al:3109/queries/dashboard",
        ),
        axios.get(
          "https://konfigurime-api.arkiva.gov.al:3109/config-files/dashboard",
        ),
        axios.get("https://konfigurime-api.arkiva.gov.al:3109/notes/dashboard"),
      ]);

      setCredentialsNr(credentialsRes.data.data.count);
      setRecentCredentials(credentialsRes.data.data.recent);
      setCommandsNr(commandsRes.data.data.count);
      setQueriesNr(queriesRes.data.data.count);
      setScriptsNr(scriptsRes.data.data.count);
      setConfigFilesNr(configFilesRes.data.data.count);
      setNotesNr(notesRes.data.data.count);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <PageHeader />
      <div className="dashboard-page-content">
        <div className="dashboard-welcome-section">
          <div className="dashboard-welcome-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div className="dashboard-welcome-content">
            <div className="dashboard-welcome-title">Welcome back</div>
            <div className="dashboard-welcome-subtitle">
              Here's your configuration overview
            </div>
          </div>
        </div>
        <div className="dashboard-widgets">
          <NavLink to="/credentials" className="dashboard-widget">
            <div className="widget-icon">
              <Key size={22} color="hsl(158, 64%, 52%)" />
            </div>
            <div className="widget-value">{credentialsNr}</div>
            <div className="widget-title">Credentials</div>
          </NavLink>
          <NavLink to="/commands" className="dashboard-widget">
            <div className="widget-icon">
              <Terminal size={22} color="#e63946" />
            </div>
            <div className="widget-value">{commandsNr}</div>
            <div className="widget-title">Commands</div>
          </NavLink>
          <NavLink to="/scripts" className="dashboard-widget">
            <div className="widget-icon">
              <Code size={24} color="hsl(213, 94%, 68%)" />
            </div>
            <div className="widget-value">{scriptsNr}</div>
            <div className="widget-title">Scripts</div>
          </NavLink>
          <NavLink to="/queries" className="dashboard-widget">
            <div className="widget-icon">
              <Database size={24} color="hsl(270, 95%, 75%)" />
            </div>
            <div className="widget-value">{queriesNr}</div>
            <div className="widget-title">Queries</div>
          </NavLink>
          <NavLink to="/config-files" className="dashboard-widget">
            <div className="widget-icon">
              <FileCog size={24} color="hsl(351, 55%, 60%)" />
            </div>
            <div className="widget-value">{configFilesNr}</div>
            <div className="widget-title">Config Files</div>
          </NavLink>
          <NavLink to="/notes" className="dashboard-widget">
            <div className="widget-icon">
              <FileCog size={24} color="#4c956c" />
            </div>
            <div className="widget-value">{notesNr}</div>
            <div className="widget-title">Notes</div>
          </NavLink>
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
                {recentCredentials.map((cred, index) => (
                  <NavLink
                    to={`/credentials/${cred.id}`}
                    className="credential-dashboard-item"
                    key={index}
                  >
                    <div className="credential-dashboard-item-data">
                      <div className="credential-dashboard-item-icon">
                        <Key size={22} />
                      </div>
                      <div className="cretential-dashboard-item-title">
                        <div className="cretential-dashboard-item-email">
                          {cred.email}
                        </div>
                        <div className="credential-dashboard-item-title-text">
                          {cred.title}
                        </div>
                      </div>
                    </div>
                    <div className="credential-dashboard-item-time">
                      {cred.time}
                    </div>
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
