import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { post_package } from "../requests.js";

function Shipping() {
  let navigate = useNavigate();
  const [volume, setVolume] = useState('');
  const [weight, setWeight] = useState('');
  const [startingCountry, setStartingCountry] = useState('');
  const [startingCity, setStartingCity] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [destinationCity, setDestinationCity] = useState('');

  const addPackageHandler = async (event) => {
    event.preventDefault();
    let path = `/delivery`;
    await post_package(weight, volume, startingCountry, startingCity, destinationCountry, destinationCity)
    .then((response) => {
      navigate(path, {state: response})
    })
  };

  return (
    <div className="container">
      <h1>Shipping Details</h1>
      <form onSubmit={addPackageHandler}>
        <label htmlFor="volume">Volume:</label>
        <input
          type="text"
          id="volume"
          name="volume"
          placeholder="Enter volume in cubic meters"
          value={volume}
          onChange={(event) => setVolume(event.target.value)}
          required
        /><br /><br />
        <label htmlFor="weight">Weight:</label>
        <input
          type="text"
          id="weight"
          name="weight"
          placeholder="Enter weight in kilograms"
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          required
        /><br /><br />
        <label htmlFor="starting-country">Starting Country:</label>
        <input
          type="text"
          id="starting-country"
          name="starting-country"
          placeholder="Enter starting country"
          value={startingCountry}
          onChange={(event) => setStartingCountry(event.target.value)}
          required
        /><br /><br />
        <label htmlFor="starting-city">Starting City:</label>
        <input
          type="text"
          id="starting-city"
          name="starting-city"
          placeholder="Enter starting city"
          value={startingCity}
          onChange={(event) => setStartingCity(event.target.value)}
          required
        /><br /><br />
        <label htmlFor="destination-country">Destination Country:</label>
        <input
          type="text"
          id="destination-country"
          name="destination-country"
          placeholder="Enter destination country"
          value={destinationCountry}
          onChange={(event) => setDestinationCountry(event.target.value)}
          required
        /><br /><br />
        <label htmlFor="destination-city">Destination City:</label>
        <input
          type="text"
          id="destination-city"
          name="destination-city"
          placeholder="Enter destination city"
          value={destinationCity}
          onChange={(event) => setDestinationCity(event.target.value)}
          required
        /><br /><br />
        <button 
          type="submit"
        >Get Delivery Details</button>
      </form>
    </div>
  );
}

export default Shipping; 

