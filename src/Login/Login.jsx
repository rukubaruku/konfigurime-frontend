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
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import lightMode from "../Assets/Images/lightMode.png";
import darkMode from "../Assets/Images/darkMode.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorsLogin, setErrorsLogin] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [theme, setTheme] = useState("light");

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validLogin()) return;

    try {
      const response = await axios.post(
        "http://localhost:3109/user/login",
        { email, password },
        { withCredentials: true },
      );

      if (response.data.status === 200) {
        navigate("/home");
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userName", response.data.userName);
      } else {
        setLoginError("Invalid credentials");
      }
    } catch {
      setLoginError("Login failed");
    }
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

          <button className="login-btn" type="submit">
            <FontAwesomeIcon icon={faRightToBracket} />
            <span>Sign In</span>
          </button>
        </form>

        <p className="footer-secure">Secured with AES-256 encryption</p>
      </div>
    </div>
  );
};

export default Login;
