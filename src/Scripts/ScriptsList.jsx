import { useNavigate } from "react-router-dom";
import ScriptItem from "./ScriptItem";
import NotFound from "../NotFound.jsx/NotFound";

const ScriptsList = ({
  scripts,
  loading,
  setEditingScriptID,
  onDelete,
  theme,
}) => {
  const navigate = useNavigate();

  const handleNotFoundAction = () => {
    navigate("/scripts/add-script");
  };

  return (
    <div className="scripts-list">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      {scripts.length ? (
        scripts.map((script) => (
          <ScriptItem
            key={script.id}
            script={script}
            setEditingScriptID={setEditingScriptID}
            onDelete={onDelete}
            theme={theme}
          />
        ))
      ) : (
        <NotFound menu="scripts" onAction={handleNotFoundAction} />
      )}
    </div>
  );
};

export default ScriptsList;
