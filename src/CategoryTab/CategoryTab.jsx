import axiosInstance from "../Utils/axiosInstance";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Folder, Search, X } from "lucide-react";
import { Bounce, toast } from "react-toastify";
import "./categoryTab.css";

const storageKey = (module) => `category:${module}`;

const normalize = (text) =>
  String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Searchable category picker (combobox). Same props as the old tab bar, so
 * every page keeps working: type to filter, arrow keys + Enter to choose,
 * Esc to close. The last chosen category is remembered per module.
 */
const CategoryTab = ({ module, selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/category/module", {
          module,
        });
        if (cancelled || response.status !== 200) return;

        const formatted = response.data.data.map((c) => ({
          id: String(c.id ?? c._id),
          name: c.name,
        }));

        if (!formatted.length) {
          toast.warn("No categories found", { theme, transition: Bounce });
        }
        setCategories(formatted);

        // Restore the last category used on this page
        let saved = null;
        try {
          saved = localStorage.getItem(storageKey(module));
        } catch {}
        if (saved && formatted.some((c) => c.id === saved)) {
          setSelectedCategory(saved);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategories();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);

  const options = useMemo(() => {
    const all = [{ id: "all", name: "All categories" }, ...categories];
    const q = normalize(query.trim());
    if (!q) return all;
    return categories.filter((c) => normalize(c.name).includes(q));
  }, [categories, query]);

  const selected =
    categories.find((c) => c.id === String(selectedCategory)) || null;

  const choose = (id) => {
    setSelectedCategory(String(id));
    try {
      if (id === "all") localStorage.removeItem(storageKey(module));
      else localStorage.setItem(storageKey(module), String(id));
    } catch {}
    setOpen(false);
    setQuery("");
  };

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex(
        (o) => o.id === String(selectedCategory || "all"),
      );
      setHighlight(idx >= 0 ? idx : 0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[highlight];
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[highlight]) choose(options[highlight].id);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="category-picker" ref={rootRef}>
      <button
        type="button"
        className={`category-picker-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={loading}
      >
        <Folder size={18} className="category-picker-icon" />
        <span className="category-picker-label">Category</span>
        <span className="category-picker-value">
          {loading ? "Loading…" : selected ? selected.name : "All categories"}
        </span>
        <ChevronDown size={18} className="category-picker-chevron" />
      </button>

      {selected && (
        <button
          type="button"
          className="category-picker-clear"
          onClick={() => choose("all")}
          title="Show all categories"
        >
          <X size={16} />
        </button>
      )}

      {open && (
        <div className="category-picker-popover" role="dialog">
          <div className="category-picker-search">
            <Search size={16} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Search ${categories.length} categories…`}
            />
          </div>
          <ul className="category-picker-list" role="listbox" ref={listRef}>
            {options.length === 0 && (
              <li className="category-picker-empty">No matching category</li>
            )}
            {options.map((c, i) => {
              const isSelected = String(selectedCategory || "all") === c.id;
              return (
                <li
                  key={c.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`category-picker-option ${
                    i === highlight ? "highlighted" : ""
                  } ${isSelected ? "selected" : ""} ${
                    c.id === "all" ? "all" : ""
                  }`}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(c.id)}
                >
                  <span>{c.name}</span>
                  {isSelected && <Check size={16} />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryTab;
