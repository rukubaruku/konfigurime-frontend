import { useState } from "react";
import CredentialItem from "./CredentialItem";
import "./credentials.css";
import AddCredential from "./AddCredential";
import NotFound from "../NotFound/NotFound";

const CredentialsList = ({
  credentials,
  loading,
  setEditingCredentialID,
  onDelete,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleNotFoundAction = () => {
    setAddModalOpen(true);
  };

  if (loading)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );

  return (
    <>
      <div className="credentials-list">
        {credentials.length ? (
          credentials.map((cred) => (
            <CredentialItem
              key={cred.id}
              credential={cred}
              setEditingCredentialID={setEditingCredentialID}
              onDelete={onDelete}
            />
          ))
        ) : (
          <NotFound menu="credentials" onAction={handleNotFoundAction} />
        )}
      </div>

      <AddCredential
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => console.log("Credential added")}
        theme="light"
      />
    </>
  );
};

export default CredentialsList;
