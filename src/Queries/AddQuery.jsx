import PageHeader from "../PageHeader/PageHeader";
import QueryForm from "./QueryForm";
import axios from "axios";

const AddQuery = () => {
  const handleCreate = (data) => {
    try {
    } catch (error) {}
    return axios.post("http://localhost:3109/queries/new/query", data);
  };

  return (
    <div className="add-query">
      <PageHeader />
      <QueryForm mode="add" onSubmit={handleCreate} />
    </div>
  );
};

export default AddQuery;
