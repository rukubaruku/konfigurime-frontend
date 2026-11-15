import { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
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
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.post("/category/module", {
        module: "credentials",
      });
      if (response.status === 200) {
        const formattedCategories = response.data.data.map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name,
        }));
        setCategories(formattedCategories);
      }
    } catch (err) {
      toast.error("Failed to fetch categories", { theme, transition: Bounce });
    }
  };

  const fetchCredentialData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/credentials/${credentialId}`);

      const pwRes = await axiosInstance.get(
        `/credentials/${credentialId}/password`,
      );

      if (res.status === 200) {
        const c = res.data.credential;
        setEditingCredentialForm({
          category: c.category ?? "",
          username: c.username ?? "",
          password: pwRes.data.password || "",
          url: c.url ?? "",
          title: c.title ?? "",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch credential details", {
        theme,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!credentialId) return;
    fetchCategories();
    fetchCredentialData();
    setPasswordVisible(false);
    setErrors({});
  }, [credentialId]);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingCredentialForm((prev) => ({ ...prev, [name]: value }));
  };

  const valid = () => {
    const newErrors = {};
    if (!editingCredentialForm.category)
      newErrors.category = "Category is required";
    if (!editingCredentialForm.username)
      newErrors.username = "Username is required";
    if (!editingCredentialForm.password)
      newErrors.password = "Password is required";
    if (!editingCredentialForm.url) newErrors.url = "Url is required";
    if (!editingCredentialForm.title) newErrors.title = "Title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditCredential = async () => {
    if (loading) return;
    if (!valid()) return;
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/credentials/${credentialId}`,
        editingCredentialForm,
      );
      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message, { theme, transition: Bounce });
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update", {
        theme,
        transition: Bounce,
      });
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
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
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
