import axiosInstance from "../Utils/axiosInstance";
import {
  FileTerminal,
  Copy,
  Pencil,
  Trash2,
  Code,
  Ellipsis,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const CommandItem = ({ command, onDelete, theme, setEditingCommandID }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const module = "commands";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

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
      const response = await axiosInstance.post("/category/module", { module });
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
    (c) => c.id === String(command.category),
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
      const response = await axiosInstance.delete(
        `/commands/delete/${command._id}`,
      );
      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message || "Command deleted successfully", {
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
      toast.error(err.response?.data?.message || "Failed to delete command", {
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
    <div className="command-item">
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
            <div className="item-header-info-title">{command.title}</div>
            <div className="item-header-info-data">
              <div className="item-header-info-data-category">
                {categoryName || "Unknown"}
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
                    onClick={() => handleCopy(command.code)}
                  >
                    <Copy size={16} />
                    Copy
                  </div>

                  <div
                    className="command-dropdown-item"
                    onClick={() => setEditingCommandID(command._id)}
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
                          Are you sure you want to delete this command?
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
            </>
          ) : (
            <>
              <button
                className="item-header-action copy"
                onClick={() => handleCopy(command.code)}
              >
                <Copy size={18} />
              </button>

              <button
                className="item-header-action edit"
                onClick={() => setEditingCommandID(command._id)}
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
                      Are you sure you want to delete this command?
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
            </>
          )}
        </div>
      </div>

      <div className="item-description">{command.description}</div>

      <pre className="item-code">
        <div className="item-code-header">
          <div className="item-code-header-title">
            <Code size={18} />
          </div>
          <div
            className="item-code-header-action"
            onClick={() => handleCopy(command.code)}
          >
            <Copy size={18} /> Copy
          </div>
        </div>
        <div className="item-code-content">
          <code>{command.code}</code>
        </div>
      </pre>
    </div>
  );
};

export default CommandItem;
