import PageHeader from "../PageHeader/PageHeader";
import ScriptForm from "./ScriptForm";
import axios from "axios";

const AddScript = () => {
  const handleCreate = (data) => {
    try {
    } catch (error) {}
    return axios.post(
      "https://konfigurime-api.arkiva.gov.al/scripts/new/script",
      data,
    );
  };

  return (
    <div className="add-script">
      <PageHeader />
      <ScriptForm mode="add" onSubmit={handleCreate} />
    </div>
  );
};

export default AddScript;
