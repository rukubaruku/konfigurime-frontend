import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import "./fondet.css";

const FondetList = ({ results, total, limit }) => {
  if (!results.length) return null;

  const copyPath = async (path) => {
    try {
      await navigator.clipboard.writeText(path);
      toast.success("Path copied", { autoClose: 1500 });
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="fondet-results">
      <div className="fondet-summary">
        {total} result{total === 1 ? "" : "s"}
        {limit && total > results.length
          ? ` · showing the first ${results.length}, add the year or file to narrow down`
          : ""}
      </div>

      <div className="fondet-table-wrap">
        <table className="fondet-table">
          <thead>
            <tr>
              <th>Scan date</th>
              <th>Fond</th>
              <th>Year</th>
              <th>File</th>
              <th>Folder</th>
              <th>Full path</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item._id} className={item.recycled ? "recycled" : ""}>
                <td className="fondet-date">{item.scanDate || "—"}</td>
                <td>{item.fond || "—"}</td>
                <td>{item.year || "—"}</td>
                <td>{item.file || "—"}</td>
                <td>
                  {item.location || "—"}
                  {item.recycled && (
                    <span className="fondet-badge" title="Found in #recycle">
                      Recycle bin
                    </span>
                  )}
                </td>
                <td className="fondet-path">
                  <div>
                    <span>{item.fullPath}</span>
                    <button
                      className="fondet-copy"
                      title="Copy path"
                      onClick={() => copyPath(item.fullPath)}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FondetList;
