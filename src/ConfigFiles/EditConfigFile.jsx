import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import { Bounce, toast } from "react-toastify";
import ConfigFileForm from "./ConfigFileForm";

const EditConfigFile = () => {
  const { id } = useParams();
  const [configFile, setConfigFile] = useState(null);
  const theme = localStorage.getItem("theme");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfigFile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://konfigurime-api.arkiva.gov.al:3109/config-files/${id}`,
        );
        if (response.data.success) {
          setConfigFile(response.data.configFile);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch configuration file",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme,
            transition: Bounce,
          },
        );
      } finally {
        setLoading(false);
      }
    };

    if (!id) return;

    fetchConfigFile();
  }, [id]);

  const handleUpdate = (data) => {
    return axios.put(
      `https://konfigurime-api.arkiva.gov.al:3109/config-files/${id}`,
      data,
    );
  };

  if (!configFile)
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
      <ConfigFileForm
        mode="edit"
        initialData={{
          category: configFile.category?._id || configFile.category,
          title: configFile.title,
          description: configFile.description,
          code: configFile.code,
        }}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditConfigFile;
