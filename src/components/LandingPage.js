import React, { useState, useEffect } from "react";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import '../styles/location.css';

const LandingPage = () => {
  const [locations, setLocations] = useState([]);
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || ""
  );
  const [selectedMeetingRoom, setSelectedMeetingRoom] = useState(
    localStorage.getItem("selectedMeetingRoom") || ""
  );
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetch("http://localhost:5000/locations/api/locations")
        .then((response) => {
          return response.json();
        })
        .then((data) => setLocations(data))
        .catch((error) => console.error("Error fetching locations:", error));
    }
  }, []);

  const handleLocationChange = async (locationId) => {
    setSelectedLocation(locationId);
    localStorage.setItem("selectedLocation", locationId);

    try {
      const response = await fetch(
        `http://localhost:5000/locations/api/meetingRooms?locationId=${locationId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMeetingRooms(data);
    } catch (error) {
      console.error("Error fetching meeting rooms:", error);
    }
  };

  const handleMeetingRoomChange = (roomName) => {
    setSelectedMeetingRoom(roomName);
    localStorage.setItem("selectedMeetingRoom", roomName);
  };

  const handleProceed = () => {
    if (selectedLocation && selectedMeetingRoom) {
      navigate(`/hot-snacks`);
    } else {
      alert("Please select both a location and a meeting room before proceeding.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedLocation");
    localStorage.removeItem("selectedMeetingRoom");
    navigate("/");
  };

  return (
    <div>
      <h2 className="heading">Choose your location</h2>

      <label className="location_label">Select your location:</label>
      <select
        className="dropdown_location"
        value={selectedLocation}
        onChange={(e) => handleLocationChange(e.target.value)}
      >
        <option value="">Select Location</option>
        {locations.map((location) => (
          location ? (
            <option key={location.location_id} value={location.location_id}>
            {location.location_name}
          </option>
          ) : null
        ))}
      </select>
      <br></br>
      <label className="meeting_label">Select your meeting room:</label>
      <select
        className="dropdown_meeting"
        value={selectedMeetingRoom}
        onChange={(e) => handleMeetingRoomChange(e.target.value)}
      >
        <option value="">Select Meeting Room</option>
        {meetingRooms.map((room) => (
          <option key={room.room_id} value={room.room_name}>
            {room.room_name}
          </option>
        ))}
      </select>
      <br />
      <button className="button_proceed" onClick={handleProceed}>Proceed</button>
      <br />
      <button className="button_logout" onClick={handleLogout}><CiLogout style={{width: '2em', height: '2em',marginRight: '2px',fontWeight:"bold",strokewidth: "2" }}/></button>
    </div>
  );
};

export default LandingPage;
