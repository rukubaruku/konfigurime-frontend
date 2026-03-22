import { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import CategoryTab from "../CategoryTab/CategoryTab";
import { Search } from "lucide-react";
import { Bounce, toast } from "react-toastify";
import CommandsList from "./CommandsList";
import AddCommand from "./AddCommand";
import EditCommand from "./EditCommand";

const Commands = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCommandID, setEditingCommandID] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchCommands = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3109/commands/${categoryId}`,
      );
      if (response.status === 200) {
        setCommands(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch commands:", error);
      toast.error(error.response?.data?.message || "Failed to fetch commands", {
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
    fetchCommands(selectedCategory);
  }, [selectedCategory]);

  const filteredCommands = commands.filter((command) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [command.title, command.username]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <div className="commands-container">
      <PageHeader />
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Commands</div>
          <div className="page-content-header-subtitle">
            Manage your reusable code commands
          </div>
        </div>
        <div className="page-content-header-actions">
          <button className="add-item" onClick={() => setIsAddModalOpen(true)}>
            + Add Command
          </button>
        </div>
      </div>

      <div className="search-input">
        <Search size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search command"
        />
      </div>

      <CategoryTab
        module="commands"
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <CommandsList
        commands={filteredCommands}
        loading={loading}
        setEditingCommandID={setEditingCommandID}
        onDelete={() => fetchCommands(selectedCategory)}
      />

      <AddCommand
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchCommands(selectedCategory)}
        theme={theme}
      />

      <EditCommand
        commandId={editingCommandID}
        onClose={() => setEditingCommandID(null)}
        onSuccess={() => fetchCommands(selectedCategory)}
        theme={theme}
      />
    </div>
  );
};

export default Commands;
