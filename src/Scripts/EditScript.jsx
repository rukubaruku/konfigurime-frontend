import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import ScriptForm from "./ScriptForm";
import { Bounce, toast } from "react-toastify";

const EditScript = () => {
  const { id } = useParams();
  const [script, setScript] = useState(null);
  const theme = localStorage.getItem("theme");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScript = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://konfigurime-api.arkiva.gov.al:3109/scripts/${id}`,
        );
        if (response.data.success) {
          setScript(response.data.script);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch script", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme,
          transition: Bounce,
        });
      } finally {
        setLoading(false);
      }
    };

    if (!id) return;

    fetchScript();
  }, [id]);

  const handleUpdate = (data) => {
    return axios.put(
      `https://konfigurime-api.arkiva.gov.al:3109/scripts/${id}`,
      data,
    );
  };

  if (!script)
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
      <ScriptForm
        mode="edit"
        initialData={{
          category: script.category?._id || script.category,
          language: script.language,
          title: script.title,
          description: script.description,
          code: script.code,
        }}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditScript;
