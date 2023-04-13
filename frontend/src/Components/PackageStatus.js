import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PackageStatus.css";

function PackageStatus() {
  let navigate = useNavigate();
  const [packageId, setPackageId] = useState("");

  function handleInputChange(event) {
    setPackageId(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let path = `/delivery`;
    navigate(path, {state: packageId});
    // Handle submission logic here
    console.log("Submitted package ID:", packageId);
  }

  return (
    <div className="package-status-tile">
      <h1 className="package-status-title">Package Status</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter package ID"
          value={packageId}
          onChange={handleInputChange}
          className="package-status-input"
          required
        />
        <button type="submit" className="package-status-button">
          Submit
        </button>
      </form>
    </div>
  );
}


export default PackageStatus;

