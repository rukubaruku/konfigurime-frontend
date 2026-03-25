import { useNavigate } from "react-router-dom";
import QueryItem from "./QueryItem";
import NotFound from "../NotFound.jsx/NotFound";

const QueriesList = ({
  queries,
  loading,
  setEditingQueryID,
  onDelete,
  theme,
}) => {
  const navigate = useNavigate();

  const handleNotFoundAction = () => {
    navigate("/queries/add-query");
  };

  return (
    <div className="queries-list">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      {queries.length ? (
        queries.map((query) => (
          <QueryItem
            key={query.id}
            query={query}
            setEditingQueryID={setEditingQueryID}
            onDelete={onDelete}
            theme={theme}
          />
        ))
      ) : (
        <NotFound menu="queries" onAction={handleNotFoundAction} />
      )}
    </div>
  );
};

export default QueriesList;
