import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import "./scripts.css";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

const AddScript = ({ isOpen, onClose, onSuccess, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [scriptForm, setScriptForm] = useState({
    category: "",
    language: "",
    title: "",
    description: "",
    code: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3109/category/module",
        { module: "scripts" },
      );

      if (response.status === 200) {
        const formattedCategories = response.data.data.map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name,
        }));
        setCategories(formattedCategories);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch categories", {
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

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setScriptForm({
        category: "",
        language: "",
        title: "",
        description: "",
        code: "",
      });
    }
  }, [isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setScriptForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaste = () => {
    setIsExpanded(true);
  };

  const handleAddScript = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3109/scripts/new/script",
        scriptForm,
      );

      if (response.status === 201 && response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme,
          transition: Bounce,
        });

        onClose();
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add script", {
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
      setLoading(false);
    }
  };

  const languageOptions = [
    "Python",
    "Bash",
    "JavaScript",
    "SQL",
    "PowerShell",
    "Other",
  ];

  return (
    <div>
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} title="Add Script">
        <div className="modal-content">
          <div className="form-row">
            <div className="form-group half">
              <label>Category *</label>
              <select
                name="category"
                value={scriptForm.category}
                onChange={handleFormChange}
              >
                <option value="" className="placeholder">
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group half">
              <label>Language *</label>
              <select
                name="language"
                value={scriptForm.language}
                onChange={handleFormChange}
              >
                <option value="" className="placeholder">
                  Select language
                </option>
                {languageOptions.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., File Renamer Script"
              value={scriptForm.title}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder="Brief description of what this script does"
              value={scriptForm.description}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Code *</label>
            <textarea
              name="code"
              value={scriptForm.code}
              onChange={handleFormChange}
              onPaste={handlePaste}
              rows={isExpanded ? 5 : 1}
              className={`code-input ${isExpanded ? "expanded" : ""}`}
              placeholder="Paste your code here"
            />
          </div>

          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="create-btn"
              onClick={handleAddScript}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddScript;
