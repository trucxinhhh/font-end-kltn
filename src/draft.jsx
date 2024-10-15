import React, { useState } from "react";
import axios from "axios";
import { url_api, url_local, url_data } from "./Provider.jsx";
function ControlButton() {
  const access_token = "your_access_token_here"; // Replace with your actual access token
  const [tai, setTai] = useState(""); // State to store master password

  const handlePostData = async () => {
    const token = localStorage.getItem("token");
    const access_token = "Bearer " + token;
    const role = localStorage.getItem("role");

    const registerform = {
      timer: 100,
      status: true,
      masterusr: localStorage.getItem("username"),
      masterpwd: tai,
    };

    try {
      const response = await axios.post(
        `${url_api}control/motor`,
        registerform,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: access_token,
          },
        }
      );
      console.log("Response:", response.data);
      // Handle successful response here
    } catch (error) {
      console.error("Error:", error);
      // Handle error here
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter password"
        value={tai}
        onChange={(e) => setTai(e.target.value)}
      />
      <button onClick={handlePostData}>Post Data</button>
    </div>
  );
}

export default ControlButton;
