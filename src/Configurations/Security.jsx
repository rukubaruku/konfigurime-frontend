import axios from "axios";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import "./configurations.css";
const Security = () => {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: { theme },
        transition: Bounce,
      });
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: { theme },
        transition: Bounce,
      });
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not authenticated", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: { theme },
        transition: Bounce,
      });
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3109/user/change-password",
        {
          userId,
          currentPassword,
          newPassword,
        },
      );
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: { theme },
        transition: Bounce,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.success(error.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: { theme },
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="security-content">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="security-header">
        <Lock size={22} /> Change Password
      </div>
      <div className="security-form">
        <div className="security-form-group">
          <div className="security-form-group-label">
            <label htmlFor="current">Current Password</label>
          </div>
          <div className="security-form-group-input">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
        </div>
        <div className="security-form-group">
          <div className="security-form-group-label">
            <label htmlFor="new">New Password</label>
          </div>
          <div className="security-form-group-input">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
        </div>
        <div className="security-form-group">
          <div className="security-form-group-label">
            <label htmlFor="confirm">Confirm New Password</label>
          </div>
          <div className="security-form-group-input">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <div className="security-form-action">
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Security;
