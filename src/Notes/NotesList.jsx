import NoteItem from "./NoteItem";

const NotesList = ({ notes, loading, onDelete, theme }) => {
  if (loading)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );

  if (!notes.length) return <div className="no-data">No notes found!</div>;

  return (
    <div className="items-list">
      {notes.map((note) => (
        <NoteItem
          key={note._id}
          note={note}
          onDelete={onDelete}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default NotesList;
