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
  const [Data, setData] = useState([]);

  const GetAll = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const response = await axios.get(
      `${url_data}api/data/0?start=${today}&end=${today}`,
      {
        headers: {
          Authorization: access_token,
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const dt = response.data;
    setData(dt);
    console.log(dt);
  };

  return (
    <div className="h-screen flex flex-col items-center overflow-y-auto bg-gray-100 p-2">
      <button
        onClick={() => GetAll()}
        className="px-4 py-1 mb-4 button-create-user bg-[#EC8305] transition-colors duration-150 cursor-pointer hover:bg-[#024CAA] text-cyan-50 rounded-full font-bold"
      >
        Get All
      </button>
      <div className="w-full max-w-4xl grid grid-cols-1 gap-4">
        {Data.length > 0 &&
          DashBoard.map((metric, index) => {
            const chartData = {
              labels: Data.map((item) => item.time), // Assuming 'time' is a property in your data
              datasets: [
                {
                  label: metric,
                  data: Data.map((item) => item[metric]), // Access each metric dynamically
                  backgroundColor: `rgba(${(index + 1) * 40}, ${
                    120 + index * 15
                  }, ${192 - index * 20}, 0.4)`,
                  borderColor: `rgba(${(index + 1) * 40}, ${
                    120 + index * 15
                  }, ${192 - index * 20}, 1)`,
                  borderWidth: 2,
                  fill: true,
                },
              ],
            };

            return (
              <div
                key={metric}
                className="chart-container bg-white p-4 rounded-2xl shadow-lg"
                style={{ maxWidth: "600px", margin: "0 auto" }}
              >
                <h2 className="text-center font-bold text-lg mb-2">{metric}</h2>
                <Line
                  data={chartData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default WebSocketChat;
