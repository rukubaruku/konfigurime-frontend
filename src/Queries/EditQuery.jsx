import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import PageHeader from "../PageHeader/PageHeader";
import { Bounce, toast } from "react-toastify";
import QueryForm from "./QueryForm";

const EditQuery = () => {
  const { id } = useParams();
  const [query, setQuery] = useState(null);
  const theme = localStorage.getItem("theme");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/queries/${id}`);
        if (response.data.success) {
          setQuery(response.data.query);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch query", {
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

    fetchQuery();
  }, [id]);

  const handleUpdate = (data) => {
    return axiosInstance.put(`/queries/${id}`, data);
  };

  if (!query)
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
      <QueryForm
        mode="edit"
        initialData={{
          category: query.category?._id || query.category,
          language: query.language,
          title: query.title,
          description: query.description,
          code: query.code,
        }}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditQuery;
