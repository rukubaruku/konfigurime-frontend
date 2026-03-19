import ScriptItem from "./ScriptItem";

const ScriptsList = ({ scripts, loading, setEditingScriptID, onDelete }) => {
  console.log(scripts);

  if (loading)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );
  if (!scripts.length) return <div className="no-data">No scripts found!</div>;
  return (
    <div className="script-list">
      {scripts.map((script) => (
        <ScriptItem
          key={script.id}
          script={script}
          setEditingScriptID={setEditingScriptID}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ScriptsList;
