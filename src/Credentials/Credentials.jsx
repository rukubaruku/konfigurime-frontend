import PageHeader from "../PageHeader/PageHeader";
import "./credentials.css";
const Credentials = () => {
  return (
    <div className="credentials-container">
      <PageHeader />

      <div className="page-content-header">
        <div className="page-content-header-titles">
          <div className="page-content-header-title">Credentials</div>
          <div className="page-content-header-subtitle">
            Manage your stored credentials
          </div>
        </div>
        <div className="page-content-header-actions">
          <button className="add-category">+ Category</button>
          <button className="add-item">+ Add Credential</button>
        </div>
      </div>
      <div class="search-wrapper">
        <span class="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#888" stroke-width="2" />
            <line
              x1="16.5"
              y1="16.5"
              x2="21"
              y2="21"
              stroke="#888"
              stroke-width="2"
            />
          </svg>
        </span>
        <input type="text" placeholder="Search credentials..." />
      </div>
    </div>
  );
};

export default Credentials;
