import axios from "axios";
import { useEffect, useState } from "react";
import "./categoryTab.css";
import { Bounce, toast } from "react-toastify";

const CategoryTab = ({ module, selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = localStorage.getItem("theme");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://konfigurime-api.arkiva.gov.al/category/module",
        { module },
      );

      if (response.status === 200) {
        const formattedCategories = response.data.data.map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name,
        }));

        if (!formattedCategories.length) {
          toast.warn("No categories found", {
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

        setCategories([{ id: "all", name: "All" }, ...formattedCategories]);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [module]);

  return (
    <div className="categories-tabs">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      {categories.map((category) => {
        const isActive = String(selectedCategory) === String(category.id);
        return (
          <div
            key={category.id}
            className={`category-tab ${isActive ? "active" : ""}`}
            onClick={() => setSelectedCategory(String(category.id))}
          >
            {category.name}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryTab;
