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

function App() {
  // khai báo biến sử dụng
  const navigate = useNavigate();
  const [valueCO2, setValueCO2] = useState(0);
  const [valueTemp, setValueTemp] = useState(0);
  const [valueHumi, setValueHumi] = useState(0);
  const [valueEC, setValueEC] = useState(0);
  const [valuePressure, setValuePressure] = useState(0);
  const [valueFlowmeters, setValueFlowmeters] = useState(0);
  const [valueAlkalinity, setValueAlkalinity] = useState(0);
  const [valueMotor1, setValueMotor1] = useState(false);
  const [valueMotor2, setValueMotor2] = useState(false);
  const [valueMotor3, setValueMotor3] = useState(false);
  const [valueFullTank, setValueFullTank] = useState(false);
  const [valueEmptyTank, setValueEmptyTank] = useState(false);
  const [recentData, setRecentData] = useState([]);
  const [Predict, setPredict] = useState("");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [countTime, setCountTime] = useState(0);
  const [selector, setSelector] = useState("CO2");
  // const [data1, setData] = useState([]);
  // Mobile View

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
    const checkMAX = name + "_MAX";
    const checkMIN = name + "_MIN";
    if (
      value >= Thresh.DataMap[checkMIN] &&
      value <= Thresh.DataMap[checkMAX]
    ) {
      return "bg-[#54B435]";
    } else {
      return "bg-red-500";
    }
  };
  const statusColorBool = (value) => {
    if (value) return "bg-[#54B435]";
    return "bg-red-500";
  };

  const options = (title) => ({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  });
  const chartData = (lineColor, data_to_draw) => {
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
        },
      ],
    };
  };

  // lấy ngày giờ
  let today = new Date().toLocaleDateString();

  const { dataSensor, dataMotor } = {
    dataMotor: localStorage.getItem("dataMotor"),
    dataSensor: localStorage.getItem("dataSensor"),
  };
  const dt1 = JSON.parse(dataSensor);
  const dt2 = JSON.parse(dataMotor);

  async function loadData() {
    setValueCO2(dt1.slice(-1)[0]["CO2"]);
    setValueTemp(dt1.slice(-1)[0]["Temp"].toFixed(1));
    setValueHumi(dt1.slice(-1)[0]["Humi"].toFixed(1));
    setValueEC(dt1.slice(-1)[0]["EC"].toFixed(1));
    setValuePressure(dt1.slice(-1)[0]["Pressure"]);
    setValueFlowmeters(dt1.slice(-1)[0]["Flowmeters"]);
    setValueAlkalinity(dt1.slice(-1)[0]["pH"]);
    setValueFullTank(dt1.slice(-1)[0]["WaterlevelSensor1"]);
    setValueEmptyTank(dt1.slice(-1)[0]["WaterlevelSensor2"]);
    setValueMotor1(dt2.slice(-1)[0]["motor1"]);
    setValueMotor2(dt2.slice(-1)[0]["motor2"]);
    setValueMotor3(dt2.slice(-1)[0]["motor3"]);
    setRecentData(dt1.slice(-30));
  }
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
      loadData();
      getPredict();
    }, 1000);
    return () => clearInterval(interval); // Clear interval on component unmount
  });

  //điều khiển icon status
  const stt_Project = Math.floor(Math.random() * 100);

  // display đồ thị
  const toggleDisplay = (name) => {
    var list_name = [
      "chart_Sensor_1",
      "chart_Sensor_2",
      "chart_Sensor_3",
      "chart_Sensor_4",
      "chart_Sensor_5",
      "chart_Sensor_6",
    ];
    var alarmDiv = document.getElementById("chart_Sensor_" + name);

    alarmDiv.style.display = "flex";

    var index = list_name.indexOf("chart_Sensor_" + name);
    if (index !== -1) {
      list_name.splice(index, 1); // Xóa phần tử tại vị trí index
    }

    for (var i = 0; i < list_name.length; i++) {
      var overviewDivs = document.getElementById(list_name[i]);
      overviewDivs.style.display = "none";
    }
  };

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
            {/*----------Recomment Box ----------*/}
            <div className="mt-4 h-22/5 flex left-1">
              <div className=" flex flex-col   w-full p-2 shadow-xl bg-opacity-75 bg-white rounded-md mr-2 ">
                <p className="text-gray-600 font-bold text-center text-xl">
                  Quy trình chăm sóc
                </p>
                <p className="text-red-600 font-bold text-lg text-left">
                  DAY: {Predict["days"]}
                </p>
                {ciuspe
                  ? JSON.parse(localStorage.getItem("advices")).map(
                      (sentence, index) => <p key={index}>{sentence.trim()}.</p>
                    )
                  : null}
              </div>
            </div>
            {/*----------End Recomment Box ----------*/}
            {/* ---------- Sensor Table ----------*/}
            <div className="flex flex-col sensor_table h-3/4 w-full rounded-r-2xl rounded-l-2xl">
              <div class="grid grid-cols-4 gap-4">
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                    "CO2",
                    valueCO2
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">CO2</h3>
                  <h3 className="mt-2 text-base text-white">{valueCO2} ppm</h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                    "Humi",
                    valueHumi
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">
                    Humidity
                  </h3>
                  <h3 className="mt-2 text-base text-white">{valueHumi} %</h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                    "Temp",
                    valueTemp
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">Temp</h3>
                  <h3 className="mt-2 text-base text-white">{valueTemp} °C</h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                    valueMotor1
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">Motor 1</h3>
                  <h3 className="mt-2 text-base text-white">
                    {valueMotor1 ? "Status: ON" : "Status: OFF"}
                  </h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                    valueFlowmeters
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">
                    Flowmeters
                  </h3>

                  <h3 className="mt-2 text-base text-white">
                    {/*  {valueFlowmeters} m<sup>3</sup>/s*/}
                    {valueFlowmeters ? "Status: ON" : "Status: OFF"}
                  </h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                    "EC",
                    valueEC
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">EC</h3>
                  <h3 className="mt-2 text-base text-white">{valueEC}uS/cm </h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                    "PH",
                    valuePressure
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">
                    Salinity
                  </h3>
                  <h3 className="mt-2 text-base text-white">
                    {valueAlkalinity} ptt
                  </h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                    valueMotor2
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">Motor 2</h3>
                  <h3 className="mt-2 text-base text-white">
                    {valueMotor2 ? "Status: ON" : "Status: OFF"}
                  </h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                    valuePressure
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">
                    Pressure
                  </h3>
                  <h3 className="mt-2 text-base text-white">
                    {valuePressure} kg/cm<sup>2</sup>
                  </h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-2   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                    valueFullTank
                  )}`}
                >
                  <h3 className="mt-4 text-xl font-bold text-white">
                    Full Tank
                  </h3>

                  <h3 className="mt-2 text-base text-white">
                    {valueFullTank ? "Status: ON" : "Status: OFF"}
                  </h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-2  text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                    valueEmptyTank
                  )}`}
                >
                  <h3 className="mt-4 text-xl font-bold text-white">
                    Emty Tank
                  </h3>
                  <h3 className="mt-2 text-base text-white">
                    {valueEmptyTank ? "Status: ON" : "Status: OFF"}
                  </h3>
                </div>
                <div
                  className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                    valueMotor3
                  )}`}
                >
                  <h3 className="mt-2 text-xl font-bold text-white">Motor 3</h3>
                  <h3 className="mt-2 text-base text-white">
                    {valueMotor3 ? "Status: ON" : "Status: OFF"}
                  </h3>
                </div>
              </div>
            </div>

            {/*--------End Sensor Project --------*/}
          </div>
          {/*--------------------------End Status Box--------------------------*/}

          {/*--------------------------------Chart + Time ---------------------------------*/}

          <div className=" p-4 w-1/2 m rounded-r-3xl hidden md:block ">
            <div class="bg-white h-1/5 w-full rounded-3xl p-4 flex flex-row justify-center items-center space-x-4">
              <img
                src="src/assets/logo/iuh.jpg"
                alt="Logo IUH"
                class="h-auto w-1/4 object-contain"
              />
              <img
                src="src/assets/logo/fet.jpg"
                alt="Logo FET"
                class="h-auto w-1/4 object-contain"
              />
              <img
                src="src/assets/logo/dai-viet.jpg"
                alt="Logo Đại Việt"
                class="h-auto w-1/4 object-contain"
              />
            </div>

            <div className="">
              <div
                class="bg-white h-1/2 rounded-3xl p-4 flex flex-col justify-center mt-2 "
                style={{ width: "550px", height: "330px" }}
              >
                <ul className=" flex justify-center">
                  <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                    <i class="fa-solid fa-house"></i>
                    <span class="ml-2 " onClick={() => toggleDisplay("1")}>
                      CO2
                    </span>
                  </li>
                  <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                    <span class="ml-2" onClick={() => toggleDisplay("3")}>
                      TEMP
                    </span>
                  </li>
                  <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                    <span class="ml-2" onClick={() => toggleDisplay("2")}>
                      HUMI
                    </span>
                  </li>
                  <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                    <span class="ml-2" onClick={() => toggleDisplay("5")}>
                      Pressure
                    </span>
                  </li>
                  <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                    <span class="ml-2" onClick={() => toggleDisplay("4")}>
                      Flowmeters
                    </span>
                  </li>
                  <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                    <span class="ml-2" onClick={() => toggleDisplay("6")}>
                      EC
                    </span>
                  </li>
                </ul>
                <div id="chart_Sensor_1" className="p-2 ">
                  <Line
                    data={chartData("#f15bb5", "CO2")}
                    options={options("CO2")}
                  />
                </div>
                <div id="chart_Sensor_2" className="p-2 hidden">
                  <Line
                    data={chartData("#fb8500", "Humi")}
                    options={options("Humidity")}
                  />
                </div>
                <div id="chart_Sensor_3" className="p-2 hidden">
                  <Line
                    data={chartData("#bc6c25", "Temp")}
                    options={options("Temperature")}
                  />
                </div>
                <div id="chart_Sensor_4" className="p-2 hidden">
                  <Line
                    data={chartData("#0077b6", "Flowmeters")}
                    options={options("Flowmeters")}
                  />
                </div>
                <div id="chart_Sensor_5" className="p-2 hidden">
                  <Line
                    data={chartData("#8338ec", "Pressure")}
                    options={options("Pressure")}
                  />
                </div>
                <div id="chart_Sensor_6" className="p-2 hidden ">
                  <Line
                    data={chartData("#84a98c", "EC")}
                    options={options("EC")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/*--------------------------------End ChartTime ---------------------------------*/}
        </div>
      </div>
      {/* Mobile View */}
      <div className="sm:hidden h-fit w-screen  ">
        <div className="p-4 w-full h-1/2 md:w-1/2">
          {/*----------Status Project ----------*/}
          <div className="flex left-1">
            <div className=" flex flex-col  items-center h-1/5 w-4/6 p-2 shadow-xl bg-[#65B741] text-white rounded-md mr-2 ">
              <h3 className="mt-2 text-2xl font-bold">{today}</h3>
              <h3 className="mt-2 text-2xl font-bold">{currentTime}</h3>
            </div>
            <div className="flex flex-col items-center h-1/5  w-4/6 p-2  shadow-xl bg-[#65B741] text-white rounded-md mr-2">
              <h3 className="mt-2 text-xl font-bold">Status Project</h3>
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

          <div className="flex flex-col sensor_table h-3/4 w-full rounded-r-2xl rounded-l-2xl">
            <div class="grid grid-cols-3 gap-1 ">
              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                  "CO2",
                  valueCO2
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">CO2</h3>
                <h3 className="mt-2 text-base text-white">{valueCO2} ppm</h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                  "Humi",
                  valueHumi
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">Humidity</h3>
                <h3 className="mt-2 text-base text-white">{valueHumi} %</h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                  "Temp",
                  valueTemp
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">Temp</h3>
                <h3 className="mt-2 text-base text-white">{valueTemp} °C</h3>
              </div>

              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                  valueFlowmeters
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">
                  Flowmeters
                </h3>

                <h3 className="mt-2 text-base text-white">
                  {valueFlowmeters} m<sup>3</sup>/s
                </h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                  "EC",
                  valueEC
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">EC</h3>
                <h3 className="mt-2 text-base text-white">{valueEC}uS/cm </h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColor(
                  "PH",
                  valueAlkalinity
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">Salinity</h3>
                <h3 className="mt-2 text-base text-white">
                  {valueAlkalinity} ptt
                </h3>
              </div>

              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                  valuePressure
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">Pressure</h3>
                <h3 className="mt-2 text-base text-white">
                  {valuePressure} kg/cm<sup>2</sup>
                </h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-2   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                  valueFullTank
                )}`}
              >
                <h3 className="mt-4 text-xl font-bold text-white">Full Tank</h3>

                <h3 className="mt-2 text-base text-white">
                  {valueFullTank ? "Status: ON" : "Status: OFF"}
                </h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-2  text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                  valueEmptyTank
                )}`}
              >
                <h3 className="mt-4 text-xl font-bold text-white">Emty Tank</h3>
                <h3 className="mt-2 text-base text-white">
                  {valueEmptyTank ? "Status: ON" : "Status: OFF"}
                </h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                  valueMotor1
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">Motor 1</h3>
                <h3 className="mt-2 text-base text-white">
                  {valueMotor1 ? "Status: ON" : "Status: OFF"}
                </h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                  valueMotor2
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">Motor 2</h3>
                <h3 className="mt-2 text-base text-white">
                  {valueMotor2 ? "Status: ON" : "Status: OFF"}
                </h3>
              </div>
              <div
                className={`flex flex-col  items-center  p-4   text-black rounded-md shadow-lg border border-gray-200 mx-2  ${statusColorBool(
                  valueMotor3
                )}`}
              >
                <h3 className="mt-2 text-xl font-bold text-white">Motor 3</h3>
                <h3 className="mt-2 text-base text-white">
                  {valueMotor3 ? "Status: ON" : "Status: OFF"}
                </h3>
              </div>
            </div>
          </div>

          {/*--------End Sensor Project --------*/}
        </div>
        <br></br>
        <div className=" p-4 w-full h-1/2 rounded-r-3xl ">
          <div className="mt-2">
            <div class="bg-white rounded-3xl p-4 flex flex-col justify-center  ">
              <ul className=" flex justify-center w-full overflow-x-auto ">
                <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  <span
                    class="ml-2 "
                    onClick={() => {
                      setSelector("CO2");
                    }}
                  >
                    CO2
                  </span>
                </li>
                <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  <span
                    class="ml-2 "
                    onClick={() => {
                      setSelector("Temp");
                    }}
                  >
                    TEMP
                  </span>
                </li>
                <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  <span
                    class="ml-2 "
                    onClick={() => {
                      setSelector("Humi");
                    }}
                  >
                    HUMI
                  </span>
                </li>
                <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  <span
                    class="ml-2 "
                    onClick={() => {
                      setSelector("Pressure");
                    }}
                  >
                    Pressure
                  </span>
                </li>
                <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  <span
                    class="ml-2 "
                    onClick={() => {
                      setSelector("Flowmeters");
                    }}
                  >
                    Flowmeters
                  </span>
                </li>
                <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  <span
                    class="ml-2 "
                    onClick={() => {
                      setSelector("EC");
                    }}
                  >
                    EC
                  </span>
                </li>
              </ul>
              <div id="chart_Sensor_1" className="p-2  ">
                <Line
                  data={chartData("#f15bb5", selector)}
                  options={options(selector)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

