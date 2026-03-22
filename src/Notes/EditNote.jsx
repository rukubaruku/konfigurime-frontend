import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import NoteForm from "./NoteForm";
import { Bounce, toast } from "react-toastify";

const EditNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const theme = localStorage.getItem("theme");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://konfigurime-api.arkiva.gov.al:3109/notes/${id}`,
        );

        if (res.data.success) {
          setNote(res.data.note);
        }
      } catch (err) {
        toast.error("Failed to fetch note", {
          theme,
          transition: Bounce,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNote();
  }, [id]);

  const handleUpdate = (data) => {
    return axios.put(
      `https://konfigurime-api.arkiva.gov.al:3109/notes/${id}`,
      data,
    );
  };

  if (!note)
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="add-script">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <PageHeader />

      <NoteForm
        mode="edit"
        initialData={{
          category: note.category?._id || note.category,
          title: note.title,
          description: note.description,
          content: note.content,
        }}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditNote;
