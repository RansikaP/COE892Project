import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { put_package } from "../requests.js";

function Update() {
    let navigate = useNavigate();
  const [packageid, setPackageID] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    let path = `/delivery`;
    await put_package(packageid, status)
    .then((response) => {
      console.log("Response")
    })
    navigate(path, {state: packageid});
  };

  return (
    <div className="container">
      <h1>Shipping Details Update</h1>
      <form onSubmit={handleSubmit}>
      <label htmlFor="packageid">Package ID:</label>
        <input
          type="text"
          id="packageid"
          name="packageid"
          placeholder={"Enter Package ID"}
          value={packageid}
          onChange={(event) => setPackageID(event.target.value)}
          required
        /><br /><br />
        <label htmlFor="status">Status:</label>
        <input
          type="text"
          id="status"
          name="status"
          placeholder={"Enter New Status"}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        /><br /><br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default Update;