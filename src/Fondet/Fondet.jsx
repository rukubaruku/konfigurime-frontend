import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import { Search } from "lucide-react";
import axiosInstance from "../Utils/axiosInstance";
import { Bounce, toast } from "react-toastify";
import FondetList from "./FondetList";
import { useNavigate } from "react-router-dom";
import "./fondet.css";

const Fondet = () => {
  const [fond, setFond] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const handleSearch = async () => {
    if (!fond.trim() && !year.trim() && !file.trim()) {
      setResults([]);
      setTotal(0);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.get("/fondet/search", {
        params: { fond: fond.trim(), year: year.trim(), file: file.trim() },
      });

      if (response.data.success) {
        const data = response.data.data || [];

        setResults(data);
        setTotal(response.data.total ?? data.length);
        setLimit(response.data.limit ?? 0);
        setSearched(true);

        if (data.length === 0) {
          toast.warn("No folders found", {
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
      }
    } catch (error) {
      console.error("Failed to search Fondet:", error);
      toast.error(error.response?.data?.message || "Failed to search Fondet", {
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setFond("");
    setYear("");
    setFile("");
    setResults([]);
    setTotal(0);
    setSearched(false);
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
          <div className="page-content-header-title">Fondet</div>
          <div className="page-content-header-subtitle">
            Search your folder lists
          </div>
        </div>
        <div className="page-content-header-actions">
          <button
            className="add-item"
            onClick={() => navigate("/fondet/import")}
          >
            + Import Folder List
          </button>
        </div>
      </div>

      <div className="fondet-search">
        <label className="fondet-field">
          <span className="fondet-label">Fond</span>
          <div className="fondet-input with-prefix">
            <span className="fondet-prefix">F.</span>
            <input
              type="text"
              value={fond}
              onChange={(e) => setFond(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="1018"
              autoFocus
            />
          </div>
        </label>
        <span className="fondet-sep">\</span>
        <label className="fondet-field">
          <span className="fondet-label">Year</span>
          <div className="fondet-input">
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="any"
            />
          </div>
        </label>
        <span className="fondet-sep">\</span>
        <label className="fondet-field">
          <span className="fondet-label">File</span>
          <div className="fondet-input">
            <input
              type="text"
              value={file}
              onChange={(e) => setFile(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="any"
            />
          </div>
        </label>
        <div className="fondet-buttons form-actions">
          <button className="confirm-btn" onClick={handleSearch}>
            <Search size={16} /> Search
          </button>
          <button className="cancel-btn" onClick={clearSearch}>
            Clear
          </button>
        </div>
      </div>
      <div className="fondet-hint">
        Leave a field empty to match anything. Example: <b>1018</b> · empty ·{" "}
        <b>857</b> finds every <code>F.1018\…\857</code>.
      </div>

      {searched && !loading && results.length === 0 ? (
        <div className="no-data">No folders found</div>
      ) : (
        <FondetList results={results} total={total} limit={limit} />
      )}
    </div>
  );
};

export default Fondet;
