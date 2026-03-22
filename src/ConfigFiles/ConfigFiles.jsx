import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import { Search } from "lucide-react";
import CategoryTab from "../CategoryTab/CategoryTab";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfigFilesList from "./ConfigFilesList";

const ConfigFiles = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [configFiles, setConfigFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchConfigFiles = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://konfigurime-api.arkiva.gov.al:3109/config-files/${categoryId}`,
      );

      if (response.data.success) {
        setConfigFiles(response.data.data || []);
      }

      if (!response.data.data.length) {
        toast.warn("No configuration files found", {
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
    } catch (error) {
      console.error("Failed to fetch configuration files:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch configuration files",
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
    fetchConfigFiles(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="config-files-container">
      <PageHeader />
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Configuration Files</div>
          <div className="page-content-header-subtitle">
            Store your configuration files
          </div>
        </div>
        <div className="page-content-header-actions">
          <button
            className="add-item"
            onClick={() => navigate("/config-files/add-file")}
          >
            + Add file
          </button>
        </div>
      </div>
      <div className="search-input">
        <Search size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search configuration file"
        />
      </div>

      <CategoryTab
        module="configs"
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ConfigFilesList
        configFiles={configFiles}
        loading={loading}
        onDelete={() => fetchConfigFiles(selectedCategory)}
        theme={theme}
      />
    </div>
  );
};

export default ConfigFiles;
