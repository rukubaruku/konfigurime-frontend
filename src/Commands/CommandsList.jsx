import { useState } from "react";
import CommandItem from "./CommandItem";
import AddCommand from "./AddCommand";
import NotFound from "../NotFound/NotFound";

const CommandsList = ({
  commands,
  loading,
  setEditingCommandID,
  onDelete,
  theme,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleNotFoundAction = () => {
    setAddModalOpen(true);
  };

  return (
    <>
      <div className="commands-list">
        {loading && (
          <div className="overlay">
            <div className="spinner"></div>
          </div>
        )}

        {commands.length ? (
          commands.map((command) => (
            <CommandItem
              key={command.id}
              command={command}
              setEditingCommandID={setEditingCommandID}
              onDelete={onDelete}
              theme={theme}
            />
          ))
        ) : (
          <NotFound menu="commands" onAction={handleNotFoundAction} />
        )}
      </div>

      <AddCommand
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => console.log("Command added")}
        theme={theme}
      />
    </>
  );
};

export default CommandsList;
