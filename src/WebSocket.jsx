import React, { useState } from "react";
import axios from "./pages/checkToken.jsx";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { url_data } from "./Provider.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashBoard = [
  "CO2",
  "Humi",
  "Temp",
  "flow",
  "EC",
  "Salt",
  "Pressure",
  "Motor",
  "Waterpumped",
  "AirHumi",
  "AirTemp",
  "Full",
];

const token = localStorage.getItem("token");
const access_token = "Bearer " + token;

function WebSocketChat() {
const a = [
  {_id: 0, date: '2024-11-18', time: '07:53:17', CO2: 524, Temp: 27}, 
  {_id: 1, date: '2024-11-18', time: '07:53:17', CO2: 524, Temp: 27}, 
  {_id: 2, date: '2024-11-18', time: '07:53:17', CO2: 524, Temp: 27}, 
  {_id: 3, date: '2024-11-18', time: '07:53:17', CO2: 524, Temp: 27},
];

// New object to add
const newElement = {_id:5, date: '2024-11-18', time: '07:53:17', CO2: 1, Temp: 1 ,};

// Append to the end
a.push(newElement);

console.log(a);


  return (
  <h1>hi</h1>
  );
}

export default WebSocketChat;
