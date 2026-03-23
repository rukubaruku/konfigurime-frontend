import { useState, useEffect } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const theme = localStorage.getItem("theme") || "light";

  const [user, setUser] = useState({ name: "", email: "" });
  const [originalUser, setOriginalUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://konfigurime-api.arkiva.gov.al/user/${userId}`,
        );
        if (res.data.success) {
          setUser({ name: res.data.data.name, email: res.data.data.email });
          setOriginalUser({
            name: res.data.data.name,
            email: res.data.data.email,
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch user", {
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
    fetchUser();
  }, [userId, theme]);

  const handleSaveProfile = async () => {
    if (user.name === originalUser.name && user.email === originalUser.email)
      return;

    if (!user.name || !user.email) {
      toast.error("Name and email cannot be empty", {
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

    try {
      setLoading(true);
      const res = await axios.put(
        "https://konfigurime-api.arkiva.gov.al/user/update",
        user,
      );
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
        setOriginalUser({ ...user });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile", {
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

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required", {
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

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters", {
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

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match", {
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

    try {
      setLoading(true);
      const res = await axios.put(
        "https://konfigurime-api.arkiva.gov.al/user/change-password",
        passwordForm,
      );
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
        setEditingPassword(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password", {
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
          <div className="spinner"></div>
        </div>
      )}
      <div className="add-card">
        <div className="add-header">Profile</div>

        <div className="form-container">
          <div className="form-group">
            <div className="form-label">Name</div>
            <input
              type="text"
              value={user.name}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <div className="form-label">Email</div>
            <input
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="cancel-btn"
              onClick={() => setUser({ ...originalUser })}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              Save
            </button>
            <button
              className="change-pass-btn"
              onClick={() => setEditingPassword((prev) => !prev)}
              disabled={loading}
            >
              Change Password
            </button>
          </div>

          {editingPassword && (
            <div
              className="password-change-section"
              style={{ marginTop: "16px" }}
            >
              <div className="form-group">
                <div className="form-label">Current Password</div>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <div className="form-label">New Password</div>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <div className="form-label">Confirm New Password</div>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setEditingPassword(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
