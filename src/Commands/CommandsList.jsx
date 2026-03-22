import CommandItem from "./CommandItem";

const CommandsList = ({
  commands,
  loading,
  setEditingCommandID,
  onDelete,
  theme,
}) => {
  if (loading)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );
  if (!commands.length)
    return <div className="no-data">No commands found!</div>;
  return (
    <div className="items-list">
      {commands.map((command) => (
        <CommandItem
          key={command.id}
          command={command}
          setEditingCommandID={setEditingCommandID}
          onDelete={onDelete}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default CommandsList;
