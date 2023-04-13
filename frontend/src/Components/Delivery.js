import './Delivery.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { get_package } from "../requests.js";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function Delivery() {
    let navigate = useNavigate();
    
    const [volume, setVolume] = useState();
    const [weight, setWeight] = useState();
    const [startingCountry, setStartingCountry] = useState("");
    const [startingCity, setStartingCity] = useState("");
    const [destinationCountry, setDestinationCountry] = useState("");
    const [destinationCity, setDestinationCity] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");
    const defaultCenter = {
      lat: 40.712776,
      lng: -74.005974
    };    
    const mapStyles = {
      height: "50vh",
      width: "100%"
    };

    function handleSubmit(event) {
      event.preventDefault();
      let path = `/`;
      navigate(path);
      // Handle submission logic here
      console.log("Package Status Requested:", packageid);
    }
    
    const { state } = useLocation();
    const packageid = state;

    get_package(state).then((response) => {
      setVolume(response.PackageInfo.volume)
      setWeight(response.PackageInfo.weight)
      setStartingCountry(response.PackageInfo.starting_country)
      setStartingCity(response.PackageInfo.starting_city)
      setDestinationCountry(response.PackageInfo.destination_country)
      setDestinationCity(response.PackageInfo.destination_city)
      setDate(response.PackageInfo.delivery_date)
      setStatus(response.PackageInfo.current_transport_status)
    })

  return (
    <div className="container">

      <h1>Package Details</h1>
      <p>
        <strong>Package ID:</strong> {packageid}
      </p>
      <p>
        <strong>Volume:</strong> {volume}
      </p>
      <p>
        <strong>Weight:</strong> {weight}
      </p>
      <p>
        <strong>Starting Country:</strong> {startingCountry}
      </p>
      <p>
        <strong>Starting City:</strong> {startingCity}
      </p>
      <p>
        <strong>Destination Country:</strong> {destinationCountry}
      </p>
      <p>
        <strong>Destination City:</strong> {destinationCity}
      </p>
      <p>
        <strong>Estimated Delivery Date:</strong> {date}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <LoadScript
      googleMapsApiKey="AIzaSyDRim0DfaDLjvMuqLNO1yy8wTWPnz4dVrA">
      <GoogleMap
        mapContainerStyle={mapStyles}
        center={defaultCenter}
        zoom={10}
        >
        </GoogleMap>
        </LoadScript>
      <form onSubmit={handleSubmit}>
      <button type="submit" className="package-status-button">
          Go Home
        </button>
      <div className="map-container">
      </div>
    </form>
    </div>
  );
}

export default Delivery;