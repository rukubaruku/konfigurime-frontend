import axios from "axios";
import {
  FileTerminal,
  Copy,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Code,
  Ellipsis,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const ScriptItem = ({ script, onDelete, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const navigate = useNavigate();
  const module = "scripts";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClick = () => setMenuOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://konfigurime-api.arkiva.gov.al/category/module",
        { module },
      );
      if (response.status === 200) {
        const formattedCategories = response.data.data.map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name,
        }));
        setCategories(formattedCategories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoryName = categories.find(
    (c) => c.id === String(script.category),
  )?.name;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme,
        transition: Bounce,
      });
    } catch {
      toast.error("Failed to copy!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme,
        transition: Bounce,
      });
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      const response = await axios.delete(
        `https://konfigurime-api.arkiva.gov.al/scripts/${script._id}`,
      );
      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message || "Script deleted successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme,
          transition: Bounce,
        });
        onDelete?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete script", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme,
        transition: Bounce,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="script-item">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="item-header">
        <div className="item-header-content">
          <div className="item-header-icon">
            <FileTerminal size={24} />
          </div>
          <div className="item-header-info">
            <div className="item-header-info-title">{script.title}</div>
            <div className="item-header-info-data">
              <div className="item-header-info-data-category">
                {categoryName || "Unknown"}
              </div>
              <div className="item-header-info-data-language">
                {script.language}
              </div>
            </div>
          </div>
        </div>

        <div className="item-header-actions">
          {isMobile ? (
            <>
              <button
                className="menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <Ellipsis size={18} />
              </button>

              {menuOpen && (
                <div className="command-dropdown-menu">
                  <div
                    className="command-dropdown-item"
                    onClick={() => handleCopy(script.code)}
                  >
                    <Copy size={16} />
                    Copy
                  </div>

                  <div
                    className="command-dropdown-item"
                    onClick={() =>
                      navigate(`/scripts/edit-script/${script._id}`)
                    }
                  >
                    <Pencil size={16} />
                    Edit
                  </div>

                  <Popup
                    trigger={
                      <div className="command-dropdown-item delete">
                        <Trash2 size={16} />
                        Delete
                      </div>
                    }
                    modal
                    nested
                  >
                    {(close) => (
                      <div className="confirm-popup">
                        <div className="confirm-popup-title">
                          Confirm Delete
                        </div>
                        <div className="confirm-popup-text">
                          Are you sure you want to delete this script?
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
                            {deleting ? "Deleting..." : "Yes"}
                          </button>
                        </div>
                      </div>
                    )}
                  </Popup>
                </div>
              )}

              <button
                className="item-header-action show-code"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </>
          ) : (
            <>
              <button
                className="item-header-action copy"
                onClick={() => handleCopy(script.code)}
              >
                <Copy size={18} />
              </button>

              <button
                className="item-header-action edit"
                onClick={() => navigate(`/scripts/edit-script/${script._id}`)}
              >
                <Pencil size={18} />
              </button>

              <Popup
                trigger={
                  <button className="item-header-action delete">
                    <Trash2 size={18} />
                  </button>
                }
                modal
                nested
              >
                {(close) => (
                  <div className="confirm-popup">
                    <div className="confirm-popup-title">Confirm Delete</div>
                    <div className="confirm-popup-text">
                      Are you sure you want to delete this script?
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
                        {deleting ? "Deleting..." : "Yes"}
                      </button>
                    </div>
                  </div>
                )}
              </Popup>

              <button
                className="item-header-action show-code"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="item-description">{script.description}</div>

      {showCode && (
        <pre className="item-code">
          <div className="item-code-header">
            <div className="item-code-header-title">
              <Code size={18} /> {script.language}
            </div>
            <div
              className="item-code-header-action"
              onClick={() => handleCopy(script.code)}
            >
              <Copy size={18} /> Copy
            </div>
          </div>
          <div className="item-code-content">
            <code>{script.code}</code>
          </div>
        </pre>
      )}
    </div>
  );
};

export default ScriptItem;
