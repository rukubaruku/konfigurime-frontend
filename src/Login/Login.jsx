import "./login.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
  faRightToBracket,
  faShieldHalved,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import lightMode from "../Assets/Images/lightMode.png";
import darkMode from "../Assets/Images/darkMode.png";
import { Bounce, toast } from "react-toastify";
import axiosInstance from "../Utils/axiosInstance";
import { useAuth } from "../Hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorsLogin, setErrorsLogin] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [theme, setTheme] = useState("light");
  // Second step (2FA): set when the password was correct and a code is needed
  const [twoFactorToken, setTwoFactorToken] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const validLogin = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    setErrorsLogin(errors);
    return Object.keys(errors).length === 0;
  };

  const completeLogin = ({ token, user }) => {
    login(token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.name);
    navigate("/home");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validLogin() || submitting) return;

    setLoginError("");
    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      if (response.data.success) {
        if (response.data.twoFactorRequired) {
          setTwoFactorToken(response.data.twoFactorToken);
          setTwoFactorCode("");
          setPassword("");
        } else {
          completeLogin(response.data);
        }
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!twoFactorCode.trim() || submitting) return;

    setLoginError("");
    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/user/2fa/verify", {
        twoFactorToken,
        code: twoFactorCode.trim(),
      });
      if (response.data.success) completeLogin(response.data);
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      setLoginError(message);
      // The temporary login token expired: go back to the password step.
      if (/sign in again/i.test(message)) setTwoFactorToken(null);
    } finally {
      setSubmitting(false);
    }
  };

  const backToPassword = () => {
    setTwoFactorToken(null);
    setTwoFactorCode("");
    setLoginError("");
  };

  return (
    <div className="login-page">
      <button onClick={toggleTheme} className="theme-toggle">
        <img
          src={theme === "light" ? darkMode : lightMode}
          alt="Toggle theme"
          className="theme-icon"
        />
      </button>

      <div className="login-card">
        <div className="login-header">
          <div className="shield-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>

          <h1>Config Vaults</h1>
          <p className="subtitle">Secure access to your configurations</p>
        </div>

        {twoFactorToken ? (
          <form className="login-form" onSubmit={handleVerifyCode}>
            {loginError && <div className="auth-error">{loginError}</div>}

            <div className="form-group">
              <label>Verification code</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faKey} className="input-icon" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={11}
                  placeholder="6-digit code or recovery code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                />
              </div>
              <span className="two-factor-hint">
                Open your authenticator app and enter the current code.
              </span>
            </div>

            <button className="login-btn" type="submit" disabled={submitting}>
              <FontAwesomeIcon icon={faShieldHalved} />
              <span>Verify</span>
            </button>
            <button
              type="button"
              className="two-factor-back"
              onClick={backToPassword}
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            {loginError && <div className="auth-error">{loginError}</div>}

            {/* EMAIL */}
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errorsLogin.email && (
                <span className="error">{errorsLogin.email}</span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errorsLogin.password && (
                <span className="error">{errorsLogin.password}</span>
              )}
            </div>

            <button className="login-btn" type="submit" disabled={submitting}>
              <FontAwesomeIcon icon={faRightToBracket} />
              <span>Sign In</span>
            </button>
          </form>
        )}

        <p className="footer-secure">Secured with AES-256-GCM encryption</p>
      </div>
    </div>
  );
};

export default Login;
