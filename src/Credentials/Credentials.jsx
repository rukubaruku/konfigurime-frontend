import { useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import Modal from "../Modal/Modal";
import "./credentials.css";

const Credentials = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleCreateCategory = () => {
    console.log("New Category:", categoryName);
    setCategoryName("");
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="credentials-container">
      <PageHeader />

      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Credentials</div>
          <div className="page-content-header-subtitle">
            Manage your stored credentials
          </div>
        </div>

        <div className="page-content-header-actions">
          <button
            className="add-category"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            + Category
          </button>
          <button className="add-item">+ Add Credential</button>
        </div>
      </div>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create Category"
      >
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <button onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
          <button onClick={handleCreateCategory}>Create</button>
        </div>
      </Modal>
    </div>
  );
};

export default Credentials;
