import { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import Modal from "../Modal/Modal";
import { Bounce, toast } from "react-toastify";
import { FileCodeCorner } from "lucide-react";
import Editor from "@monaco-editor/react";

const AddCommand = ({ isOpen, onClose, onSuccess, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editorLanguage, setEditorLanguage] = useState("javascript");

  const [commandForm, setCommandForm] = useState({
    category: "",
    title: "",
    description: "",
    code: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.post("/category/module", {
        module: "commands",
      });

      if (response.status === 200) {
        const data = response.data.data;

        if (!data || data.length === 0) {
          setCategories([]);

          toast.warn("No categories found for this module", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme,
            transition: Bounce,
          });

          return;
        }

        const formattedCategories = data.map((c) => ({
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
      setCommandForm({
        category: "",
        title: "",
        description: "",
        code: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCommandForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (value) => {
    setCommandForm((prev) => ({
      ...prev,
      code: value || "",
    }));
  };

  const valid = () => {
    const newErrors = {};
    if (!commandForm.category) newErrors.category = "Category is required";
    if (!commandForm.title) newErrors.title = "Title is required";
    if (!commandForm.description)
      newErrors.description = "Description is required";
    if (!commandForm.code) newErrors.code = "Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCommand = async () => {
    if (loading) return;
    if (!valid()) return;

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/commands/new/command",
        commandForm,
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
      toast.error(error.response?.data?.message || "Failed to add command", {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Command">
      <div className="modal-content">
        <div className="form-container">
          <div className="form-group">
            <div className="form-label">Category *</div>
            <div className="form-input">
              <select
                name="category"
                value={commandForm.category}
                onChange={handleFormChange}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="error">{errors.category}</div>
          </div>

          <div className="form-group">
            <div className="form-label">Language</div>
            <select
              value={editorLanguage}
              onChange={(e) => setEditorLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="sql">SQL</option>
              <option value="json">JSON</option>
              <option value="bash">Bash</option>
            </select>
          </div>

          <div className="form-group">
            <div className="form-label">Title *</div>
            <div className="form-input">
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                value={commandForm.title}
                onChange={handleFormChange}
              />
            </div>
            <div className="error">{errors.title}</div>
          </div>

          <div className="form-group">
            <div className="form-label">Description *</div>
            <div className="form-input">
              <input
                type="text"
                name="description"
                placeholder="Enter description"
                value={commandForm.description}
                onChange={handleFormChange}
              />
            </div>
            <div className="error">{errors.description}</div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <FileCodeCorner size={20} /> Code *
            </div>

            <Editor
              height="70px"
              language={editorLanguage}
              value={commandForm.code}
              onChange={handleCodeChange}
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              options={{
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                minimap: { enabled: false },
              }}
            />

            <div className="error">{errors.code}</div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={handleAddCommand}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddCommand;
