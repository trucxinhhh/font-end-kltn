import { useEffect, useState, useRef, Suspense } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, Outlet, Link } from "react-router-dom";
// import axios from "axios";
import * as Thresh from "./include/DefaultData";
import axios from "./checkToken";
import { url_api } from "../Provider.jsx";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GetDataTime = 0.2 * 60;
const DashBoard = [
  "CO2",
  "Humi",
  "Temp",
  "Flowmeters",
  "EC",
  "WaterlevelSensor1",
  "WaterlevelSensor2",
  "pH", // Sal
  "Pressure",
  "motor1",
  "motor2",
];
const Unit = {
  CO2: "ppm",
  Humi: "%",
  Temp: "°C",
  Flowmeters: "m²/s",
  EC: "µS/cm",
  WaterlevelSensor1: "",
  WaterlevelSensor2: "",
  pH: "ppt",
  Pressure: "bar",
  motor1: "",
  motor2: "",
};
const { dataSensor, dataMotor } = {
  dataMotor: localStorage.getItem("dataMotor"),
  dataSensor: localStorage.getItem("dataSensor"),
};
const dt1 = JSON.parse(dataSensor);
const dt2 = JSON.parse(dataMotor);
function App() {
  //khai báo biến sử dụng

  const [recentMotor, setRecentMotor] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const [Predict, setPredict] = useState("");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [countTime, setCountTime] = useState(0);
  const [selector, setSelector] = useState("CO2");
  // const [data1, setData] = useState([]);

  // Lấy token
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;
  // const recentData = data1.slice(-30);
  const HappyColor = (value) => {
    if (value < 35) {
      return "text-green-400";
    } else {
      return "text-white";
    }
  };

  const SadColor = (value) => {
    if (35 < value && value < 80) {
      return "text-yellow-500";
    } else {
      return "text-white";
    }
  };
  const WarningColor = (value) => {
    if (value > 80) {
      return "text-red-500";
    } else {
      return "text-white";
    }
  };
  const statusColor = (name, value) => {
    switch (name) {
      case "Pressure":
      case "motor1":
      case "motor2":
      case "WaterlevelSensor1":
      case "WaterlevelSensor2":
        if (value){ return "shadow-cyan-600";}
        return "shadow-red-600";
      case "CO2":
      case "Humi":
      case "Temp":
      case "Flowmeters":
      case "EC":
      case "pH":
        const checkMAX = name + "_MAX";
        const checkMIN = name + "_MIN";
        if (
          value >= Thresh.DataMap[checkMIN] &&
          value <= Thresh.DataMap[checkMAX]
        ) {
          return "shadow-cyan-600";
        } else {
          return "shadow-red-600";
        }
    }
  };

  const change_name = (nameChange) => {
    if (nameChange == "pH") {
      return "Salinity";
    }
    else if(nameChange=="WaterlevelSensor1"){
      return "Full Tank";  
    }
    else if(nameChange=="WaterlevelSensor2"){
      return "Empty Tank"
    }
    else if(nameChange=="motor1"){
      return "MOTOR 1";
    }
    else if(nameChange=="motor2"){
      return "MOTOR 2";
    }
    return nameChange;
  };
  const options = (title) => ({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: change_name(title),
      },
    },
  });
    const chartData = (lineColor, data_to_draw) => {
    if (data_to_draw == "motor1" || data_to_draw == "motor2") {
      const labels = recentMotor.map((item) => item.time);
      const data = recentMotor.map((item) => item[data_to_draw]);
      return {
        labels: labels,
        datasets: [
          {
            label: "",
            data: data, // Assuming data_CO2 has a co2 field
            borderColor: lineColor,
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
	    cubicInterpolationMode: "monotone",
            tension: 0.4
          },
        ],
      };
    } else {
      const labels = recentData.map((item) => item.time);
      const data = recentData.map((item) => item[data_to_draw]);
      return {
        labels: labels,
        datasets: [
          {
            label: "",
            data: data, // Assuming data_CO2 has a co2 field
            borderColor: lineColor,
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
            cubicInterpolationMode: "monotone",
            tension: 0.4

          },
        ],
      };
    }

    
  };
  const imagePath = (name) => {
    new URL(`/src/assets/icon/${name}.jpg`, import.meta.url).href;
  };
  // lấy ngày giờ
  let today = new Date().toLocaleDateString();


  // setRecentData(dt1.slice(-30));
  const getPredict = async () => {
    const url = url_api + "predict";
    const response = await axios.get(url, {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setPredict(response.data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      getPredict();
      setRecentMotor(dt2.slice(-30));
      setRecentData(dt1.slice(-30));
    }, 1000);
    return () => clearInterval(interval); // Clear interval on component unmount
  });
  const checkValue = (name) => {
    switch (name) {
      case "motor1":
      case "motor2":
		    if (name) {
          const data = dt2.slice(-1)[0][name];
           
          if (data) {
            return "ON";
          }
          else {
            return "OFF";
          }
        }

      case "WaterlevelSensor1":
      case "WaterlevelSensor2":
	 if (name) {	 
          const data = dt1.slice(-1)[0][name];
		 console.log("huhu",name,data);
          if (data) {
            return "ON";
          }
	  else {
            return "OFF";
	  }
        }
      case "CO2":
      case "Humi":
      case "Pressure":
      case "Temp":
      case "Flowmeters":
      case "EC":
      case "pH":
        if (name) {
	  return dt1.slice(-1)[0][name].toFixed(1);
        }
    }
  };
  //điều khiển icon status
  const stt_Project = Math.floor(Math.random() * 100);

  const ciuspe = Predict["advices"];
  if (ciuspe) {
    const adviceSentences = ciuspe
      .split(".")
      .filter((sentence) => sentence.trim() !== "");
    localStorage.setItem("advices", JSON.stringify(adviceSentences));
  }
  return (
    <div className="flex  h-full  w-full  ">
      {/* PC View */}

      <div className="hidden  w-full sm:block min-w-full ">
        <div className="flex  h-full w-full ">
          {/*------------------------------Status Box------------------------------*/}
          <div className="p-4 w-full md:w-1/2">
            {/*----------Status Project ----------*/}

            <div className="flex left-1">
              <div className=" flex flex-col  items-center h- w-4/6 p-2 shadow-xl bg-cyan-900 text-white rounded-md mr-2 ">
                <p className="mt-2 text-2xl font-bold">{today}</p>
                <p className="mt-2 text-2xl font-bold">{currentTime}</p>
              </div>
              <div className="flex flex-col items-center  w-4/6 p-2  shadow-xl bg-cyan-900 text-white rounded-md mr-2">
                <p className="mt-2 text-2xl font-bold">Status Project</p>
                <div className="flex flex-nowrap">
                  <div
                    className={`flex  px-2 py-1 w-14 text-sm font-semibold ${HappyColor(
                      stt_Project
                    )}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="54"
                      height="54"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-mood-wink-2"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18z" />
                      <path d="M9 10h-.01" />
                      <path d="M14.5 15a3.5 3.5 0 0 1 -5 0" />
                      <path d="M15.5 8.5l-1.5 1.5l1.5 1.5" />
                    </svg>
                  </div>
                  <div
                    className={`flex  px-2 py-1 w-14 text-sm font-semibold ${SadColor(
                      stt_Project
                    )}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="54"
                      height="54"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-mood-sad"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M9 10l.01 0" />
                      <path d="M15 10l.01 0" />
                      <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
                    </svg>
                  </div>

                  <div
                    className={`flex  px-2 py-1 w-14 text-sm font-semibold ${WarningColor(
                      stt_Project
                    )}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="54"
                      height="54"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-mood-sad-dizzy"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M14.5 16.05a3.5 3.5 0 0 0 -5 0" />
                      <path d="M8 9l2 2" />
                      <path d="M10 9l-2 2" />
                      <path d="M14 9l2 2" />
                      <path d="M16 9l-2 2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/*--------End Status Project --------*/}

            {/* ---------- Sensor Table ----------*/}
            <div className="flex flex-col sensor_table h-4/5 w-full rounded-r-2xl rounded-l-2xl ">
              <div className="grid grid-cols-4 gap-2 h-1/5  text-white p-2 ">
                {DashBoard.map((item) => (
                  <button
                    className={`flex text-black bg-white rounded-2xl  shadow ${statusColor(
                      item,
                      checkValue(item)
                    )}`}
                    onClick={() => {
                      setSelector(item);
                    }}
                  >
                    <img
                      src={`src/assets/icon/${item}.jpg`}
                      class="h-auto w-1/3 object-contain "
                    />
		<h2 className="font-bold text-base mt-2 ">
			{checkValue(item)}
			{Unit[item]}</h2>
                  </button>
                ))}
              </div>
              <div className="p-2 mt-20 bg-white rounded-r-2xl rounded-l-2xl">
                <Line
                  data={chartData("#f15bb5", selector)}
                  options={options(selector)}
                />
              </div>
            </div>

            {/*--------End Sensor Project --------*/}
          </div>
          {/*--------------------------End Status Box--------------------------*/}

          {/*--------------------------------Chart + Time ---------------------------------*/}

          <div className=" p-4 w-1/2 m rounded-r-3xl hidden md:block ">
            <div class="bg-white h-24 w-full rounded-3xl p-4 flex flex-row justify-center items-center space-x-4 gap-20">
              <img
                src="src/assets/logo/iuh.jpg"
                alt="Logo IUH"
                class="h-auto w-20 object-contain"
              />
              <img
                src="src/assets/logo/fet.jpg"
                alt="Logo FET"
                class="h-auto w-20 object-contain"
              />
              <img
                src="src/assets/logo/dai-viet.jpg"
                alt="Logo Đại Việt"
                class="h-auto w-20 object-contain"
              />
            </div>
            {/*----------Recomment Box ----------*/}
            <div className="mt-4 h-22/5 flex left-1">
              <div className=" flex flex-col   w-full p-2 shadow-xl bg-opacity-75 bg-white rounded-3xl mr-2 ">
                <p className="text-gray-600 font-bold text-center text-xl">
                  Quy trình chăm sóc
                </p>
                <p className="text-red-600 font-bold text-lg text-left">
                  DAY {Predict["days"]}
                </p>
                {ciuspe
                  ? JSON.parse(localStorage.getItem("advices")).map(
                      (sentence, index) => <p className="ml-4 font-bold text-[#3C3D37]" key={index}>{sentence.trim()}.</p>
                    )
                  : null}
              </div>
            </div>
            {/*----------End Recomment Box ----------*/}
            {/* -----------------------Mo Hinh Nha Kinh------------------------------ */}
            <div class="bg-white h-3/5 mt-4 w-full rounded-3xl p-4 flex flex-row  bg-opacity-50 justify-center items-center space-x-4">
              <img src="src/assets/logo/MoHinhNhaKinh-removebg-preview.png" />
            </div>
            {/* ----------------------- End Mo Hinh Nha Kinh------------------------------ */}
          </div>

          {/*--------------------------------End ChartTime ---------------------------------*/}
        </div>
      </div>
      {/* Mobile View */}
      <div className="sm:hidden h-full w-screen  ">
        <div className="p-4 w-screen h-screen md:w-1/2 ">
          {/*----------Status Project ----------*/}
          <div className="flex left-1 h-28 w-full  p-2">
            <div className=" flex flex-col  items-center h-full w-4/6 p-2 shadow-xl bg-[#65B741] text-white rounded-md mr-2 ">
              <h3 className="mt-2 text-2xl font-bold">{today}</h3>
              <h3 className="mt-2 text-2xl font-bold">{currentTime}</h3>
            </div>
            <div className="flex flex-col items-center h-full  w-4/6 p-2  shadow-xl bg-[#65B741] text-white rounded-md mr-2">
              <h3 className="text-xl font-bold">Status Project</h3>
              <div className="flex flex-nowrap">
                <div
                  className={`flex  px-2 py-1 w-14 text-sm font-semibold ${HappyColor(
                    stt_Project
                  )}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="54"
                    height="54"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-mood-wink-2"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18z" />
                    <path d="M9 10h-.01" />
                    <path d="M14.5 15a3.5 3.5 0 0 1 -5 0" />
                    <path d="M15.5 8.5l-1.5 1.5l1.5 1.5" />
                  </svg>
                </div>
                <div
                  className={`flex  px-2 py-1 w-14 text-sm font-semibold ${SadColor(
                    stt_Project
                  )}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="54"
                    height="54"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-mood-sad"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M9 10l.01 0" />
                    <path d="M15 10l.01 0" />
                    <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
                  </svg>
                </div>

                <div
                  className={`flex  px-2 py-1 w-14 text-sm font-semibold ${WarningColor(
                    stt_Project
                  )}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="54"
                    height="54"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-mood-sad-dizzy"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M14.5 16.05a3.5 3.5 0 0 0 -5 0" />
                    <path d="M8 9l2 2" />
                    <path d="M10 9l-2 2" />
                    <path d="M14 9l2 2" />
                    <path d="M16 9l-2 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/*--------End Status Project --------*/}

          {/* ---------- Sensor Table ----------*/}

          {/*--------End Sensor Project --------*/}
        </div>
        <br></br>
      </div>
      {/* End Mobile View */}
    </div>
  );
}

export default App;

