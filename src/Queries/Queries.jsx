import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import "./queries.css";
import { Search } from "lucide-react";
import CategoryTab from "../CategoryTab/CategoryTab";
import axiosInstance from "../Utils/axiosInstance";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import QueriesList from "./QueriesList";

const Queries = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [queries, setQueries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchQueries = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/queries/${categoryId}`);

      if (response.data.success) {
        const data = response.data.data || [];
        setQueries(data);

        if (data.length === 0) {
          toast.warn("No queries found", {
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
      console.error("Failed to fetch queries:", error);
      toast.error(error.response?.data?.message || "Failed to fetch queries", {
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

  useEffect(() => {
    fetchQueries(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="queries-container">
      <PageHeader />
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Queries</div>
          <div className="page-content-header-subtitle">
            Store your database queries
          </div>
        </div>
        <div className="page-content-header-actions">
          <button
            className="add-item"
            onClick={() => navigate("/queries/add-query")}
          >
            + Add Query
          </button>
        </div>
      </div>
      <div className="search-input">
        <Search size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search query"
        />
      </div>

      <CategoryTab
        module="queries"
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <QueriesList
        queries={queries}
        loading={loading}
        onDelete={() => fetchQueries(selectedCategory)}
        theme={theme}
      />
    </div>
  );
};

export default Queries;
