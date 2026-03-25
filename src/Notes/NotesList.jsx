import { useNavigate } from "react-router-dom";
import NoteItem from "./NoteItem";
import NotFound from "../NotFound.jsx/NotFound";

const NotesList = ({ notes, loading, onDelete, theme }) => {
  const navigate = useNavigate();

  const handleNotFoundAction = () => {
    navigate("/notes/add-note");
  };
  return (
    <div className="notes-list">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      {notes.length ? (
        notes.map((note) => (
          <NoteItem
            key={note._id}
            note={note}
            onDelete={onDelete}
            theme={theme}
          />
        ))
      ) : (
        <NotFound menu="notes" onAction={handleNotFoundAction} />
      )}
    </div>
  );
};

export default NotesList;
