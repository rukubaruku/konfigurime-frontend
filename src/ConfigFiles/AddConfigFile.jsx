import PageHeader from "../PageHeader/PageHeader";
import axios from "axios";
import ConfigFileForm from "./ConfigFileForm";

const AddConfigFile = () => {
  const handleCreate = (data) => {
    try {
    } catch (error) {}
    return axios.post("http://localhost:3109/config-files/new/file", data);
  };

  return (
    <div className="add-config0file">
      <PageHeader />
      <ConfigFileForm mode="add" onSubmit={handleCreate} />
    </div>
  );
};

export default AddConfigFile;
