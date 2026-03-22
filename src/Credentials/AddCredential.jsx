import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { Bounce, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const AddCredential = ({ isOpen, onClose, onSuccess, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [credentialForm, setCredentialForm] = useState({
    category: "",
    username: "",
    password: "",
    url: "",
    title: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.post(
        "https://konfigurime-api.arkiva.gov.al:3109/category/module",
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
      });
    }
  }, [isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCredentialForm((prev) => ({ ...prev, [name]: value }));
  };

  const valid = () => {
    const errors = {};
    if (!credentialForm.category) errors.category = "Category is required";
    if (!credentialForm.username) errors.username = "Username is required";
    if (!credentialForm.password) errors.password = "Password is required";
    if (!credentialForm.url) errors.url = "Url is required";
    if (!credentialForm.title) errors.title = "Title is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCredential = async () => {
    if (loading) return;
    if (!valid()) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "https://konfigurime-api.arkiva.gov.al:3109/credentials/new/credential",
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
      <div className="modal-content">
        <div className="form-container">
          <div className="form-group">
            <div className="form-label">Category *</div>
            <div className="form-input">
              <select
                name="category"
                value={credentialForm.category}
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
            <div className="error">{errors.category}</div>
          </div>

          <div className="form-group">
            <div className="from-label">Title *</div>
            <div className="form-input">
              <input
                type="text"
                name="title"
                placeholder="e.g., Production Server"
                value={credentialForm.title}
                onChange={handleFormChange}
              />
            </div>
            <div className="error">{errors.title}</div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <div className="form-label">Username *</div>
              <div className="form-input">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={credentialForm.username}
                  onChange={handleFormChange}
                />
              </div>
              <div className="error">{errors.username}</div>
            </div>
            <div className="form-group half password-field">
              <div className="form-label">Password *</div>
              <div className="form-input password-wrapper">
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
              <div className="error">{errors.password}</div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">URL *</div>
            <div className="form-input">
              <input
                type="text"
                name="url"
                placeholder="https://..."
                value={credentialForm.url}
                onChange={handleFormChange}
              />
            </div>
            <div className="error">{errors.url}</div>
          </div>

          <div className="form-actions">
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
      </div>
    </Modal>
  );
};

export default AddCredential;
