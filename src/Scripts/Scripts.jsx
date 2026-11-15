import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import "./scripts.css";
import { Search } from "lucide-react";
import CategoryTab from "../CategoryTab/CategoryTab";
import axiosInstance from "../Utils/axiosInstance";
import { Bounce, toast } from "react-toastify";
import ScriptsList from "./ScriptsList";
import { useNavigate } from "react-router-dom";

const Scripts = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [scripts, setScripts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchScripts = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/scripts/${categoryId}`);

      if (response.data.success) {
        setScripts(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch credentials",
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
    fetchScripts(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="scripts-container">
      <PageHeader />
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Scripts</div>
          <div className="page-content-header-subtitle">
            Manage your reusable code snippets
          </div>
        </div>
        <div className="page-content-header-actions">
          <button
            className="add-item"
            onClick={() => navigate("/scripts/add-script")}
          >
            + Add Script
          </button>
        </div>
      </div>
      <div className="search-input">
        <Search size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search script"
        />
      </div>

      <CategoryTab
        module="scripts"
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ScriptsList
        scripts={scripts}
        loading={loading}
        onDelete={() => fetchScripts(selectedCategory)}
        theme={theme}
      />
    </div>
  );
};

export default Scripts;
