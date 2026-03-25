import { useNavigate } from "react-router-dom";
import NotFound from "../NotFound.jsx/NotFound";
import ConfigFileItem from "./ConfigFileItem";

const ConfigFilesList = ({
  configFiles,
  loading,
  setEditingConfigFileID,
  onDelete,
  theme,
}) => {
  const navigate = useNavigate();

  const handleNotFoundAction = () => {
    navigate("/config-files/add-file");
  };
  return (
    <div className="items-list">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      {configFiles.length ? (
        configFiles.map((file) => (
          <ConfigFileItem
            key={file.id}
            configFile={file}
            setEditingConfigFileID={setEditingConfigFileID}
            onDelete={onDelete}
            theme={theme}
          />
        ))
      ) : (
        <NotFound menu="configFiles" onAction={handleNotFoundAction} />
      )}
    </div>
  );
};

export default ConfigFilesList;
