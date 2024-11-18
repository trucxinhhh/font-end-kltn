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
import img1 from "/home/truc/font-end-kltn/src/assets/dualuoi/picture (1).jpg";
import img2 from "/home/truc/font-end-kltn/src/assets/dualuoi/picture (2).jpg";
import img3 from "/home/truc/font-end-kltn/src/assets/dualuoi/picture (3).jpg";
import img4 from "/home/truc/font-end-kltn/src/assets/dualuoi/picture (4).jpg";
import img5 from "/home/truc/font-end-kltn/src/assets/dualuoi/picture (5).jpg";
import img6 from "/home/truc/font-end-kltn/src/assets/dualuoi/picture (6).jpg";
import img7 from "/home/truc/font-end-kltn/src/assets/dualuoi/picture (7).jpg";
const images = [img1, img2, img3, img4, img5, img6, img7];

const DashBoard = [
  "CO2",
  "Humi",
  "Temp",
  "flow",
  "EC",
  "Salt", // Sal
  "Pressure",
  "motor",
  "Waterpumped",
  "AirHumi",
  "AirTemp",
  "Full",
];
const Unit = {
  CO2: "ppm",
  Humi: "% (Đất)",
  Temp: "°C (Đất)",
  flow: "m³/s",
  EC: "µS/cm",
  Waterpumped: "m³",
  Salt: "ppm",
  Pressure: "bar",
  motor: "",
  AirHumi: "% (kk)",
  AirTemp: "°C (kk)",
  Full: "",
};
const TimeHour = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

