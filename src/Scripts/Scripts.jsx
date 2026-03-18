import { useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import "./scripts.css";
import { Search } from "lucide-react";
import CategoryTab from "../CategoryTab/CategoryTab";
const Scripts = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="scripts-container">
      <PageHeader />

      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Scripts</div>
          <div className="page-content-header-subtitle">
            Manage your reusable code snippets
          </div>
        </div>
        <div className="page-content-header-actions">
          <button className="add-item" onClick={() => setIsAddModalOpen(true)}>
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
    </div>
  );
};

export default Scripts;
