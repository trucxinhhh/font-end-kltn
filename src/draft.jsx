import React, { useEffect } from "react";
import { url_data, url_api, url_local } from "./Provider.jsx";
import { useState } from "react";
import axios from "axios";
const draft = () => {
  const [dt, setDt] = useState("data");
  const [rps, setRPS] = useState();
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;
  const loadData = async () => {
    const response = await axios.get(url_data + "api/" + dt + "/0", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const dt1 = response.data;
    setRPS(dt1);
	  console.log(dt1);
  };
  return (
    <>
      <div>
        <input type="text" onChange={(e) => setDt(e.target.value)}></input>
        <button className="bg-green-500" onClick={loadData}>
          submit
        </button>
        
      </div>
    </>
  );
};

export default draft;

