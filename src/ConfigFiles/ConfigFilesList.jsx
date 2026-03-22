import ConfigFileItem from "./ConfigFileItem";

const ConfigFilesList = ({
  configFiles,
  loading,
  setEditingConfigFileID,
  onDelete,
  theme,
}) => {
  if (loading)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );
  if (!configFiles.length)
    return <div className="no-data">No configuration files found!</div>;
  return (
    <div className="items-list">
      {configFiles.map((file) => (
        <ConfigFileItem
          key={file.id}
          configFile={file}
          setEditingConfigFileID={setEditingConfigFileID}
          onDelete={onDelete}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default ConfigFilesList;
