import axios from "axios";
import { Tag, SquarePen, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { Bounce, toast } from "react-toastify";
import "./configurations.css";
const Categories = () => {
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modules, setModules] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3109/category/categories",
      );
      if (response.data.success) {
        const categoriesData = response.data.data;
        const grouped = categoriesData.reduce((acc, category) => {
          const moduleName = category.module?.name || "Unknown";
          if (!acc[moduleName]) acc[moduleName] = [];
          acc[moduleName].push(category);
          return acc;
        }, {});
        setCategories(grouped);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
        transition: Bounce,
      });
      console.log("Error fetching categories:", error);
    }
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3109/module/modules");
      if (response.data.success) {
        setModules(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching modules:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchModules();
  }, []);

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setCategoryName("");
    setSelectedModule(modules.length ? modules[0]._id : "");
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setSelectedModule(category.module?._id || "");
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentCategory(null);
    setCategoryName("");
    setSelectedModule("");
    setIsEditing(false);
  };

  const moduleDisplayNames = {
    credentials: "Credentials",
    scripts: "Scripts",
    queries: "Queries",
    configs: "Configuration Files",
    notes: "Notes",
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:3109/category/${categoryId}`,
      );
      if (response.data.success) {
        setCategories((prev) => {
          const updated = { ...prev };
          for (let key in updated) {
            updated[key] = updated[key].filter((c) => c._id !== categoryId);
          }
          return updated;
        });
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme,
          transition: Bounce,
        });
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
        transition: Bounce,
      });
      console.log("Failed to delete category:", error);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return alert("Name cannot be empty");

    try {
      setLoading(true);
      if (isEditing && currentCategory) {
        const response = await axios.put(
          `http://localhost:3109/category/${currentCategory._id}`,
          { name: categoryName },
        );
        if (response.data.success) {
          setCategories((prev) => {
            const updated = { ...prev };
            for (let key in updated) {
              updated[key] = updated[key].map((c) =>
                c._id === currentCategory._id
                  ? { ...c, name: categoryName }
                  : c,
              );
            }
            return updated;
          });
          toast.success(response?.data?.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme,
            transition: Bounce,
          });
          handleCloseModal();
        }
      } else {
        const response = await axios.post("http://localhost:3109/category", {
          name: categoryName,
          moduleId: selectedModule,
        });
        if (response.data.success) {
          const newCat = response.data.data;
          const moduleName = newCat.module.name;
          setCategories((prev) => ({
            ...prev,
            [moduleName]: prev[moduleName]
              ? [...prev[moduleName], newCat]
              : [newCat],
          }));
          toast.success(response?.data?.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme,
            transition: Bounce,
          });
          handleCloseModal();
        }
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
        transition: Bounce,
      });
      console.log("Failed to save category:", error);
    }
  };
  return (
    <div className="configuration-categories">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={isEditing ? "Edit Category" : "Add Category"}
      >
        {!isEditing && (
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            {modules.map((mod) => (
              <option key={mod._id} value={mod._id}>
                {moduleDisplayNames[mod.name] || mod.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
        />

        <div className="modal-buttons">
          <button onClick={handleSaveCategory}>
            {isEditing ? "Save" : "Add"}
          </button>
          <button onClick={handleCloseModal}>Cancel</button>
        </div>
      </Modal>
      <div className="configuration-categories-header">
        <div className="configuration-categories-title">
          <Tag size={22} /> Manage Categories
        </div>
        <div
          className="configuration-categories-action-btn"
          onClick={handleAddCategory}
        >
          + Add Category
        </div>
      </div>

      <div className="configuration-categories-content">
        {Object.entries(categories).map(([moduleName, cats]) => (
          <div className="configuration-categories-section" key={moduleName}>
            <div className="configuration-categories-section-title">
              {moduleDisplayNames[moduleName] || moduleName}
            </div>

            <div className="configuration-categories-section-cats">
              {cats.map((cat) => (
                <div className="configuration-category-item" key={cat._id}>
                  <span className="configuration-category-item-title">
                    {cat.name}
                  </span>
                  <div className="configuration-category-actions">
                    <div className="edit-btn">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditCategory(cat)}
                      >
                        <SquarePen size={20} />
                      </button>
                    </div>
                    <div className="delete-btn">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCategory(cat._id)}
                      >
                        <Trash2Icon size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
