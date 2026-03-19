import axios from "axios";
import {
  FileTerminal,
  Copy,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Code,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

const ScriptItem = ({ script, setEditingScriptID, onDelete, theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const module = "scripts";
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3109/category/module",
        { module },
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

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme,
        transition: Bounce,
      });
      console.log("Copied!");
    } catch (err) {
      toast.error("Failed to copy!", {
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
  };

  return (
    <div className="script-item">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="script-item-header">
        <div className="script-item-header-content">
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
        </div>
        <div className="script-item-header-actions">
          <button
            className="script-item-header-action copy"
            onClick={() => handleCopy(script.code)}
          >
            <Copy size={18} />
          </button>

          <button className="script-item-header-action edit">
            <Pencil size={18} onClick={() => setEditingScriptID(script.id)} />
          </button>
          <button className="script-item-header-action delete">
            <Trash2 size={18} />
          </button>
          <button className="script-item-header-action show-code">
            {showCode ? (
              <ChevronUp size={18} onClick={() => setShowCode(!showCode)} />
            ) : (
              <ChevronDown size={18} onClick={() => setShowCode(!showCode)} />
            )}
          </button>
        </div>
      </div>
      <div className="script-item-description">{script.description}</div>
      {showCode && (
        <pre className="script-item-code">
          <div className="script-item-code-header">
            <div className="script-item-code-header-title">
              <Code size={18} /> {script.language}
            </div>
            <div
              className="script-item-code-header-action"
              onClick={() => handleCopy(script.code)}
            >
              <Copy size={18} /> Copy
            </div>
          </div>
          <div className="script-item-code-content">
            <code>{script.code}</code>
          </div>
        </pre>
      )}
    </div>
  );
};

export default ScriptItem;
