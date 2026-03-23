import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { Bounce, toast } from "react-toastify";
import { FileCodeCorner } from "lucide-react";
import Editor from "@monaco-editor/react";

const EditCommand = ({ commandId, onClose, onSuccess, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState("javascript");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    code: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.post(
        "https://konfigurime-api.arkiva.gov.al/category/module",
        {
          module: "commands",
        },
      );

      setCategories(
        (res.data?.data || []).map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name,
        })),
      );
    } catch (err) {
      toast.error("Failed to fetch categories", { theme, transition: Bounce });
    }
  };

  const fetchCommand = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://konfigurime-api.arkiva.gov.al/commands/${commandId}`,
      );
      const c = res.data?.command;

      if (!c) throw new Error("Command not found");

      setForm({
        category: c.category || "",
        title: c.title || "",
        description: c.description || "",
        code: c.code || "",
      });

      setEditorLanguage(c.language?.toLowerCase() || "javascript");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch command", { theme, transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!commandId) return;

    const loadData = async () => {
      await fetchCategories();
      await fetchCommand();
    };
    loadData();
  }, [commandId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (value) => {
    setForm((prev) => ({ ...prev, code: value || "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.category) newErrors.category = "Category is required";
    if (!form.title) newErrors.title = "Title is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.code) newErrors.code = "Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios.put(
        `https://konfigurime-api.arkiva.gov.al/commands/${commandId}`,
        { ...form, language: editorLanguage },
      );

      if (res.data.success) {
        toast.success(res.data.message, { theme, transition: Bounce });
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update command", {
        theme,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormReady = !!commandId && !!form.title;

  return (
    <Modal isOpen={!!commandId} onClose={onClose} title="Edit Command">
      <div className="modal-content">
        {loading && (
          <div className="overlay">
            <div className="spinner" />
          </div>
        )}

        {!isFormReady ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
        ) : (
          <div className="form-container command">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="error">{errors.category}</div>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                value={form.title}
                onChange={handleChange}
              />
              <div className="error">{errors.title}</div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <input
                type="text"
                name="description"
                placeholder="Enter description"
                value={form.description}
                onChange={handleChange}
              />
              <div className="error">{errors.description}</div>
            </div>

            <div className="form-group">
              <label>Language</label>
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
              <label>
                <FileCodeCorner size={18} /> Code *
              </label>
              <Editor
                key={form.code}
                height="70px"
                language={editorLanguage}
                value={form.code}
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
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditCommand;
