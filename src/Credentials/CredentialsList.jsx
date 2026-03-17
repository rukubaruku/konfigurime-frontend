import CredentialItem from "./CredentialItem";
import "./credentials.css";
const CredentialsList = ({
  credentials,
  loading,
  setEditingCredentialID,
  onDelete,
}) => {
  if (loading)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );
  if (!credentials.length)
    return <div className="no-data">No credentials found!</div>;

  return (
    <div className="credentials-list">
      {credentials.map((cred) => (
        <CredentialItem
          key={cred.id}
          credential={cred}
          setEditingCredentialID={setEditingCredentialID}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CredentialsList;
