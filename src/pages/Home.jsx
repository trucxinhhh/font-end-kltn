import { useEffect, useState, useRef, Suspense } from "react";
import { Line, Bar } from "react-chartjs-2";
import { useNavigate, Outlet, Link } from "react-router-dom";
// import axios from "axios";
import * as Thresh from "./include/DefaultData";
import axios from "./checkToken";
import { url_api } from "../Provider.jsx";
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

const DashBoard = [
  "CO2",
  "Humi",
  "Temp",
  "Flowmeters",
  "EC",
  "pH", // Sal
  "Pressure",
  "motor",
  "Waterpumped",
  "Humi",
  "Temp",
  "Full",
];
const Unit = {
  CO2: "ppm",
  Humi: "% (Đất)",
  Temp: "°C (Đất)",
  Flowmeters: "m³/s",
  EC: "µS/cm",
  Waterpumped: "m³",
  pH: "ppm",
  Pressure: "bar",
  motor: "",
};
const TimeHour = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

function App() {
  //Websocket
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    // Khởi tạo kết nối WebSocket và lưu vào ws.current
    ws.current = new WebSocket("ws://34.126.91.225:1506/data");

    // Lắng nghe sự kiện onmessage từ WebSocket
    ws.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    // Đóng kết nối WebSocket khi component bị unmount
    return () => {
      ws.current.close();
    };
  }, []);
  //khai báo biến sử dụng
  const [Display, setDisplay] = useState(true);
  const [recentMotor, setRecentMotor] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const [Predict, setPredict] = useState("");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [selector, setSelector] = useState("CO2");

  // Lấy token
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;
  const imagePath = (name) => {
    new URL(`/src/assets/icon/${name}.jpg`, import.meta.url).href;
  };
  // lấy ngày giờ
  let today = new Date().toLocaleDateString();

  const { dataSensor, dataMotor } = {
    dataMotor: localStorage.getItem("dataMotor"),
    dataSensor: localStorage.getItem("dataSensor"),
  };
  const dt1 = JSON.parse(dataSensor);
  const dt2 = JSON.parse(dataMotor);
  const dataVol = JSON.parse(localStorage.getItem("dataVol"));
  const TotalHour = JSON.parse(localStorage.getItem("TotalHour"));
  // console.log("TotalHour", TotalHour);
  //get predict
  const getPredict = async () => {
    const url = url_api + "predict";
    const response = await axios.get(url, {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(response.data);
    setPredict(response.data);
  };
  // trang thai icon status
  const HappyColor = (value) => {
    if (value < 35) {
      return "text-[#00FF9C]";
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

  //chuan hoa gia tri cam bien
  const checkValue = (name) => {
    switch (name) {
      case "motor":
        if (name) {
          const data = dt2.slice(-1)[0][name];

          if (data) {
            return "ON";
          } else {
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
        // case "Waterpumped":
        if (name) {
          return dt1.slice(-1)[0][name].toFixed(1);
        }
      case "Waterpumped":
        if (name) {
          // return dt1.slice(-1)[0][name].toFixed(1);
          return 20;
        }
    }
  };
  // bg-color-button-sensor-thresh
  const statusColor = (name, value) => {
    switch (name) {
      case "Pressure":
      case "Waterpumped":
      case "Flowmeters":
        if (value) {
          return "shadow-cyan-600";
        }
        return "shadow-red-600";
      case "motor":
      case "Full":
      case "Empty":
        if (value == "ON") {
          return "shadow-cyan-600";
        }
        return "shadow-red-600";
      case "CO2":
      case "Humi":
      case "Temp":
      case "EC":
      case "pH":
        const checkMAX = name + "_MAX";
        const checkMIN = name + "_MIN";
        if (
          value >= Thresh.DataMap[checkMIN] &&
          value < Thresh.DataMap[checkMAX]
        ) {
          return "shadow-cyan-600";
        } else {
          return "shadow-red-600 bg-red-500";
        }
      // case "":
    }
  };
  // rename sensor
  const change_name = (nameChange) => {
    if (nameChange == "pH") {
      return "Salinity";
    } else if (nameChange == "motor") {
      return "MOTOR";
    }
    return nameChange;
  };

  //chart Line

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
    animation: false,
  });

  const chartData = (lineColor, data_to_draw) => {
    if (data_to_draw == "motor") {
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
            stepped: true,
            cubicInterpolationMode: "monotone",
            tension: 0.4,
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
            stepped: false,
            cubicInterpolationMode: "monotone",
            tension: 0.4,
          },
        ],
      };
    }
  };
  //chart Bar
  const data2 = {
    labels: TimeHour,
    datasets: [
      {
        axis: "x",
        label: "Total in a day (m³)",

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
          text: "Times in day", // Set the y-axis title with the unit
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

  // tach dong predict
  const ciuspe = Predict["advices"];
  if (ciuspe) {
    const adviceSentences = ciuspe
      .split(".")
      .filter((sentence) => sentence.trim() !== "");
    localStorage.setItem("advices", JSON.stringify(adviceSentences));
  }
  //điều khiển icon status
  const stt_Project = Math.floor(Math.random() * 100);
  useEffect(() => {
    getPredict();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setRecentMotor(dt2.slice(-30));
      setRecentData(dt1.slice(-30));
    }, 1000);
    return () => clearInterval(interval); // Clear interval on component unmount
  });
  return (
    <div className="flex  h-full  w-full ">
      {/* PC View */}

      <div className="hidden  w-full sm:block min-w-full  p-4">
        <div className="flex  h-full w-full ">
          {/*------------------------------Status Box------------------------------*/}
          <div className="p-4 w-full md:w-1/2">
            {/*----------Status Project ----------*/}

            <div className="flex left-6 ">
              {/* <div className=" flex flex-col  items-center h- w-1/5 p-2 shadow-xl bg-[#03AED2] text-white rounded-md mr-2 ">
                <p className="mt-1 text-xs font-bold">{today}</p>
                <p className="mt-2 text-xs font-bold">{currentTime}</p>
              </div> */}
              {/* <div className="flex flex-col items-center  w-1/3 p-2  shadow-xl bg-[#03AED2] text-white rounded-md mr-2">
                <p className=" text-xl font-bold">Status Project</p>
                <div className="flex flex-nowrap">
                  <div
                    className={`flex  px-2 py-1 w-14 text-sm font-semibold ${HappyColor(
                      stt_Project
                    )}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
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
                      width="34"
                      height="34"
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
                      width="34"
                      height="34"
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
              </div> */}
              <div className=" flex flex-col  items-center h- w-1/5 p-2 shadow-xl bg-[#ffffff] text-white rounded-md  ">
                <p className=" text-red-600 font-bold text-xs text-left">
                  Ngày trồng
                </p>
                <p className="mt-2 text-red-600 font-bold text-3xl text-left">
                  {Predict["days"] > 75 ? "Null" : Predict["days"]}
                </p>
              </div>
              <div className="ml-3 flex flex-col   w-full p-2 shadow-xl bg-white rounded-md mr-2 ">
                {/* <strong className="text-gray-600 font-bold text-center roboto-flex text-3xl">
                  Quy trình chăm sóc
                </strong> */}
                <p className="flex roboto-flex  ">
                  <strong className="font-bold  text-xl ml-8">
                    Quy trình chăm sóc
                  </strong>
                </p>

                {ciuspe
                  ? JSON.parse(localStorage.getItem("advices")).map(
                      (sentence, index) => (
                        <p
                          className="ml-4 font-bold text-[#3C3D37] roboto-thin "
                          key={index}
                        >
                          - {sentence.trim()}.
                        </p>
                      )
                    )
                  : null}
              </div>
            </div>
            {/*--------End Status Project --------*/}

            {/* ---------- Sensor Table ----------*/}
            <div className="">
              <div className=" sensor_table h-screen w-full rounded-r-2xl rounded-l-2xl ">
                <div className="grid grid-cols-3 gap-4 h-1/5  text-white p-2 ">
                  {DashBoard.map((item) => (
                    <button
                      className={` flex text-black items-center bg-white rounded-2xl  shadow ${statusColor(
                        item,
                        checkValue(item)
                      )}`}
                      onClick={() => {
                        setSelector(item);
                      }}
                    >
                      <img
                        src={`src/assets/icon/${item}.jpg`}
                        class="h-auto w-1/4 object-contain "
                      />

                      <p className=" w-3/4 roboto-thin font-bold   text-xl">
                        {checkValue(item)}
                        {Unit[item]}
                      </p>
                    </button>
                  ))}
                </div>
                <br></br>
                <div className="p-2 mt-20 bg-white rounded-r-2xl rounded-l-2xl">
                  {selector == "Waterpumped" ? (
                    // <div>0</div>
                    <Bar data={data2} options={optionsBar} />
                  ) : (
                    <Line
                      data={chartData("#f15bb5", selector)}
                      options={options(selector)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/*--------End Sensor Project --------*/}
          </div>
          {/*--------------------------End Status Box--------------------------*/}

          {/*--------------------------------Chart + Time ---------------------------------*/}

          {/*--------------------------------End ChartTime ---------------------------------*/}
          <div className="p-4 w-full md:w-1/2">
            {/*----------Status Project ----------*/}
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
            <br></br>
            <div className="flex left-6 ">
              {/* <div className=" flex flex-col  items-center h- w-1/5 p-2 shadow-xl bg-[#03AED2] text-white rounded-md mr-2 ">
                <p className="mt-1 text-xs font-bold">{today}</p>
                <p className="mt-2 text-xs font-bold">{currentTime}</p>
              </div> */}
              {/* <div className="flex flex-col items-center  w-1/3 p-2  shadow-xl bg-[#03AED2] text-white rounded-md mr-2">
                <p className=" text-xl font-bold">Status Project</p>
                <div className="flex flex-nowrap">
                  <div
                    className={`flex  px-2 py-1 w-14 text-sm font-semibold ${HappyColor(
                      stt_Project
                    )}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
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
                      width="34"
                      height="34"
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
                      width="34"
                      height="34"
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
              </div> */}
            </div>
            {/*--------End Status Project --------*/}

            {/* ---------- Sensor Table ----------*/}

            {/*--------End Sensor Project --------*/}
          </div>
        </div>
      </div>
      {/* Mobile View */}
      <div className="sm:hidden h-screen w-screen ">
        {" "}
        <ul className=" p-2 flex justify-center w-full overflow-x-auto ">
          <li class="p-4   list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded ">
            <span
              class="ml-2 underline hover:underline-offset-8  "
              onClick={() => {
                setDisplay(true);
              }}
            >
              Information
            </span>
          </li>
          <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-4">
            <span
              class="ml-2 underline hover:underline-offset-8 "
              onClick={() => {
                setDisplay(false);
              }}
            >
              Monitor
            </span>
          </li>
        </ul>
        {Display ? (
          <div>
            <div className="p-2 w-screen h-screen md:w-1/2 ">
              <div className=" p-2 w-full m rounded-r-3xl  ">
                <div class="bg-white h-24 w-full rounded-3xl p-4 flex flex-row justify-center items-center space-x-4 gap-12">
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
              </div>
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
                        (sentence, index) => (
                          <p
                            className="ml-4 font-bold text-[#3C3D37]"
                            key={index}
                          >
                            {sentence.trim()}.
                          </p>
                        )
                      )
                    : null}
                </div>
              </div>
              {/*----------End Recomment Box ----------*/}
              {/* -----------------------Mo Hinh Nha Kinh------------------------------ */}
              <div class="bg-white h-3/5  w-full rounded-3xl p-4 flex flex-row  bg-opacity-50 justify-center items-center space-x-4">
                <img src="src/assets/logo/MoHinhNhaKinh-removebg-preview.png" />
              </div>
              {/* ----------------------- End Mo Hinh Nha Kinh------------------------------ */}
            </div>
          </div>
        ) : (
          <div className="">
            <div className=" sensor_table h-screen w-full rounded-r-2xl rounded-l-2xl ">
              <div className="grid grid-cols-4 gap-2 h-20 text-white p-2 ">
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
                      {Unit[item]}
                    </h2>
                  </button>
                ))}
              </div>
              <br></br>
              <br></br>
              <br></br>
              <div className="p-2 mt-20 bg-white rounded-r-2xl rounded-l-2xl">
                {selector == "Waterpumped" ? (
                  // <div>0</div>
                  <Bar data={data2} options={optionsBar} />
                ) : (
                  <Line
                    data={chartData("#f15bb5", selector)}
                    options={options(selector)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* End Mobile View */}
    </div>
  );
}

export default App;
