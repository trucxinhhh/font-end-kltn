import React, { useEffect, useState } from "react";
import dataTest from "./data";
import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DateList() {
  // State to hold the total for each day
  const [totals, setTotals] = useState({});

  // Hàm để lấy danh sách các ngày từ hôm nay trở về 6 ngày trước
  const getLastSevenDays = () => {
    const dates = [];
    const today = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(new Date(today).getDate() - i);
      dates.push(date.toISOString().slice(0, 10));
    }

    return dates.reverse();
  };

  // Gọi hàm để lấy danh sách các ngày
  const dateList = getLastSevenDays();
  console.log("dateList", dateList);

  const filteVolume = async (listday, data) => {
    const filteredData = data.filter((item) => item.date === listday);
    const maxTotal =
      filteredData.length > 0
        ? Math.max(...filteredData.map((item) => item.total))
        : 0;
    console.log("Max total for", listday, ":", maxTotal);
    return maxTotal;
  };

  const calculateTotals = async () => {
    const totalsObj = {};
    for (const date of dateList) {
      totalsObj[date] = await filteVolume(date, dataTest);
    }
    setTotals(totalsObj); // Update state with totals
  };
  const data2 = {
    labels: dateList,
    datasets: [
      {
        axis: "x",
        label: "Total in a day",

        data: totals,
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
          text: "Times in day", // Set the y-axis title with the unit
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
  useEffect(() => {
    calculateTotals(); // Call the function to calculate totals when the component mounts
  }, []);

  return (
    <div>
      <Bar data={data2} options={optionsBar} />
    </div>
  );
}

export default DateList;
