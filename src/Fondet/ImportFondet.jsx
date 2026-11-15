// src/components/Fondet/ImportFondet.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { Bounce, toast } from "react-toastify";
import PageHeader from "../PageHeader/PageHeader";

const ImportFondet = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { total, inserted, skipped, message }
  const navigate = useNavigate();

  const handleImport = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await axiosInstance.post("/fondet/import");

      if (response.data.success) {
        setResult(response.data);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(error.response?.data?.message || "Failed to import Fondet", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fondet-container">
      <PageHeader />

      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Import Folder List</div>
          <div className="page-content-header-subtitle">
            Import records from <strong>Fondet e skanuara.txt</strong>
          </div>
        </div>
      </div>

      <div
        className="form-container fondet"
        style={{ flexDirection: "column", gap: "1rem" }}
      >
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          This action reads <code>Fondet e skanuara.txt</code> from the server's
          root directory and inserts any new records into the database.
          Duplicate entries (matched by full path) will be skipped
          automatically.
        </p>

        {result && (
          <div
            style={{
              background: "var(--success-bg, #f0fdf4)",
              border: "1px solid var(--success-border, #86efac)",
              borderRadius: "8px",
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}
          >
            <strong>Import complete</strong>
            <span>
              Total lines processed: <b>{result.total}</b>
            </span>
            <span>
              New records inserted: <b>{result.inserted}</b>
            </span>
            <span>
              Already existed (skipped): <b>{result.skipped}</b>
            </span>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          className="confirm-btn"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? "Importing…" : "Start Import"}
        </button>
        <button
          className="cancel-btn"
          onClick={() => navigate("/fondet")}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImportFondet;
