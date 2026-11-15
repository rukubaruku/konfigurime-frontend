import PageHeader from "../PageHeader/PageHeader";
import ScriptForm from "./ScriptForm";
import axiosInstance from "../Utils/axiosInstance";

const AddScript = () => {
  const handleCreate = (data) => {
    try {
    } catch (error) {}
    return axiosInstance.post("/scripts/new/script", data);
  };

  return (
    <div className="add-script">
      <PageHeader />
      <ScriptForm mode="add" onSubmit={handleCreate} />
    </div>
  );
};

export default AddScript;
