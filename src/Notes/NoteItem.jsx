import axios from "axios";
import {
  FileTerminal,
  Copy,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Code,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const NoteItem = ({ note, onDelete, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const module = "notes";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://konfigurime-api.arkiva.gov.al/category/module",
        {
          module,
        },
      );

      if (res.status === 200) {
        setCategories(
          res.data.data.map((c) => ({
            id: String(c.id ?? c._id),
            name: c.name,
          })),
        );
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
    (c) => c.id === String(note.category),
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
      const res = await axios.delete(
        `https://konfigurime-api.arkiva.gov.al/notes/delete/${note._id}`,
      );

      if (res.data.success) {
        toast.success(res.data.message || "Note deleted", {
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
      toast.error("Failed to delete note", {
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
            <div className="item-header-info-title">{note.title}</div>

            <div className="item-header-info-data">
              <div className="item-header-info-data-category">
                {categoryName || "Unknown"}
              </div>
            </div>
          </div>
        </div>

        <div className="item-header-actions">
          <button
            className="item-header-action copy"
            onClick={() => handleCopy(note.content)}
          >
            <Copy size={18} />
          </button>

          <button
            className="item-header-action edit"
            onClick={() => navigate(`/notes/edit-note/${note._id}`)}
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
                  Are you sure you want to delete this note?
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
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <div className="item-description">{note.description}</div>

      {showContent && (
        <pre className="item-code">
          <div className="item-code-header">
            <div className="item-code-header-title">
              <Code size={18} /> Content
            </div>

            <div
              className="item-code-header-action"
              onClick={() => handleCopy(note.content)}
            >
              <Copy size={18} /> Copy
            </div>
          </div>

          <div className="item-code-content">
            <code>{note.content}</code>
          </div>
        </pre>
      )}
    </div>
  );
};

export default NoteItem;
