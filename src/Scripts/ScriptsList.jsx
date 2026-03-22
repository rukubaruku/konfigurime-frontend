import ScriptItem from "./ScriptItem";

const ScriptsList = ({
  scripts,
  loading,
  setEditingScriptID,
  onDelete,
  theme,
}) => {
  if (loading)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );
  if (!scripts.length) return <div className="no-data">No scripts found!</div>;
  return (
    <div className="items-list">
      {scripts.map((script) => (
        <ScriptItem
          key={script.id}
          script={script}
          setEditingScriptID={setEditingScriptID}
          onDelete={onDelete}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default ScriptsList;
