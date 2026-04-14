import { useEffect, useRef, useState } from "react";
import {
  Key,
  Ellipsis,
  User,
  Lock,
  Copy,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";
import "./credentials.css";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const CredentialItem = ({ credential, setEditingCredentialID, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // ✅ Proper outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPassword = async () => {
    if (password) return password;
    try {
      const res = await axios.get(
        `https://konfigurime-api.arkiva.gov.al/credentials/${credential.id}/password`,
      );
      setPassword(res.data.password);
      return res.data.password;
    } catch (error) {
      toast.error("Failed to fetch password", { theme, transition: Bounce });
      return "";
    }
  };

  const copyUsername = () => {
    navigator.clipboard.writeText(credential.username);
    toast.success("Username Copied!", { theme, transition: Bounce });
  };

  const copyPassword = async () => {
    const pw = await fetchPassword();
    if (!pw) return;
    navigator.clipboard.writeText(pw);
    toast.success("Password Copied!", { theme, transition: Bounce });
  };

  const copyAll = async () => {
    const pw = await fetchPassword();
    if (!pw) return;

    const text = `Title: ${credential.title}\nUsername: ${credential.username}\nPassword: ${pw}`;
    navigator.clipboard.writeText(text);

    toast.success("Credentials Copied!", { theme, transition: Bounce });
    setMenuOpen(false);
  };

  const handleTogglePassword = async () => {
    const pw = await fetchPassword();
    if (!pw) return;

    setShowPassword((prev) => !prev);

    if (!showPassword) {
      setTimeout(() => setShowPassword(false), 5000);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;

    try {
      setDeleting(true);

      const response = await axios.delete(
        `https://konfigurime-api.arkiva.gov.al/credentials/${credential.id}`,
      );

      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message, {
          theme,
          transition: Bounce,
        });
        onDelete();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete credential",
        { theme, transition: Bounce },
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="credential-card">
      <div className="card-header">
        <div className="card-header-title">
          <div className="card-icon">
            <Key size={22} />
          </div>

          <div className="text-content">
            <div className="card-title">{credential.title}</div>

            <a
              href={credential.url}
              className="card-url"
              target="_blank"
              rel="noreferrer"
              title={credential.url}
            >
              {credential.url}
            </a>
          </div>
        </div>

        {/* MENU */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            <Ellipsis size={18} />
          </button>

          {menuOpen && (
            <div className="credential-dropdown-menu">
              <div
                className="credential-dropdown-item"
                onClick={() => {
                  setMenuOpen(false);
                  setEditingCredentialID(credential.id);
                }}
              >
                <Pencil size={16} />
                Edit
              </div>

              <div
                className="credential-dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  copyAll();
                }}
              >
                <Copy size={16} />
                Copy All
              </div>

              {/* ✅ DELETE WITH CONTROLLED CLOSE */}
              <Popup
                trigger={
                  <div
                    className="credential-dropdown-item delete"
                    onClick={() => setMenuOpen(false)} // 🔥 key fix
                  >
                    {deleting ? (
                      <span style={{ fontSize: "13px" }}>Deleting...</span>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
                      </>
                    )}
                  </div>
                }
                modal
                nested
              >
                {(close) => (
                  <div className="confirm-popup">
                    <div className="confirm-popup-title">Confirm Delete</div>

                    <div className="confirm-popup-text">
                      Are you sure you want to delete this credential?
                    </div>

                    <div className="confirm-actions">
                      <button className="popup-cancel-btn" onClick={close}>
                        Cancel
                      </button>

                      <button
                        className="popup-delete-btn"
                        onClick={async () => {
                          await handleDelete();
                          close();
                        }}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          )}
        </div>
      </div>

      {/* USERNAME */}
      <div className="card-row">
        <User size={18} />
        <span className="cred-email">{credential.username}</span>
        <Copy size={18} className="action-icon" onClick={copyUsername} />
      </div>

      {/* PASSWORD */}
      <div className="card-row">
        <Lock size={18} />
        <span className="cred-pass">
          {showPassword ? password : "••••••••"}
        </span>

        <div className="row-actions">
          <button onClick={handleTogglePassword}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <Copy size={18} className="action-icon" onClick={copyPassword} />
        </div>
      </div>
    </div>
  );
};

export default CredentialItem;
