import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { Eye, EyeOff } from "lucide-react";
import { Bounce, toast } from "react-toastify";

const EditCredential = ({ credentialId, onClose, onSuccess, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCredentialForm, setEditingCredentialForm] = useState({
    category: "",
    username: "",
    password: "",
    url: "",
    title: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFetched, setPasswordFetched] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await axios.post(
        "https://konfigurime-api.arkiva.gov.al/category/module",
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

  const fetchCredential = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://konfigurime-api.arkiva.gov.al/credentials/${credentialId}`,
      );
      if (response.status === 200) {
        const c = response.data.credential;
        setEditingCredentialForm({
          category: c.category ?? "",
          username: c.username ?? "",
          password: "",
          url: c.url ?? "",
          title: c.title ?? "",
          note: c.note ?? "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch credential",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme,
          transition: Bounce,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!credentialId) return;
    fetchCategories();
    fetchCredential();
    setPasswordVisible(false);
    setPasswordFetched(false);
    setErrors({});
  }, [credentialId]);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingCredentialForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPassword = async () => {
    if (passwordFetched) return;
    try {
      setLoadingPassword(true);
      const res = await axios.get(
        `https://konfigurime-api.arkiva.gov.al/credentials/${credentialId}/password`,
      );
      setEditingCredentialForm((prev) => ({
        ...prev,
        password: res.data.password,
      }));
      setPasswordFetched(true);
    } catch (error) {
      toast.error("Failed to fetch password", {
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
      setLoadingPassword(false);
    }
  };

  const handleTogglePassword = async () => {
    if (!passwordVisible && !passwordFetched) {
      await fetchPassword();
    }
    setPasswordVisible((prev) => !prev);
  };

  const valid = () => {
    const errors = {};
    if (!editingCredentialForm.category)
      errors.category = "Category is required";
    if (!editingCredentialForm.username)
      errors.username = "Username is required";
    if (!editingCredentialForm.password)
      errors.password = "Password is required";
    if (!editingCredentialForm.url) errors.url = "Url is required";
    if (!editingCredentialForm.title) errors.title = "Title is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditCredential = async () => {
    if (loading) return;
    if (!valid()) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `https://konfigurime-api.arkiva.gov.al/credentials/${credentialId}`,
        editingCredentialForm,
      );
      if (response.status === 200 && response.data.success) {
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
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update credential",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme,
          transition: Bounce,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!credentialId} onClose={onClose} title="Edit Credential">
      <div className="modal-content">
        <div className="form-container credentials">
          <div className="form-group">
            <div className="form-label">Category</div>
            <div className="form-input">
              <select
                name="category"
                value={editingCredentialForm.category}
                onChange={handleEditFormChange}
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
            <div className="form-label">Title</div>
            <div className="form-input">
              <input
                type="text"
                name="title"
                placeholder="e.g., Production Server"
                value={editingCredentialForm.title}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="error">{errors.title}</div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <div className="form-label">Username</div>
              <div className="form-input">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={editingCredentialForm.username}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="error">{errors.username}</div>
            </div>

            <div className="form-group half password-field">
              <div className="form-label">Password</div>
              <div className="form-input password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="••••••"
                  value={editingCredentialForm.password}
                  onChange={handleEditFormChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={handleTogglePassword}
                  disabled={loadingPassword}
                >
                  {loadingPassword ? (
                    <span style={{ fontSize: "11px" }}>...</span>
                  ) : passwordVisible ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <div className="error">{errors.password}</div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">URL</div>
            <div className="form-input">
              <input
                type="text"
                name="url"
                placeholder="https://..."
                value={editingCredentialForm.url}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="error">{errors.url}</div>
          </div>

          <div className="form-group">
            <div className="form-label">Notes</div>
            <div className="form-input">
              <textarea
                name="note"
                placeholder="Additional notes..."
                value={editingCredentialForm.note}
                onChange={handleEditFormChange}
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={handleEditCredential}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditCredential;
