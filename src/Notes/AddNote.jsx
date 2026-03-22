import PageHeader from "../PageHeader/PageHeader";
import NoteForm from "./NoteForm";
import axios from "axios";

const AddNote = () => {
  const handleCreate = (data) => {
    return axios.post(
      "https://konfigurime-api.arkiva.gov.al:3109/notes/new/note",
      data,
    );
  };

  return (
    <div className="add-script">
      <PageHeader />
      <NoteForm mode="add" onSubmit={handleCreate} />
    </div>
  );
};

export default AddNote;
