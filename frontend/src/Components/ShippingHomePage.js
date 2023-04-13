import React from 'react';
import { useNavigate } from "react-router-dom";
import "./ShippingHomePage.css";

function ShippingHomePage() {
    let navigate = useNavigate();
    const shipping_route = () => {
        let path = `/shipping`;
        navigate(path);
      };
    const update = () => {
      let path = `/update`;
      navigate(path);
    };
    const delivery_route = () => {
      let path = `/packagestatus`;
      navigate(path);
    };
  return (
    <div className="shipping-homepage">
      <h1>Welcome to Global Shipping</h1>
      <button className="submit-shipment-button" onClick={shipping_route}>Submit Shipment</button>
      <button className="check-status-button"onClick={delivery_route} >Check Shipment Status</button>
      <button className="update-button"onClick={update} >Update Shipment Status</button>
    </div>
  );
}

export default ShippingHomePage;