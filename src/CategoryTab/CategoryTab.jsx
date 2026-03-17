import axios from "axios";
import { useEffect, useState } from "react";
import "./categoryTab.css";

const CategoryTab = ({ module, selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3109/category/categories/module",
        { module },
      );

      if (response.status === 200) {
        const formattedCategories = response.data.data.map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name,
        }));
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
  }, []);

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
