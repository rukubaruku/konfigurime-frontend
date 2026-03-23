import { useState } from "react";
import PageHeader from "../PageHeader/PageHeader";
import "./configurations.css";
import General from "./General";
import Categories from "./Categories";
import Security from "./Security";

const Configurations = () => {
  const [tabActive, setTabActive] = useState("general");
  return (
    <div className="configurations">
      <PageHeader />

      <div className="configurations-container">
        <div className="configurations-header">
          <div className="configurations-title">Configurations</div>
          <div className="configurations-subtitle">
            Manage your account and preferences
          </div>
        </div>

        <div className="configurations-tabs">
          <div
            className={`configuration-tab ${tabActive === "general" ? "active" : ""}`}
            onClick={() => setTabActive("general")}
          >
            General
          </div>
          <div
            className={`configuration-tab ${tabActive === "categories" ? "active" : ""}`}
            onClick={() => setTabActive("categories")}
          >
            Categories
          </div>
          <div
            className={`configuration-tab ${tabActive === "security" ? "active" : ""}`}
            onClick={() => setTabActive("security")}
          >
            Profile
          </div>
        </div>

        <div className="configurations-content">
          {tabActive === "general" && <General />}

          {tabActive === "categories" && <Categories />}

          {tabActive === "security" && <Security />}
        </div>
      </div>
    </div>
  );
};

export default Configurations;
