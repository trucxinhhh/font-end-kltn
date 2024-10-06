import { Button } from "@material-tailwind/react";
import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
import axios from "./checkToken";
import { Line, Bar } from "react-chartjs-2";
import { url_api, url_local } from "../Provider.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
const MAX_CLICKS = 4;
const LOCK_DURATION = 60 * 1000;
const DOUBLE_CLICK_THRESHOLD = 300;
const GetDataTime = 0.2 * 60;
const Control = () => {
  const [isChecked, setIsChecked] = useState(
    JSON.parse(localStorage.getItem("isChecked"))
  );

  const [Display, setDisplay] = useState("1");
  const [selector, setSelector] = useState("motor1");
  const [valueMotor1, setValueMotor1] = useState(
    JSON.parse(localStorage.getItem("pump1Status"))
  );
  const [valueMotor2, setValueMotor2] = useState(
    JSON.parse(localStorage.getItem("pump2Status"))
  );
  const [data1, setData] = useState([]);
  const dataChart = data1.slice(-30);
  const [totalPump1, setTotalPump1] = useState();
  const [totalPump2, setTotalPump2] = useState();
  // const [totalPump3, setTotalPump3] = useState();
  const [startThreshold, setStartThreshold] = useState(
    localStorage.getItem("low")
  );
  const [stopThreshold, setStopThreshold] = useState(
    localStorage.getItem("up")
  );
  const [frequencyPump, setFrequencyPumpd] = useState(
    localStorage.getItem("frequencyPump")
  );
  const [cycleSample, setCycleSample] = useState(
    localStorage.getItem("cycleSample")
  );

  const notifySucces = (message) => {
    toast.success(message, {
      position: "top-center", // Position at the top
      autoClose: 3000, // Auto close after 3 seconds
    });
  };
  const notifyInfo = (message) => {
    toast.info(message, {
      position: "top-center", // Position at the top
      autoClose: 3000, // Auto close after 3 seconds
    });
  };
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center", // Position at the top
      autoClose: 3000, // Auto close after 3 seconds
    });
  };
  const [pumps, setPumps] = useState([valueMotor1, valueMotor2]);
  const [clickCount, setClickCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const lastClickTimeRef = useRef(0);
  const [Flag, setFlag] = useState();

  const [VolumeDayMotor1, setVolumeDayMotor1] = useState(0);
  const [VolumeDayMotor2, setVolumeDayMotor2] = useState(0);
  const timeDayMotor1 = 12;
  const timeDayMotor2 = 12;

  // Lấy token
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;
  const role = localStorage.getItem("role");

  const handleStartThresholdChange = (event) => {
    if (role == "admin") {
      setStartThreshold(event.target.value);
      localStorage.setItem("HUMI_MIN", event.target.value);
    } else {
      notifyError("Permission Denied!");
    }
  };
  const handleStopThresholdChange = (event) => {
    if (role == "admin") {
      localStorage.setItem("HUMI_MAX", event.target.value);
      setStopThreshold(event.target.value);
    } else {
      notifyError("Permission Denied!");
    }
  };
  const handleFrequencyPumpdChange = (event) => {
    if (role == "admin") {
      setFrequencyPumpd(event.target.value);
    } else {
      notifyError("Permission Denied!");
    }
  };

  const handleSaveClick = async () => {
    const url = url_api + `threshold/humi`;
    if (role == "admin") {
      try {
        const response = await axios.post(
          url,
          {
            attribute: "humi",
            upper: stopThreshold,
            lower: startThreshold,
          },
          {
            headers: {
              accept: "application/json",
              // "Content-Type": "application/json",
              Authorization: access_token,
            },
          }
        );
        // console.log("response humi", response.data);
        notifySucces("Update Thresh for humi success");
      } catch (error) {
        console.error("Error:", error);
        notifyError(error);
      }
    } else {
      notifyError("Permission Denied!");
    }
  };
  const handleSaveFrequencyPumpClick = async () => {
    const url = url_api + `inv/${frequencyPump}`;
    if (role == "admin") {
      try {
        const response = await axios.post(
          url,
          {},
          {
            headers: {
              accept: "application/json",
              // "Content-Type": "application/json",
              Authorization: access_token,
            },
          }
        );

        notifySucces(response.data["message"]);
      } catch (error) {
        console.error("Error:", error);
        notifyError(error);
      }
    } else {
      notifyError("Permission Denied!");
    }
  };
  const handleSaveCycleSample = async () => {
    const url = url_api + `spam/${cycleSample}`;

    if (role == "admin") {
      try {
        const response = await axios.post(
          url,
          {},
          {
            headers: {
              accept: "application/json",
              Authorization: access_token,
            },
          }
        );

        notifySucces(response.data["message"]);
      } catch (error) {
        console.error("Error:", error);
        notifyError(error);
      }
    } else {
      notifyError("Permission Denied!");
    }
  };
  const getHumiThresh = async () => {
    const response = await axios.get(url_api + "threshold/humi", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log(response);
    localStorage.setItem("low", response.data["lower"]);
    localStorage.setItem("up", response.data["upper"]);
  };
  const getFrequencyPump = async () => {
    const response = await axios.get(url_api + "inv", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    setFrequencyPumpd(response.data);
    localStorage.setItem("frequencyPump", response.data);
  };
  const getSampleCycle = async () => {
    const response = await axios.get(url_api + "spam", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setCycleSample(response.data);
    localStorage.setItem("cycleSample", response.data);
  };

  // Tải trạng thái từ localStorage khi component mount
  useEffect(() => {
    const storedLockStatus = localStorage.getItem("isLocked");
    const storedTimeLeft = localStorage.getItem("timeLeft");
    const storedClickCount = localStorage.getItem("clickCount");

    if (storedLockStatus === "true") {
      const timeRemaining = parseInt(storedTimeLeft, 10) - Date.now();
      if (timeRemaining > 0) {
        setIsLocked(true);
        setTimeLeft(timeRemaining);
      } else {
        localStorage.removeItem("isLocked");
        localStorage.removeItem("timeLeft");
        setIsLocked(false);
      }
    }

    if (storedClickCount) {
      setClickCount(parseInt(storedClickCount, 10));
    }
  }, []);

  // Lưu trạng thái vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("clickCount", clickCount);
    if (isLocked) {
      localStorage.setItem("isLocked", "true");
      localStorage.setItem("timeLeft", (Date.now() + timeLeft).toString());
    } else {
      localStorage.removeItem("isLocked");
      localStorage.removeItem("timeLeft");
    }
  }, [clickCount, isLocked, timeLeft]);

  // Xử lý bộ đếm ngược
  useEffect(() => {
    let timer;
    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1000);
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsLocked(false);
      setClickCount(0);
    }
    return () => clearInterval(timer);
  }, [isLocked, timeLeft]);

  const getPumpView = async () => {
    const response = await axios.get(url_api + "vol", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setVolumeDayMotor1(response.data["pump1"]);
    setVolumeDayMotor2(response.data["pump2"]);
  };

  // Freq, Thresh
  useEffect(() => {
    getHumiThresh();
    getFrequencyPump();
    getSampleCycle();
    getPumpView();
  }, []);

  const handleClick = async (index) => {
    if (isLocked) return;

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    if (timeSinceLastClick <= DOUBLE_CLICK_THRESHOLD) {
      setClickCount((prev) => {
        const newClickCount = prev + 1;
        if (newClickCount >= MAX_CLICKS) {
          setIsLocked(true);
          setTimeLeft(LOCK_DURATION);
        }
        return newClickCount;
      });
    } else {
      setClickCount(1);
    }
    lastClickTimeRef.current = now;

    setPumps(pumps.map((pump, i) => (i === index ? !pump : pump)));
    setFlag(index + 1);
  };
  if (Flag) {
    //gửi control lên api
    const controlPanel = async () => {
      try {
        const url = url_api + `motor/${Flag}`;
        const response = await axios.post(
          url,
          {
            status: pumps[Flag - 1],
          },
          {
            headers: {
              accept: "application/json",
              Authorization: access_token,
            },
          }
        );
        if (pumps[Flag - 1]) {
          notifyInfo(`Pump ${Flag} is ON`);
        } else {
          notifyInfo(`Pump ${Flag} is OFF`);
        }
      } catch (error) {
        console.error("Error:", error);
        notifyError(error);
      }
    };
    controlPanel();
    setFlag(false);
  }
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const dataMotor = localStorage.getItem("dataMotor");
  const dt1 = JSON.parse(dataMotor);

  const generateRandomValues = () => {
    setTotalPump1(Math.floor(Math.random() * 100) + 1);
    setTotalPump2(Math.floor(Math.random() * 100) + 1);
  };
  useEffect(() => {
    const ciupezoi = setInterval(() => {
      generateRandomValues();
    }, 6000);
  }, []);
    useEffect(() => {
    const intervalId = setInterval(() => {
      setValueMotor1(JSON.parse(localStorage.getItem("pump1Status")));
      setValueMotor2(JSON.parse(localStorage.getItem("pump2Status")));
    }, 1000);

    // Cleanup function để xóa interval khi component unmount
    return () => clearInterval(intervalId);
  });

  // ve total pump

  const labels = ["Pump 1", "Pump 2"];
  const data2 = {
    labels: labels,
    datasets: [
      {
        axis: "y",
        label: "Total in a Week",

        data: [totalPump1, totalPump2],
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
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Volume (liters)", // Set the y-axis title with the unit
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

  const ModeControl = async (e) => {
    try {
      const response = await axios.post(
        url_api + "control_mode",
        { mode: e.target.checked },
        {
          headers: {
            accept: "application/json",
            Authorization: access_token,
          },
        }
      );

      const responseMode = await axios.get(url_api + "control_mode", {
        headers: {
          Authorization: access_token,
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setIsChecked(responseMode.data["system_mode"]);
      localStorage.setItem("isChecked", responseMode.data["system_mode"]);

      //   localStorage.setItem("isChecked", responseMode.data["system_mode"]);
    } catch (error) {
      notifyError(error.response.data["detail"]);
      console.error("Error:", error.response.data["detail"]);
    }
  };

  return (
    <div className="flex  h-full w-full ">
      {/* -----------------------PC View----------------------- */}

      <div className="hidden sm:block w-full">
        <div className="flex p-4 h-full w-full gap-3  ">
          {/* ----------------------- View Control Panel----------------------- */}

          <div className="p-4 h-full w-2/3  bg-teal-100 rounded-3xl ">
            <h1 className="ml-4 font-bold text-center mb-4 ">PUMP VIEW</h1>
            <div className="flex left-1 gap-3 items-center justify-center">
              <div className=" flex flex-col  items-center h-1/6 w-36 p-2  shadow-xl bg-white text-black rounded-md mr-2 ">
                <div class="flex justify-between text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-engine"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 10v6" />
                    <path d="M12 5v3" />
                    <path d="M10 5h4" />
                    <path d="M5 13h-2" />
                    <path d="M6 10h2l2 -2h3.382a1 1 0 0 1 .894 .553l1.448 2.894a1 1 0 0 0 .894 .553h1.382v-2h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2v-2h-3v2a1 1 0 0 1 -1 1h-3.465a1 1 0 0 1 -.832 -.445l-1.703 -2.555h-2v-6z" />
                  </svg>
                  <p className="text-left">
                    <b>Motor 1</b>
                  </p>
                </div>

                <div class="ml-2 w-full flex-1">
                  <div class="mt-1 text-base text-gray-600">
                    Status : <span>{valueMotor1 ? "ON" : "OFF"}</span>
                  </div>
                  {/* <div class="mt-1 text-base text-gray-600">
                    Time : {timeDayMotor1}h
                  </div> */}
                  <div class="mt-1 text-base text-gray-600">
                    Flow : {VolumeDayMotor1 + "  lits"}
                  </div>
                </div>
              </div>
              <div className=" flex flex-col  items-center h-1/6 w-36 p-2 shadow-xl bg-white text-black rounded-md mr-2 ">
                <div class="flex justify-between text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-engine"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 10v6" />
                    <path d="M12 5v3" />
                    <path d="M10 5h4" />
                    <path d="M5 13h-2" />
                    <path d="M6 10h2l2 -2h3.382a1 1 0 0 1 .894 .553l1.448 2.894a1 1 0 0 0 .894 .553h1.382v-2h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2v-2h-3v2a1 1 0 0 1 -1 1h-3.465a1 1 0 0 1 -.832 -.445l-1.703 -2.555h-2v-6z" />
                  </svg>
                  <p className="text-left">
                    <b>Motor 2</b>
                  </p>
                </div>

                <div class="ml-2 w-full flex-1">
                  <div class="mt-1 text-base text-gray-600">
                    Status : <span>{valueMotor2 ? "ON" : "OFF"}</span>
                  </div>
                  {/* <div class="mt-1 text-base text-gray-600">
                    Time : {timeDayMotor2}h
                  </div> */}
                  <div class="mt-1 text-base text-gray-600">
                    Flow : {VolumeDayMotor2 + "  lits"}
                  </div>
                </div>
              </div>
            </div>
            <div className=" h-2/3 w-full p-4 mt-3">
              <div className="relative p-4 h-full mt-2 bg-white border-2 border-blue-500 rounded-2xl items-center justify-center">
                <div className="ml-15 mt-10" style={{ maxWidth: "4S00px" }}>
                  <Bar data={data2} options={optionsBar} />
                </div>
              </div>
            </div>
          </div>
          {/* -----------------------End View Control Panel----------------------- */}

          {/* -----------------------Control Pump---------------------- */}

          <div className="p-4 h-full w-2/3 rounded-3xl bg-teal-100 ">
            <h1 className="ml-4 font-bold text-center mb-4"> Control Pump</h1>
            {/* Select mode */}

            <div className=" flex flex-col bg-white bg-opacity-50 p-2  rounded-xl ">
              <div className=" mt-1 flex">
                <div class="list-none w-3/5 flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  SET FREQUENCY PUMP (Hz)
                </div>
                <input
                  type="text"
                  value={frequencyPump}
                  onChange={handleFrequencyPumpdChange}
                  className="text-center w-1/5  border-2 border-gray-700"
                />

                <button
                  onClick={handleSaveFrequencyPumpClick}
                  className="ml-2 w-1/5 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
              <div className=" mt-1 flex">
                <div class="list-none w-3/5 flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  SAMPLE CYCLE (Seconds)
                </div>
                <input
                  type="text"
                  value={cycleSample}
                  onChange={(event) => setCycleSample(event.target.value)}
                  className=" text-center w-1/5  border-2 border-gray-700 "
                />

                <button
                  onClick={handleSaveCycleSample}
                  className="ml-2 w-1/5 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>

              <label class="ml-1 mt-2 inline-flex font-bold cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isChecked}
                  onChange={ModeControl}
                />
                <div class="relative w-10 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                <span class="ml-3 text-sm  text-gray-900 dark:text-gray-300 font-bold">
                  {isChecked ? "Mode Auto" : "Mode Manual"}
                </span>
              </label>
            </div>
            {/* End Select mode */}
            {isChecked ? (
              <div className="p-4 h-5/6 w-full  ">
                <div className=" h-full w-full">
                  <div class="flex flex-col gap-3">
                    <div className="p-4 relative h-60 mt-2 bg-white border-2 border-blue-500 rounded-2xl ">
                      <div className="mb-4">
                        <div class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                          SET RULE
                        </div>

                        <p className="text-gray-600 mb-2">
                          Pump START when Humidity less than{" "}
                          <span className="font-bold">{startThreshold}%</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={startThreshold}
                            onChange={handleStartThresholdChange}
                            className="w-2/3 appearance-none h-3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, red, green ${startThreshold}%, #ccc ${startThreshold}%)`,
                            }}
                          />
                          <input
                            type="text"
                            min="0"
                            max="100"
                            value={startThreshold}
                            onChange={handleStartThresholdChange}
                            className="text-right w-1/5"
                          />
                          %
                          <button
                            onClick={handleSaveClick}
                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 mb-2">
                          Pump STOP when Humidity greater than
                          <span className="font-bold">{stopThreshold}%</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={stopThreshold}
                            onChange={handleStopThresholdChange}
                            className="w-2/3 appearance-none h-3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, green, red ${stopThreshold}%, #ccc ${stopThreshold}%)`,
                            }}
                          />
                          <input
                            type="text"
                            min="0"
                            max="100"
                            value={stopThreshold}
                            onChange={handleStopThresholdChange}
                            className="text-right w-1/5"
                          />
                          %
                          <button
                            onClick={handleSaveClick}
                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 h-5/6 w-full  ">
                <div className=" h-full w-full">
                  <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-3xl shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-700">
                      Pump Control
                    </h1>
                    {pumps.map((pump, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 mb-4 bg-white border border-gray-300 rounded-md shadow-sm ${
                          pump ? "bg-gray-200" : ""
                        }`}
                      >
                        <span
                          className={`text-lg font-medium ${
                            pump ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          Pump {index + 1}: {pump ? "ON" : "OFF"}
                        </span>
                        <button
                          onClick={() => handleClick(index)}
                          className={`px-4 py-2 rounded-md font-medium text-white transition-colors duration-200 ${
                            isLocked
                              ? "bg-gray-500 cursor-not-allowed"
                              : pump
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          disabled={isLocked}
                        >
                          {isLocked
                            ? `Locked: ${formatTime(timeLeft)}`
                            : pump
                            ? "Turn Off"
                            : "Turn On"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* -----------------------End Control Pump---------------------- */}
        </div>
      </div>

      {/* -----------------------Mobile View----------------------- */}
      <div className="sm:hidden h-screen w-screen ">
        <ul className=" p-2 flex justify-center w-full overflow-x-auto ">
          <li class="p-4   list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded ">
            <span
              class="ml-2 underline hover:underline-offset-8  "
              onClick={() => {
                setDisplay("1");
              }}
            >
              Pump View
            </span>
          </li>
          <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-4">
            <span
              class="ml-2 underline hover:underline-offset-8 "
              onClick={() => {
                setDisplay("0");
              }}
            >
              Pump Control
            </span>
          </li>
        </ul>
        {Display === "1" && (
          <div className=" ">
            <h1 className="ml-4 font-bold text-center mb-4 ">PUMP VIEW</h1>
            <div className="flex left-1 gap-3 items-center justify-center">
              <div className=" flex flex-col  items-center h-1/6 w-36 p-2  shadow-xl bg-white text-black rounded-md mr-2 ">
                <div class="flex justify-between text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-engine"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 10v6" />
                    <path d="M12 5v3" />
                    <path d="M10 5h4" />
                    <path d="M5 13h-2" />
                    <path d="M6 10h2l2 -2h3.382a1 1 0 0 1 .894 .553l1.448 2.894a1 1 0 0 0 .894 .553h1.382v-2h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2v-2h-3v2a1 1 0 0 1 -1 1h-3.465a1 1 0 0 1 -.832 -.445l-1.703 -2.555h-2v-6z" />
                  </svg>
                  <p className="text-left">
                    <b>Motor 1</b>
                  </p>
                </div>

                <div class="ml-2 w-full flex-1">
                  <div class="mt-1 text-base text-gray-600">
                    Status : <span>{valueMotor1 ? "ON" : "OFF"}</span>
                  </div>
                  {/* <div class="mt-1 text-base text-gray-600">
                    Time : {timeDayMotor1}h
                  </div> */}
                  <div class="mt-1 text-base text-gray-600">
                    Flow : {VolumeDayMotor1 + "  lits"}
                  </div>
                </div>
              </div>
              <div className=" flex flex-col  items-center h-1/6 w-36 p-2 shadow-xl bg-white text-black rounded-md mr-2 ">
                <div class="flex justify-between text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-engine"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 10v6" />
                    <path d="M12 5v3" />
                    <path d="M10 5h4" />
                    <path d="M5 13h-2" />
                    <path d="M6 10h2l2 -2h3.382a1 1 0 0 1 .894 .553l1.448 2.894a1 1 0 0 0 .894 .553h1.382v-2h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2v-2h-3v2a1 1 0 0 1 -1 1h-3.465a1 1 0 0 1 -.832 -.445l-1.703 -2.555h-2v-6z" />
                  </svg>
                  <p className="text-left">
                    <b>Motor 2</b>
                  </p>
                </div>

                <div class="ml-2 w-full flex-1">
                  <div class="mt-1 text-base text-gray-600">
                    Status : <span>{valueMotor2 ? "ON" : "OFF"}</span>
                  </div>
                  {/* <div class="mt-1 text-base text-gray-600">
                    Time : {timeDayMotor2}h
                  </div> */}
                  <div class="mt-1 text-base text-gray-600">
                    Flow : {VolumeDayMotor2 + "  lits"}
                  </div>
                </div>
              </div>
            </div>
            <div className=" h-2/3 w-full p-4 mt-3">
              <div className="relative p-4 h-full mt-2 bg-white border-2 border-blue-500 rounded-2xl items-center justify-center">
                <div className="ml-15 mt-10" style={{ maxWidth: "4S00px" }}>
                  <Bar data={data2} options={optionsBar} />
                </div>
              </div>
            </div>
          </div>
        )}
        {Display === "0" && (
          <div className=" ">
            <h1 className="ml-4 font-bold text-center mb-4"> Control Pump</h1>
            {/* Select mode */}
            <div className="bg-white bg-opacity-50 p-2 items-center justify-center rounded-xl">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isChecked}
                  onChange={ModeControl}
                />
                <div class="relative w-10 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {isChecked ? "Mode Auto" : "Mode Manual"}
                </span>
              </label>
            </div>
            {/* End Select mode */}
            {isChecked ? (
              <div className="p-4 h-5/6 w-full  ">
                <div className=" h-full w-full">
                  <div class="flex flex-col gap-3">
                    <div className="p-4 relative h-60 mt-2 bg-white border-2 border-blue-500 rounded-2xl ">
                      <div className="mb-4">
                        <div class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                          SET RULE
                        </div>

                        <p className="text-gray-600 mb-2">
                          Pump START when Humidity less than{" "}
                          <span className="font-bold">{startThreshold}%</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={startThreshold}
                            onChange={handleStartThresholdChange}
                            className="w-2/3 appearance-none h-3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, red, green ${startThreshold}%, #ccc ${startThreshold}%)`,
                            }}
                          />
                          <input
                            type="text"
                            min="0"
                            max="100"
                            value={startThreshold}
                            onChange={handleStartThresholdChange}
                            className="text-right w-1/5"
                          />
                          %
                          <button
                            onClick={handleSaveClick}
                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 mb-2">
                          Pump STOP when Humidity greater than{" "}
                          <span className="font-bold">{stopThreshold}%</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={stopThreshold}
                            onChange={handleStopThresholdChange}
                            className="w-2/3 appearance-none h-3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, green, red ${stopThreshold}%, #ccc ${stopThreshold}%)`,
                            }}
                          />
                          <input
                            type="text"
                            min="0"
                            max="100"
                            value={stopThreshold}
                            onChange={handleStopThresholdChange}
                            className="text-right w-1/5"
                          />
                          %
                          <button
                            onClick={handleSaveClick}
                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 relative h-40 mt-2 bg-white border-2 border-blue-500 rounded-2xl ">
                      <div className="mb-4">
                        <div class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                          SET FREQUENCY PUMP
                        </div>

                        <p className="text-gray-600 mb-2">
                          Pump speed control{" "}
                          <span className="font-bold">{frequencyPump}Hz</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={frequencyPump}
                            onChange={handleFrequencyPumpdChange}
                            className="w-2/3 appearance-none h-3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, green, red ${
                                frequencyPump * 2
                              }%, #ccc ${frequencyPump * 2}%)`,
                            }}
                          />
                          <input
                            type="text"
                            min="0"
                            max="50"
                            value={frequencyPump}
                            onChange={handleFrequencyPumpdChange}
                            className="text-right w-1/5"
                          />
                          Hz
                          <button
                            onClick={handleSaveFrequencyPumpClick}
                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 h-5/6 w-full  ">
                <div className=" h-full w-full">
                  <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-3xl shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-700">
                      Pump Control
                    </h1>
                    {pumps.map((pump, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 mb-4 bg-white border border-gray-300 rounded-md shadow-sm ${
                          pump ? "bg-gray-200" : ""
                        }`}
                      >
                        <span
                          className={`text-lg font-medium ${
                            pump ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          Pump {index + 1}: {pump ? "ON" : "OFF"}
                        </span>
                        <button
                          onClick={() => handleClick(index)}
                          className={`px-4 py-2 rounded-md font-medium text-white transition-colors duration-200 ${
                            isLocked
                              ? "bg-gray-500 cursor-not-allowed"
                              : pump
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          disabled={isLocked}
                        >
                          {isLocked
                            ? `Locked: ${formatTime(timeLeft)}`
                            : pump
                            ? "Turn Off"
                            : "Turn On"}
                        </button>
                      </div>
                    ))}
                    <div className="p-4 relative h-40 mt-2 bg-white border-2 border-blue-500 rounded-2xl ">
                      <div className="mb-4">
                        <div class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                          SET FREQUENCY PUMP
                        </div>

                        <p className="text-gray-600 mb-2">
                          Pump speed control{" "}
                          <span className="font-bold">{frequencyPump}Hz</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={frequencyPump}
                            onChange={handleFrequencyPumpdChange}
                            className="w-2/3 appearance-none h-3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, green, red ${
                                frequencyPump * 2
                              }%, #ccc ${frequencyPump * 2}%)`,
                            }}
                          />
                          <input
                            type="text"
                            min="0"
                            max="50"
                            value={frequencyPump}
                            onChange={handleFrequencyPumpdChange}
                            className="text-right w-1/5"
                          />
                          Hz
                          <button
                            onClick={handleSaveFrequencyPumpClick}
                            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Control;
