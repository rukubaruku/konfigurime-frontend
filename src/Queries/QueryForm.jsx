import { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { FileCodeCorner, Tag, Type, BookText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

const QueryForm = ({ mode = "add", initialData = {}, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    language: "javascript",
    title: "",
    description: "",
    code: "",
  });
  const [editorLanguage, setEditorLanguage] = useState("javascript");
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const lang = initialData.language?.toLowerCase() || "javascript";
      setForm({
        category: initialData.category || "",
        language: initialData.language || "JavaScript",
        title: initialData.title || "",
        description: initialData.description || "",
        code: initialData.code || "",
      });
      setEditorLanguage(lang);
    }
  }, [initialData, mode]);

  const fetchCategories = async () => {
    try {
      const res = await axios.post("http://localhost:3109/category/module", {
        module: "queries",
      });

      setCategories(
        (res.data?.data || []).map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name ?? "Unnamed",
        })),
      );
    } catch (err) {
      toast.error("Failed to fetch categories", {
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
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "language") {
      setEditorLanguage(value.toLowerCase());
    }
  };

  const handleCodeChange = (value) => {
    setForm((prev) => ({ ...prev, code: value || "" }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await onSubmit(form);
      if (response.data.success) {
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
        navigate("/queries");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
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
    <div className="add-container">
      {loading && (
        <div className="overlay">
          <div className="spinner" />
        </div>
      )}

      <div className="add-card">
        <div className="add-header">
          <FileCodeCorner size={22} />
          {mode === "add" ? "Add Query" : "Edit Query"}
        </div>

        <div className="form-container">
          <div className="form-group">
            <div className="form-label">
              <Tag size={20} /> Category
            </div>
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
          </div>

          <div className="form-group">
            <div className="form-label">
              <Type size={20} /> Title
            </div>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter query title"
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <BookText size={20} /> Description
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter query description"
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <FileCodeCorner size={20} /> Code
            </div>
            <Editor
              height="100px"
              language={editorLanguage || "javascript"}
              value={form.code}
              onChange={handleCodeChange}
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              options={{
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        <div className="form-actions">
          <button onClick={() => navigate("/queries")} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSubmit} className="confirm-btn">
            {mode === "add" ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryForm;
