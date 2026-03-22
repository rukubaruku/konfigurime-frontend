import { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { FileCodeCorner, Tag, Type, BookText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

const ConfigFileForm = ({ mode = "add", initialData = {}, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    code: "",
  });
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        category: initialData.category || "",
        title: initialData.title || "",
        description: initialData.description || "",
        code: initialData.code || "",
      });
    }
  }, [initialData, mode]);

  const fetchCategories = async () => {
    try {
      const res = await axios.post(
        "https://konfigurime-api.arkiva.gov.al/category/module",
        {
          module: "configs",
        },
      );

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
        navigate("/config-files");
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
          {mode === "add"
            ? "Add Configuration File"
            : "Edit Configuration File"}
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
              placeholder="Enter configuration file title"
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
              placeholder="Enter configuration file description"
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <FileCodeCorner size={20} /> Code
            </div>
            <Editor
              height="400px"
              language={"python"}
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
          <button
            onClick={() => navigate("/config-files")}
            className="cancel-btn"
          >
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

export default ConfigFileForm;
