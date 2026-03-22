import QueryItem from "./QueryItem";

const QueriesList = ({
  queries,
  loading,
  setEditingQueryID,
  onDelete,
  theme,
}) => {
  if (loading)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );
  if (!queries.length) return <div className="no-data">No queries found!</div>;
  return (
    <div className="items-list">
      {queries.map((query) => (
        <QueryItem
          key={query.id}
          query={query}
          setEditingQueryID={setEditingQueryID}
          onDelete={onDelete}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default QueriesList;
