import axios from "axios";
import { Tag, SquarePen, Trash2Icon, GripVertical } from "lucide-react";
import {
  SortableContext,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { Bounce, toast } from "react-toastify";
import "./configurations.css";
import Popup from "reactjs-popup";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const API_URL = "https://konfigurime-api.arkiva.gov.al";

const moduleOrder = [
  "credentials",
  "commands",
  "scripts",
  "queries",
  "configs",
  "notes",
];

const moduleDisplayNames = {
  credentials: "Credentials",
  commands: "Commands",
  scripts: "Scripts",
  queries: "Queries",
  configs: "Configuration Files",
  notes: "Notes",
};

/* -----------------------------
   Sortable category item
----------------------------- */

const SortableCategoryItem = ({
  cat,
  handleEditCategory,
  handleDeleteCategory,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cat._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`configuration-category-item ${isDragging ? "dragging" : ""}`}
    >
      <button
        ref={setActivatorNodeRef}
        className="category-drag-handle"
        type="button"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        <GripVertical size={20} />
      </button>

      <span className="configuration-category-item-title">{cat.name}</span>

      <div className="configuration-category-actions">
        <button
          className="edit-btn"
          onClick={() => handleEditCategory(cat)}
          type="button"
          title="Edit category"
        >
          <SquarePen size={20} />
        </button>

        <Popup
          trigger={
            <button
              className="delete-btn"
              type="button"
              title="Delete category"
            >
              <Trash2Icon size={20} />
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="confirm-popup">
              <div className="confirm-popup-title">Confirm Delete</div>

              <div className="confirm-popup-text">
                Are you sure you want to delete the category{" "}
                <strong>"{cat.name}"</strong>?
              </div>

              <div className="confirm-actions">
                <button
                  className="popup-cancel-btn"
                  type="button"
                  onClick={close}
                >
                  Cancel
                </button>

                <button
                  className="popup-delete-btn"
                  type="button"
                  onClick={async () => {
                    await handleDeleteCategory(cat._id);
                    close();
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

/* -----------------------------
   Categories
----------------------------- */

const Categories = () => {
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState({});
  const [modules, setModules] = useState([]);

  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [theme, setTheme] = useState("light");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);

      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  /* -----------------------------
     Fetch categories
  ----------------------------- */

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/category/categories`);

      if (response.data.success) {
        const categoriesData = response.data.data
          .slice()
          .sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));

        const grouped = categoriesData.reduce((acc, category) => {
          const moduleName = category.module?.name || "Unknown";

          if (!acc[moduleName]) {
            acc[moduleName] = [];
          }

          acc[moduleName].push(category);

          return acc;
        }, {});

        setCategories(grouped);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);

      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        theme,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Fetch modules
  ----------------------------- */

  const fetchModules = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/module/modules`);

      if (response.data.success) {
        setModules(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching modules:", error);

      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        theme,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchModules();
  }, []);

  /* -----------------------------
     Modal
  ----------------------------- */

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setCategoryName("");
    setSelectedModule("");
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

  /* -----------------------------
     Save category
  ----------------------------- */

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty", {
        position: "top-right",
        theme,
        transition: Bounce,
      });

      return;
    }

    if (!isEditing && !selectedModule) {
      toast.error("Please select a module", {
        position: "top-right",
        theme,
        transition: Bounce,
      });

      return;
    }

    try {
      setLoading(true);

      if (isEditing && currentCategory) {
        const response = await axios.put(
          `${API_URL}/category/${currentCategory._id}`,
          {
            name: categoryName.trim(),
          },
        );

        if (response.data.success) {
          setCategories((prev) => {
            const updated = { ...prev };

            for (const key in updated) {
              updated[key] = updated[key].map((cat) =>
                cat._id === currentCategory._id
                  ? {
                      ...cat,
                      name: categoryName.trim(),
                    }
                  : cat,
              );
            }

            return updated;
          });

          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            theme,
            transition: Bounce,
          });

          handleCloseModal();
        }
      } else {
        const response = await axios.post(`${API_URL}/category`, {
          name: categoryName.trim(),
          moduleId: selectedModule,
        });

        if (response.data.success) {
          const newCategory = response.data.data;

          const moduleName = newCategory.module.name;

          setCategories((prev) => ({
            ...prev,

            [moduleName]: prev[moduleName]
              ? [...prev[moduleName], newCategory]
              : [newCategory],
          }));

          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            theme,
            transition: Bounce,
          });

          handleCloseModal();
        }
      }
    } catch (error) {
      console.log("Failed to save category:", error);

      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        theme,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Delete category
  ----------------------------- */

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);

      const response = await axios.delete(`${API_URL}/category/${categoryId}`);

      if (response.data.success) {
        /*
         * Backend recalculates sortOrder after delete.
         * Fetch again to keep frontend perfectly synced.
         */

        await fetchCategories();

        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          theme,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Failed to delete category:", error);

      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        theme,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Drag & Drop
  ----------------------------- */

  const handleDragEnd = async (event, moduleName) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    const currentCategories = categories[moduleName] || [];

    const oldIndex = currentCategories.findIndex(
      (category) => category._id === active.id,
    );

    const newIndex = currentCategories.findIndex(
      (category) => category._id === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousCategories = [...currentCategories];

    const reorderedCategories = arrayMove(
      currentCategories,
      oldIndex,
      newIndex,
    ).map((category, index) => ({
      ...category,
      sortOrder: index + 1,
    }));

    /*
     * Update frontend immediately.
     */

    setCategories((prev) => ({
      ...prev,
      [moduleName]: reorderedCategories,
    }));

    try {
      await axios.put(`${API_URL}/category/reorder/categories`, {
        categories: reorderedCategories.map((category) => ({
          id: category._id,
          sortOrder: category.sortOrder,
        })),
      });
    } catch (error) {
      console.log("Failed to reorder categories:", error);

      /*
       * Restore previous order if request fails.
       */

      setCategories((prev) => ({
        ...prev,
        [moduleName]: previousCategories,
      }));

      toast.error(
        error.response?.data?.message || "Failed to reorder categories",
        {
          position: "top-right",
          autoClose: 5000,
          theme,
          transition: Bounce,
        },
      );
    }
  };

  return (
    <div className="configuration-categories">
      {/* Loading */}

      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Add / Edit modal */}

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={isEditing ? "Edit Category" : "Add Category"}
      >
        <div className="form-container">
          {!isEditing && (
            <div className="form-group">
              <div className="form-label">Module</div>

              <div className="form-input">
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                >
                  <option value="" disabled>
                    Select a Module
                  </option>

                  {modules
                    .slice()
                    .sort(
                      (a, b) =>
                        moduleOrder.indexOf(a.name) -
                        moduleOrder.indexOf(b.name),
                    )
                    .map((module) => (
                      <option key={module._id} value={module._id}>
                        {moduleDisplayNames[module.name] || module.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="form-label">Category name</div>

            <div className="form-input">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveCategory();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="form-actions categories">
          <button
            onClick={handleSaveCategory}
            className="confirm-btn"
            type="button"
          >
            {isEditing ? "Save" : "Add"}
          </button>

          <button
            onClick={handleCloseModal}
            className="cancel-btn"
            type="button"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Header */}

      <div className="configuration-categories-header">
        <div className="configuration-categories-title">
          <Tag size={22} />

          <span>Manage Categories</span>
        </div>

        <button
          className="configuration-categories-action-btn"
          onClick={handleAddCategory}
          type="button"
        >
          + Add Category
        </button>
      </div>

      {/* Categories */}

      <div className="configuration-categories-content">
        {moduleOrder.map((moduleName) => {
          const cats = categories[moduleName];

          if (!cats || cats.length === 0) {
            return null;
          }

          return (
            <div className="configuration-categories-section" key={moduleName}>
              <div className="configuration-categories-section-title">
                {moduleDisplayNames[moduleName] || moduleName}

                <span className="configuration-categories-count">
                  {cats.length}
                </span>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, moduleName)}
              >
                <SortableContext
                  items={cats.map((cat) => cat._id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="configuration-categories-section-cats">
                    {cats.map((cat) => (
                      <SortableCategoryItem
                        key={cat._id}
                        cat={cat}
                        handleEditCategory={handleEditCategory}
                        handleDeleteCategory={handleDeleteCategory}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
