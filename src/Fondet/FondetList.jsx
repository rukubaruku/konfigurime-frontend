import React from "react";
import "./fondet.css";
const FondetList = ({ results }) => {
  return (
    <div className="fondet-list">
      {results.map((item) => (
        <div key={item._id} className="fond-item">
          <div className="item-fullPath">{item.fullPath}</div>
          {item.date && <div className="item-meta">Date: {item.date}</div>}
          {item.fond && <div className="item-meta">Fond: {item.fond}</div>}
          {item.year && <div className="item-meta">Year: {item.year}</div>}
          {item.file && <div className="item-meta">File: {item.file}</div>}
        </div>
      ))}
    </div>
  );
};

export default FondetList;