function App() {
  //img
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true); // Start fading in
      }, 500); // Duration for fade-out
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, [images.length]);

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

  const [dt1, setDT1] = useState(
    JSON.parse(localStorage.getItem("dataSensor"))
  );
  const [dt2, setDT2] = useState(JSON.parse(localStorage.getItem("dataMotor")));

  const [dataVol, setDataVol] = useState(
    JSON.parse(localStorage.getItem("dataVol"))
  );

  const [TotalHour, setTotalHour] = useState(
    JSON.parse(localStorage.getItem("TotalHour"))
  );
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
    // console.log(response.data);
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
    if (!name || dt1.length === 0) return "NaN";

    switch (name) {
      case "motor":
      case "Full":
        677;
        const data = dt2.slice(-1)[0]?.[name];
        return data ? "ON" : "OFF";

      case "CO2":
      case "Humi":
      case "Pressure":
      case "Temp":
      case "EC":
      case "Salt":
      case "AirHumi":
      case "AirTemp":
      case "flow":
        const value = dt1.slice(-1)[0][name];
        // console.log("HOME", dt1);
        // console.log(typeof name);
        return value !== undefined ? value.toFixed(1) : "NaN";

      case "Waterpumped":
        return dataVol;

      default:
        return "NaN";
    }
  };

  // bg-color-button-sensor-thresh
  const statusColor = (name, value) => {
    switch (name) {
      case "Pressure":
      case "Waterpumped":
      case "flow":
        if (value != undefined) {
          return "shadow-cyan-600 bg-white ";
        }
        return "shadow-red-600 bg-red-100";
      case "motor":
      case "Full":
        if (value == "ON") {
          return "shadow-cyan-600 bg-white ";
        }
        return "shadow-red-600 bg-red-100";
      case "CO2":
      case "Humi":
      case "Temp":
      case "AirHumi":
      case "AirTemp":
      case "EC":
      case "Salt":
        const checkMAX = name + "_MAX";
        const checkMIN = name + "_MIN";
        if (
          value >= Thresh.DataMap[checkMIN] &&
          value < Thresh.DataMap[checkMAX]
        ) {
          return "shadow-cyan-600 bg-white ";
        } else {
          return "shadow-red-600 text-black bg-red-100";
        }
      // case "":
    }
  };
  // rename sensor
  const change_name = (nameChange) => {
    if (nameChange == "Salt") {
      return "Salinity";
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
      const data = recentMotor.map((item) => item["motor"]);

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

      setDT1(JSON.parse(localStorage.getItem("dataSensor")));
      setDT2(JSON.parse(localStorage.getItem("dataMotor")));
      setDataVol(JSON.parse(localStorage.getItem("dataVol")));
      setTotalHour(JSON.parse(localStorage.getItem("TotalHour")));
      // console.log(dt1);
      setRecentMotor(dt2.slice(-30));
      setRecentData(dt1.slice(-30));
    }, 1000);
    return () => clearInterval(interval); // Clear interval on component unmount
  });
  return (
    <div className="flex  h-full  w-full ">
      {/* PC View */}

      <div className="hidden  w-full sm:block min-w-full p-4 ">
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
                      className={` flex object-contain items-center text-black  rounded-2xl  shadow ${statusColor(
                        item,
                        checkValue(item)
                      )}`}
                      onClick={() => {
                        setSelector(item);
                      }}
                    >
                      <img
                        src={`src/assets/icon_svg/${item}.svg`}
                        class=" p-1 h-auto w-1/4 object-contain text-black"
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
            <div className="h-4/5 bg-[#C4DAD2] p-4">
              <img
                src={images[currentImageIndex]}
                alt={`Slideshow ${currentImageIndex + 1}`}
                style={{
                  opacity: fade ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
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
      <div className="sm:hidden  w-full ">
        <ul className="mt-2 p-1 flex justify-center h-fit  w-full overflow-x-auto ">
          <li class="p-1 flex items-center text-[#050C9C] font-bold cursor-pointer  hover:text-[#EC8305]  ">
            <span
              class="ml-2 underline hover:underline-offset-8  "
              onClick={() => {
                setDisplay("tt");
              }}
            >
              Thông tin chung
            </span>
          </li>
          <li class="ml-3 p-1 flex items-center text-[#050C9C] font-bold cursor-pointer  hover:text-[#EC8305] rounded ">
            <span
              class="ml-2 underline hover:underline-offset-8 "
              onClick={() => {
                setDisplay("gs");
              }}
            >
              Giám sát
            </span>
          </li>
          <li class="ml-3 p-1 flex items-center text-[#050C9C] font-bold cursor-pointer  hover:text-[#EC8305] rounded ">
            <span
              class="ml-2 underline hover:underline-offset-8 "
              onClick={() => {
                setDisplay("chart");
              }}
            >
              Đồ thị
            </span>
          </li>
        </ul>
        {Display == "tt" ? (
          <div className="flẽ">
            <div className="p-2 w-screen h-screen md:w-1/2 ">
              <div className="   mr-2 rounded-r-3xl  ">
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
              {/* <div className="flex left-1 h-28 w-full  p-2">
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
              </div> */}

              {/*--------End Status Project --------*/}
              {/*----------Recomment Box ----------*/}
              <div className="mt-4  h-auto  flex left-1">
                {/* <div className=" flex flex-col   w-full p-2 shadow-xl bg-opacity-75 bg-white rounded-3xl mr-2 ">
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
                </div> */}
                <div className=" flex flex-col  items-center h- w-1/5 p-4 shadow-xl bg-[#ffffff] text-white rounded-md  ">
                  <p className=" text-red-600 font-bold text-xs text-center">
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
              {/*----------End Recomment Box ----------*/}
              {/* -----------------------Mo Hinh Nha Kinh------------------------------ */}
              <div class="bg-white mt-2 w-full rounded-3xl p-4 flex flex-row  bg-opacity-50 justify-center items-center space-x-4">
                <img
                  src={images[currentImageIndex]}
                  alt={`Slideshow ${currentImageIndex + 1}`}
                  style={{
                    opacity: fade ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                    height: "80%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* ----------------------- End Mo Hinh Nha Kinh------------------------------ */}
            </div>
          </div>
        ) : Display == "chart" ? (
          // <div className="">
          //   <div className=" h-screen w-full rounded-r-2xl rounded-l-2xl p-4">
          //     <div className="p-2  bg-white rounded-r-2xl rounded-l-2xl">
          //       {DashBoard.map((item, index) => (
          //         <div
          //           className="mt-4"
          //           key={index}
          //           style={{ marginBottom: "20px" }}
          //         >
          //           {item === "Waterpumped" ? (
          //             <Bar data={data2} options={optionsBar} />
          //           ) : (
          //             <Line
          //               data={chartData("#f15bb5", item)}
          //               options={options(item)}
          //             />
          //           )}
          //         </div>
          //       ))}
          //     </div>
          //   </div>
          // </div>
          <div className="flex flex-col items-center h-screen overflow-y-auto bg-gray-100 p-2">
            <div className="w-full max-w-sm rounded-2xl bg-white p-2 shadow-lg">
              {DashBoard.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="w-full">
                    {item === "Waterpumped" ? (
                      <Bar data={data2} options={optionsBar} height={150} />
                    ) : (
                      <Line
                        data={chartData("#f15bb5", item)}
                        options={options(item)}
                        height={150} // Chiều cao tối ưu cho điện thoại
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="">
            <div className=" h-screen w-full rounded-r-2xl rounded-l-2xl p-4">
              <div className="grid grid-cols-2 gap-2 h-20 text-white p-2 ">
                {DashBoard.map((item) => (
                  <button
                    className={`flex text-black rounded-2xl  shadow ${statusColor(
                      item,
                      checkValue(item)
                    )}`}
                    onClick={() => {
                      setSelector(item);
                    }}
                  >
                    <img
                      src={`src/assets/icon_svg/${item}.svg`}
                      class="h-auto w-1/3 object-contain p-1 "
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
              {/* <div className="p-2 mt-20 bg-white rounded-r-2xl rounded-l-2xl">
                {selector == "Waterpumped" ? (
                  // <div>0</div>
                  <Bar data={data2} options={optionsBar} />
                ) : (
                  <Line
                    data={chartData("#f15bb5", selector)}
                    options={options(selector)}
                  />
                )}
              </div> */}
            </div>
          </div>
        )}
      </div>
      {/* End Mobile View */}
    </div>
  );
}

export default App;
