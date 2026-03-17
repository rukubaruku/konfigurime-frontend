import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { Bounce, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const AddCredential = ({ isOpen, onClose, onSuccess, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentialForm, setCredentialForm] = useState({
    category: "",
    username: "",
    password: "",
    url: "",
    title: "",
    note: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3109/category/categories/module",
        { module: "credentials" },
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
      setCredentialForm({
        category: "",
        username: "",
        password: "",
        url: "",
        title: "",
        note: "",
      });
    }
  }, [isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCredentialForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCredential = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3109/credentials/new/credential",
        credentialForm,
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
      toast.error(error.response?.data?.message || "Failed to add credential", {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Credential">
      <div className="credential-modal-content">
        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={credentialForm.category}
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

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Production Server"
            value={credentialForm.title}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={credentialForm.username}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group half password-field">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••"
                value={credentialForm.password}
                onChange={handleFormChange}
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>URL</label>
          <input
            type="text"
            name="url"
            placeholder="https://..."
            value={credentialForm.url}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="note"
            placeholder="Additional notes..."
            value={credentialForm.note}
            onChange={handleFormChange}
          />
        </div>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="create-btn"
            onClick={handleAddCredential}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCredential;
