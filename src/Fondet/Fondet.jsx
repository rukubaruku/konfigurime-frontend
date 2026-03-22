import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import { Search } from "lucide-react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import FondetList from "./FondetList";
import { useNavigate } from "react-router-dom";

const Fondet = () => {
  const [fond, setFond] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [results, setResults] = useState([]);
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
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get("http://localhost:3109/fondet/search", {
        params: { fond, year, file },
      });

      if (response.data.success) {
        const data = response.data.data || [];

        setResults(data);

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

      <div
        className="search-input"
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
      >
        <input
          type="text"
          value={fond}
          onChange={(e) => setFond(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Fond (e.g. F.512)"
        />
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Year (e.g. 1985)"
        />
        <input
          type="text"
          value={file}
          onChange={(e) => setFile(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="File (e.g. 1)"
        />
        <button className="confirm-btn" onClick={handleSearch}>
          <Search size={20} />
          Search
        </button>
      </div>

      {!loading && results.length === 0 && (fond || year || file) ? (
        <div className="no-data">No folders found</div>
      ) : (
        <FondetList results={results} loading={loading} theme={theme} />
      )}
    </div>
  );
};

export default Fondet;
