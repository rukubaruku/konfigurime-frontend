import axios from "axios";
import { FileTerminal, Copy, Pencil, Trash2, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const ScriptItem = ({ script, setEditingScriptID, onDelete }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3109/category/module",
        "scripts",
      );

      if (response.status === 200) {
        const formattedCategories = response.data.data.map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name,
        }));
        setCategories(formattedCategories);
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

  const categoryName = categories.find(
    (c) => c.id === String(script.category),
  )?.name;

  return (
    <div className="script-item">
      <div className="script-item-header">
        <div className="script-item-header-icon">
          <FileTerminal size={24} />
        </div>
        <div className="script-item-header-info">
          <div className="script-item-header-info-title">{script.title}</div>
          <div className="script-item-header-info-data">
            <div className="script-item-header-info-data-category">
              {categoryName || "Unknown"}
            </div>
            <div className="script-item-header-info-data-language">
              {script.language}
            </div>
          </div>
        </div>
        <div className="script-item-header-actions">
          <Copy size={20} />
          <Pencil size={20} onClick={() => setEditingScriptID(script.id)} />
          <Trash2 size={20} />
          <ChevronDown size={20} onClick={() => setShowCode(!showCode)} />
        </div>
      </div>
      <div className="script-item-description">{script.description}</div>
      {showCode && <div className="script-item-code">{script.code}</div>}
    </div>
  );
};

export default ScriptItem;
