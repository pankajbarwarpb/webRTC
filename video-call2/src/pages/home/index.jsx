import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <form
        className="form"
        onSubmit={(ev) => {
          ev.preventDefault();
          navigate(`/room/${roomCode}`);
        }}
      >
        <div>
          <label>Enter Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            required
            placeholder="Enter Room Code"
          />
          <button type="submit">Enter Room</button>
        </div>
      </form>
    </div>
  );
};
