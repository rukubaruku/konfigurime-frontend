import PageHeader from "../PageHeader/PageHeader";
import ScriptForm from "./ScriptForm";
import axios from "axios";

const AddScript = () => {
  const handleCreate = (data) => {
    try {
    } catch (error) {}
    return axios.post("http://localhost:3109/scripts/new/script", data);
  };

  return (
    <div className="add-script">
      <PageHeader />
      <ScriptForm mode="add" onSubmit={handleCreate} />
    </div>
  );
};

export default AddScript;
