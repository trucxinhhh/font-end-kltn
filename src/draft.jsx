import React from "react";
import { data } from "./data";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Draft = () => {
  const today = new Date().toISOString().slice(0, 10);
  const itemsByHour = Array.from({ length: 24 }, () => []);
  const TotalHour = [];
  const TimeHour= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  console.log(today); // Hiển thị dạng YYYY-MM-DD
  const filteredData = data.filter((item) => item.date === today);
  filteredData.filter((item) => {
    const hour = parseInt(item.time.split(":")[0], 10); // Tách và chuyển phần giờ từ chuỗi 'time' thành số nguyên
    const data = item.volume;
    itemsByHour[hour].push(data);
  });

  itemsByHour.filter((item,index)=>{
    TotalHour[index]=(item.reduce((a, b) => a + b, 0));
  });
  console.log("TotalHour",TotalHour);

    const data2 = {
    labels: TimeHour,
    datasets: [
      {
        axis: "x",
        label: "Total in a day",

        data: TotalHour,
        fill: false,
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          // "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const optionsBar = {
    indexAxis: "x",
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hour in day", // Set the y-axis title with the unit
        },
      },
       y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "m³", // Set the y-axis title with the unit
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          fontSize: 15,
        },
      },
    },
  };
  return <div>
     <div className=" h-2/3 w-full p-4 mt-3">
              <div className="relative p-4 h-full mt-2 bg-white border-2 border-blue-500 rounded-2xl items-center justify-center">
                <div className="ml-15 mt-10" style={{ maxWidth: "4S00px" }}>
                  <Bar data={data2} options={optionsBar} />
                </div>
              </div>
            </div>
  </div>;
};

export default Draft;
