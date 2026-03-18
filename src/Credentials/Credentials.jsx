import { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import CategoryTab from "../CategoryTab/CategoryTab";
import { Search } from "lucide-react";
import "./credentials.css";
import CredentialsList from "./CredentialsList";
import { Bounce, toast } from "react-toastify";
import AddCredential from "./AddCredential";
import EditCredential from "./EditCredential";

const Credentials = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCredentialID, setEditingCredentialID] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchCredentials = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3109/credentials/${categoryId}`,
      );
      if (response.status === 200) {
        setCredentials(response.data.data);
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
    fetchCredentials(selectedCategory);
  }, [selectedCategory]);

  const filteredCredentials = credentials.filter((cred) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [cred.title, cred.username].join(" ").toLowerCase().includes(query);
  });

  return (
    <div className="credentials-container">
      <PageHeader />
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Credentials</div>
          <div className="page-content-header-subtitle">
            Manage your stored credentials
          </div>
        </div>
        <div className="page-content-header-actions">
          <button className="add-item" onClick={() => setIsAddModalOpen(true)}>
            + Add Credential
          </button>
        </div>
      </div>

      <div className="search-input">
        <Search size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search credential"
        />
      </div>

      <CategoryTab
        module="credentials"
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <CredentialsList
        credentials={filteredCredentials}
        loading={loading}
        setEditingCredentialID={setEditingCredentialID}
        onDelete={() => fetchCredentials(selectedCategory)}
      />

      <AddCredential
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchCredentials(selectedCategory)}
        theme={theme}
      />

      <EditCredential
        credentialId={editingCredentialID}
        onClose={() => setEditingCredentialID(null)}
        onSuccess={() => fetchCredentials(selectedCategory)}
        theme={theme}
      />
    </div>
  );
};

export default Credentials;
