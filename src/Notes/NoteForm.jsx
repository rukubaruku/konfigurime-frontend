import { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { Tag, Type, BookText, FileCodeCorner } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoteForm = ({ mode = "add", initialData = {}, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    content: "",
  });

  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        category: initialData.category || "",
        title: initialData.title || "",
        description: initialData.description || "",
        content: initialData.content || "",
      });
    }
  }, [initialData, mode]);

  const fetchCategories = async () => {
    try {
      const res = await axios.post(
        "https://konfigurime-api.arkiva.gov.al:3109/category/module",
        {
          module: "notes",
        },
      );

      setCategories(
        (res.data?.data || []).map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name ?? "Unnamed",
        })),
      );
    } catch {
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

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const res = await onSubmit(form);

      if (res.data.success) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme,
          transition: Bounce,
        });
        navigate("/notes");
      }
    } catch (err) {
      toast.error("Something went wrong", {
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
          {mode === "add" ? "Add Note" : "Edit Note"}
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
              placeholder="Enter title"
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
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <FileCodeCorner size={20} /> Content
            </div>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
            />
          </div>
        </div>

        <div className="form-actions">
          <button onClick={() => navigate("/notes")} className="cancel-btn">
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

export default NoteForm;
