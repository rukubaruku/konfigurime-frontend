import PageHeader from "../PageHeader/PageHeader";
import axiosInstance from "../Utils/axiosInstance";
import ConfigFileForm from "./ConfigFileForm";

const AddConfigFile = () => {
  const handleCreate = (data) => {
    try {
    } catch (error) {}
    return axiosInstance.post("/config-files/new/file", data);
  };

  return (
    <div className="add-config0file">
      <PageHeader />
      <ConfigFileForm mode="add" onSubmit={handleCreate} />
    </div>
  );
};

export default AddConfigFile;
