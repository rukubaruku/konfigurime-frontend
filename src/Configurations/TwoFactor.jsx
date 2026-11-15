import { ShieldCheck, ShieldOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../Utils/axiosInstance";
import "./configurations.css";

/**
 * Two-factor authentication (TOTP) settings: enable with an authenticator
 * app, show one-time recovery codes, disable, regenerate recovery codes.
 */
const TwoFactor = () => {
  const theme = localStorage.getItem("theme") || "light";
  const toastOptions = { theme };

  const [status, setStatus] = useState(null); // { enabled, recoveryCodesLeft }
  const [setup, setSetup] = useState(null); // { qrCode, secret }
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [disabling, setDisabling] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axiosInstance.get("/user/2fa/status");
      setStatus(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load 2FA status",
        toastOptions,
      );
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setCode("");
    setPassword("");
  };

  const run = async (fn) => {
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Request failed",
        toastOptions,
      );
    } finally {
      setLoading(false);
    }
  };

  const startSetup = () =>
    run(async () => {
      const res = await axiosInstance.post("/user/2fa/setup");
      setSetup({ qrCode: res.data.qrCode, secret: res.data.secret });
      resetForm();
    });

  const confirmSetup = () =>
    run(async () => {
      const res = await axiosInstance.post("/user/2fa/enable", {
        code: code.trim(),
      });
      if (res.data.token) localStorage.setItem("token", res.data.token);
      setRecoveryCodes(res.data.recoveryCodes);
      setSetup(null);
      resetForm();
      toast.success(res.data.message, toastOptions);
      await fetchStatus();
    });

  const disable = () =>
    run(async () => {
      const res = await axiosInstance.post("/user/2fa/disable", {
        password,
        code: code.trim(),
      });
      if (res.data.token) localStorage.setItem("token", res.data.token);
      setDisabling(false);
      setRecoveryCodes(null);
      resetForm();
      toast.success(res.data.message, toastOptions);
      await fetchStatus();
    });

  const regenerateCodes = () =>
    run(async () => {
      const res = await axiosInstance.post("/user/2fa/recovery-codes", {
        code: code.trim(),
      });
      setRecoveryCodes(res.data.recoveryCodes);
      resetForm();
      await fetchStatus();
    });

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join("\n"));
      toast.success("Recovery codes copied", toastOptions);
    } catch {
      toast.error("Could not copy to clipboard", toastOptions);
    }
  };

  if (!status) return null;

  return (
    <div className="security-content two-factor">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="form-container">
        <div className="security-header">
          {status.enabled ? <ShieldCheck /> : <ShieldOff />}
          Two-factor authentication
          <span className={`two-factor-badge ${status.enabled ? "on" : "off"}`}>
            {status.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <p className="two-factor-text">
          {status.enabled
            ? `Signing in requires a code from your authenticator app. Recovery codes left: ${status.recoveryCodesLeft}.`
            : "Protect your account with a code from an authenticator app (Google Authenticator, Microsoft Authenticator, Authy, Bitwarden...) in addition to your password."}
        </p>

        {recoveryCodes && (
          <div className="two-factor-recovery">
            <strong>Save these recovery codes now.</strong> Each one can be used
            once to sign in if you lose your phone. They will not be shown
            again.
            <ul>
              {recoveryCodes.map((c) => (
                <li key={c}>
                  <code>{c}</code>
                </li>
              ))}
            </ul>
            <div className="form-actions">
              <button className="cancel-btn" onClick={copyCodes}>
                Copy
              </button>
              <button
                className="confirm-btn"
                onClick={() => setRecoveryCodes(null)}
              >
                I saved them
              </button>
            </div>
          </div>
        )}

        {/* --- Not enabled: setup flow --- */}
        {!status.enabled && !setup && (
          <div className="form-actions">
            <button
              className="confirm-btn"
              onClick={startSetup}
              disabled={loading}
            >
              Enable 2FA
            </button>
          </div>
        )}

        {!status.enabled && setup && (
          <div className="two-factor-setup">
            <p className="two-factor-text">
              1. Scan this QR code with your authenticator app.
            </p>
            <img
              className="two-factor-qr"
              src={setup.qrCode}
              alt="2FA QR code"
            />
            <p className="two-factor-text">
              Can't scan it? Enter this key manually:{" "}
              <code className="two-factor-secret">{setup.secret}</code>
            </p>
            <div className="form-group">
              <div className="form-label">
                2. Enter the 6-digit code from the app
              </div>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setSetup(null);
                  resetForm();
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={confirmSetup}
                disabled={loading || code.trim().length !== 6}
              >
                Verify & enable
              </button>
            </div>
          </div>
        )}

        {/* --- Enabled: manage --- */}
        {status.enabled && !disabling && (
          <div className="two-factor-manage">
            <div className="form-group">
              <div className="form-label">
                Authenticator code (to generate new recovery codes)
              </div>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setDisabling(true);
                  resetForm();
                }}
                disabled={loading}
              >
                Disable 2FA
              </button>
              <button
                className="confirm-btn"
                onClick={regenerateCodes}
                disabled={loading || code.trim().length !== 6}
              >
                New recovery codes
              </button>
            </div>
          </div>
        )}

        {status.enabled && disabling && (
          <div className="two-factor-manage">
            <div className="form-group">
              <div className="form-label">Current password</div>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="form-label">
                Authenticator code or recovery code
              </div>
              <input
                type="text"
                autoComplete="one-time-code"
                maxLength={11}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setDisabling(false);
                  resetForm();
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={disable}
                disabled={loading || !password || !code.trim()}
              >
                Disable 2FA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactor;
