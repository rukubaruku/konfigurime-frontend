import PageHeader from "../PageHeader/PageHeader";
import NoteForm from "./NoteForm";
import axiosInstance from "../Utils/axiosInstance";

const AddNote = () => {
  const handleCreate = (data) => {
    return axiosInstance.post("/notes/new/note", data);
  };

  return (
    <div className="add-script">
      <PageHeader />
      <NoteForm mode="add" onSubmit={handleCreate} />
    </div>
  );
};

export default AddNote;
