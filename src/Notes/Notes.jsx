import { useEffect, useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import { Search } from "lucide-react";
import CategoryTab from "../CategoryTab/CategoryTab";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import NotesList from "./NotesList";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchNotes = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3109/notes/${categoryId}`,
      );

      if (response.data.success) {
        setNotes(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch notes", {
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
    fetchNotes(selectedCategory);
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
          <div className="page-content-header-title">Notes</div>
          <div className="page-content-header-subtitle">Manage your notes</div>
        </div>

        <div className="page-content-header-actions">
          <button
            className="add-item"
            onClick={() => navigate("/notes/add-note")}
          >
            + Add Note
          </button>
        </div>
      </div>

      <div className="search-input">
        <Search size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search note"
        />
      </div>

      <CategoryTab
        module="notes"
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <NotesList
        notes={notes}
        loading={loading}
        onDelete={() => fetchNotes(selectedCategory)}
        theme={theme}
      />
    </div>
  );
};

export default Notes;
