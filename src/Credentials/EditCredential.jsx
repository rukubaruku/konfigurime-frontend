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
    note: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFetched, setPasswordFetched] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

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

  const fetchCredential = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3109/credentials/${credentialId}`,
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
        `http://localhost:3109/credentials/${credentialId}/password`,
      );
      setEditingCredentialForm((prev) => ({
        ...prev,
        password: res.data.password,
      }));
      setPasswordFetched(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch password", { theme, transition: Bounce });
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

  const handleEditCredential = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:3109/credentials/${credentialId}`,
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
      <div className="credential-modal-content">
        <div className="form-group">
          <label>Category *</label>
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

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Production Server"
            value={editingCredentialForm.title}
            onChange={handleEditFormChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={editingCredentialForm.username}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="form-group half">
            <label>Password</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="••••••"
                value={passwordVisible ? editingCredentialForm.password : ""}
                onChange={handleEditFormChange}
                disabled={!passwordVisible}
                style={{ paddingRight: "2.5rem", width: "100%" }}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                disabled={loadingPassword}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: loadingPassword ? "wait" : "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  color: "var(--color-text-secondary)",
                }}
              >
                {loadingPassword ? (
                  <span style={{ fontSize: "11px" }}>...</span>
                ) : passwordVisible ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
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
            value={editingCredentialForm.url}
            onChange={handleEditFormChange}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="note"
            placeholder="Additional notes..."
            value={editingCredentialForm.note}
            onChange={handleEditFormChange}
          />
        </div>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="create-btn"
            onClick={handleEditCredential}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditCredential;
