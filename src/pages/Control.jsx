import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
import axios from "./checkToken";
import { Bar } from "react-chartjs-2";
import { Dialog } from "@headlessui/react";

import { url_api, url_local, url_data } from "../Provider.jsx";
import {
  notifySuccess,
  notifyInfo,
  notifyError,
} from "./include/notifications";
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

const Control = () => {
  // Lấy token
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;
  const role = localStorage.getItem("role");

  //status mode
  const [isChecked, setIsChecked] = useState(
    JSON.parse(localStorage.getItem("isChecked"))
  );
  const [StatusSwitchMode, setStatusSwitchMode] = useState();
  //volume
  const [dataVol, setDataVol] = useState();
  const [totals, setTotals] = useState({});
  // Change display in mobile view
  const [Display, setDisplay] = useState("1");
  // Dialog status
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //pump status
  const [valueMotor1, setValueMotor1] = useState(
    JSON.parse(localStorage.getItem("pump1Status"))
  );
  const [pump, setPumpSend] = useState(valueMotor1);
  const [statusToContol, setStatusToContol] = useState();
  //mode in manual
  const [PassToCheck, SetPassCheck] = useState("");
  const [timerSend, setTimer] = useState(0);
  const [inputTime, setInputTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  //mode sequent
  const [TimeOn, setTimeOn] = useState(0);
  const [TimeOff, setTimeOff] = useState(0);
  // volume in week
  const [totalPump1, setTotalPump1] = useState();
  const [VolumeDayMotor1, setVolumeDayMotor1] = useState(
    JSON.parse(localStorage.getItem("TotalVolume"))
  );

  //create thresh humi
  const [startThreshold, setStartThreshold] = useState(
    localStorage.getItem("low")
  );
  const [stopThreshold, setStopThreshold] = useState(
    localStorage.getItem("up")
  );

  //thresh freq, cycle
  const [frequencyPump, setFrequencyPumpd] = useState(
    localStorage.getItem("frequencyPump")
  );
  const [cycleSample, setCycleSample] = useState(
    localStorage.getItem("cycleSample")
  );

  // flag to post pump status
  const [Flag, setFlag] = useState();

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

  const filteVolume = async (listday, data) => {
    console.log("aaaaaaaaa");
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
      totalsObj[date] = await filteVolume(date, dataVol);
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

  // change thresh humi and post
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

        notifySuccess("Update Thresh for humi success");
      } catch (error) {
        console.error("Error:", error);
        notifyError(error);
      }
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

        notifySuccess(response.data["message"]);
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

        notifySuccess(response.data["message"]);
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
  const getVol = async () => {
    const responseVol = await axios.get(url_data + "api/volume/0", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log("responseVol.data", responseVol.data);
    setDataVol(responseVol.data);
  };

  // Freq, Thresh
  useEffect(() => {
    getHumiThresh();
    getFrequencyPump();
    getSampleCycle();
    getVol();
  }, []);
  const controlPanel = async () => {
    try {
      const url = url_api + `control/motor`;
      const response = await axios.post(
        url,
        {
          status: pump,
        },
        {
          headers: {
            accept: "application/json",
            Authorization: access_token,
          },
        }
      );
      if (pump) {
        notifyInfo(`Pump  is ON`);
      } else {
        notifyInfo(`Pump is OFF`);
      }
    } catch (error) {
      console.error("Error:", error);
      notifyError(error);
    }
  };
  const handleClick = async () => {
    if (role == "admin") {
      setPumpSend(!valueMotor1);
      setFlag(true);
    } else {
      notifyError("Permission Denied!");
    }
  };
  if (Flag) {
    controlPanel();
    setFlag(false);
  }

  const dataMotor = localStorage.getItem("dataMotor");
  const dt1 = JSON.parse(dataMotor);

  const postMode = async (mode, data) => {
    try {
      const response = await axios.post(url_api + "control/" + mode, data, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: access_token,
        },
      });

      const responseMode = await axios.get(url_api + "control_mode", {
        headers: {
          Authorization: access_token,
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setIsChecked(responseMode.data["system_mode"]);
      localStorage.setItem(
        "isChecked",
        JSON.stringify(responseMode.data["system_mode"])
      );
    } catch (error) {
      console.error(error);
    }
  };
  const sendMode = async (mode) => {
    if (mode == "sequent") {
      const data = { on: TimeOn, off: TimeOff };
      postMode(mode, data);
    } else {
      const data = { status: true, timerSend: 0 };
      postMode(mode, data);
    }
  };
  const ModeControl = async (e) => {
    setStatusSwitchMode(e.target.checked);
    if (e.target.checked) {
      const mode = "auto";
      const data = { status: e.target.checked };
      postMode(mode, data);
    } else {
      const mode = "manual";
      const data = { status: e.target.checked };
      postMode(mode, data);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setValueMotor1(JSON.parse(localStorage.getItem("pump1Status")));
      setPumpSend(JSON.parse(localStorage.getItem("pump1Status")));
      setIsChecked(JSON.parse(localStorage.getItem("isChecked")));
      setVolumeDayMotor1(JSON.parse(localStorage.getItem("TotalVolume")));
      calculateTotals();
    }, 1000);

    // Cleanup function để xóa interval khi component unmount
    return () => clearInterval(intervalId);
  });
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = async () => {
    if (isChecked == "manual") {
      if (inputTime > 0) {
        setTimer(inputTime * 60);
        handleClick();
        setIsLocked(true);
      }
      const registerform = {
        timer: timerSend,
        status: pump,
        masterusr: localStorage.getItem("username"),
        masterpwd: PassToCheck,
      };
      console.log("typeof pump", typeof pump);
      postMode(isChecked, registerform);
      console.log("isLocked", isLocked);
    } else {
      const registerform = {
        on: TimeOn,
        off: TimeOff,
        masterusr: localStorage.getItem("username"),
        masterpwd: PassToCheck,
      };
      console.log("typeof TimeOff", typeof TimeOff);
      postMode(isChecked, registerform);
    }

    setIsDialogOpen(false);
  };

  const hiddenDialog = async () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (timerSend > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timerSend === 0 && isLocked) {
      setIsLocked(false);
    }
  }, [timerSend]);
  const minutes = Math.floor(timerSend / 60);
  const seconds = timerSend % 60;
  return (
    <div className="flex  h-full w-full ">
      {/* Dialog*/}
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        {isChecked === "manual" ? (
          <div className="flex items-center bg-opacity-75 bg-black justify-center min-h-screen px-4">
            <div className="relative bg-white rounded-lg max-w-sm mx-auto p-6">
              <div className="text-lg font-bold text-red-600">Notification</div>
              <div className="mt-2 text-sm font-bold  text-gray-500">
                Set timer to turn {valueMotor1 ? "off" : "on"}.
              </div>

              <input
                type="number"
                name="password"
                placeholder="Skip if not set a timer (min)."
                className="mt-4 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                onChange={(e) => setInputTime(e.target.value)}
              />

              <div className=" text-sm font-bold  text-gray-500">
                Please enter a password to proceed.
              </div>

              <input
                type="password"
                id="password"
                name="password"
                className="mt-4 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                onChange={(e) => SetPassCheck(e.target.value)}
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={hiddenDialog}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={closeDialog}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors duration-150"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center bg-opacity-75 bg-black justify-center min-h-screen px-4">
            <div className="relative bg-white rounded-lg max-w-sm mx-auto p-6">
              <div className="text-lg font-bold text-red-600">Notification</div>

              <div className=" text-sm font-bold  text-gray-500">
                Please enter a password to proceed.
              </div>

              <input
                type="password"
                id="password"
                name="password"
                className="mt-4 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                onChange={(e) => SetPassCheck(e.target.value)}
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={hiddenDialog}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={closeDialog}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors duration-150"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
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
            </div>
            <div className=" h-2/3 w-full p-4 mt-3">
              <div className="relative p-4 h-full mt-2 bg-white border-2 border-blue-500 rounded-2xl items-center justify-center">
                <div className="ml-15 mt-10" style={{ maxWidth: "4S00px" }}>
                  {" "}
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

              <div className=" mt-1 flex">
                <div class="list-none w-3/5 flex items-center text-blue-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  {/* {isChecked} */}
                  {isChecked == "auto" ? "Auto" : "Manual"}
                </div>

                <label class="ml-1 mt-2 inline-flex font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={StatusSwitchMode}
                    onChange={(e) => ModeControl(e)}
                  />
                  <div class="relative w-10 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
            {/* End Select mode */}
            {isChecked == "auto" ? (
              <div className="p-4 h-5/6 w-full  ">
                <div className=" h-full w-full">
                  <div class="flex flex-col gap-3">
                    <div className="p-4 relative h-60 mt-2 bg-white border-2 border-blue-500 rounded-2xl ">
                      <div className="mb-4">
                        <h1 className="text-3xl font-bold mb-6 text-gray-700">
                          Auto Mode
                        </h1>

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
                  <div className="max-w-4xl mx-auto  bg-white border border-gray-300 rounded-3xl shadow-md">
                    <ul className=" flex justify-center w-full overflow-x-auto ">
                      <li class="   list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded ">
                        <span
                          class="ml-2 underline hover:underline-offset-8  "
                          onClick={() => {
                            sendMode("manual");
                          }}
                        >
                          Manual
                        </span>
                      </li>
                      <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-4">
                        <span
                          class="ml-2 underline hover:underline-offset-8 "
                          onClick={() => {
                            sendMode("sequent");
                          }}
                        >
                          Sequent
                        </span>
                      </li>
                    </ul>
                    <div className="p-4">
                      {isChecked == "manual" ? (
                        <div
                          className={`mt-2 flex items-center justify-between p-4 mb-4 bg-white border border-gray-300 rounded-md shadow-sm ${
                            pump ? "bg-gray-200" : ""
                          }`}
                        >
                          <span
                            className={`text-lg font-medium ${
                              pump ? "text-blue-600" : "text-gray-600"
                            }`}
                          >
                            Pump : {pump ? "ON" : "OFF"}
                          </span>

                          <button
                            onClick={openDialog}
                            className={`px-4 py-2 rounded-md font-medium text-white transition-colors duration-200 ${
                              pump
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            } ${
                              isLocked ? "cursor-not-allowed opacity-50" : ""
                            }`}
                            disabled={isLocked} // Vô hiệu hóa nút khi đang khóa
                          >
                            {pump ? "Turn Off" : "Turn On"}{" "}
                            {timerSend > 0
                              ? `(${minutes}:${
                                  seconds < 10 ? `0${seconds}` : seconds
                                })`
                              : ""}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className=" ml-2 text-sm font-family:Times New Roman">
                            Chế độ bơm liên tục là chế độ điều khiển máy bơm
                            theo chu kỳ, trong đó Time On là thời gian máy bơm
                            hoạt động và Time Off là thời gian máy bơm ngừng
                            hoạt động (tính bằng phút).
                          </p>
                          <br></br>
                          <p className="ml-2 text-sm font-family:Times New Roman">
                            Giả sử: Time On = 180 phút và Time Off = 30 phút.
                            Máy bơm sẽ hoạt động trong 180 phút. Sau khi hết
                            thời gian hoạt động (Time On), máy bơm sẽ ngừng
                            trong 30 phút (Time Off) và sau đó tự động khởi động
                            lại chu kỳ.
                          </p>
                          <br></br>
                          <div
                            className={` flex p-2 items-center justify-between  mb-4 bg-white border border-gray-300 rounded-3xl shadow-sm `}
                          >
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
                              class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus text-gray-300"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                              <path d="M9 12h6" />
                              <path d="M12 9v6" />
                            </svg>

                            <input
                              type="number"
                              placeholder="Time On"
                              // value={TimeOn}
                              onChange={(e) => {
                                setTimeOn(e.target.value);
                              }}
                              className="ml-2 text-center w-2/5 border-2 border-gray-400 placeholder-slate-300"
                              required
                            />

                            <input
                              type="number"
                              // value={TimeOff}
                              placeholder="Time Off"
                              onChange={(e) => {
                                setTimeOff(e.target.value);
                              }}
                              className="ml-2 text-center w-2/5 border-2 border-gray-400 placeholder-slate-300 "
                            />
                            <button
                              onClick={openDialog}
                              className="ml-2 w-1/5 px-3 py-1 bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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
            </div>
            <div className=" h-2/3 w-full p-4 mt-3">
              <div className="relative p-4 h-full mt-2 bg-white border-2 border-blue-500 rounded-2xl items-center justify-center">
                <div className="ml-15 mt-10" style={{ maxWidth: "400px" }}>
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

              <div className=" mt-1 flex">
                <div class="list-none w-3/5 flex items-center text-blue-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  {/* {isChecked} */}
                  {isChecked == "auto" ? "Auto" : "Manual"}
                </div>

                <label class="ml-1 mt-2 inline-flex font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={StatusSwitchMode}
                    onChange={(e) => ModeControl(e)}
                  />
                  <div class="relative w-10 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
            {/* End Select mode */}
            {isChecked == "auto" ? (
              <div className="p-4 h-5/6 w-full  ">
                <div className=" h-full w-full">
                  <div class="flex flex-col gap-3">
                    <div className="p-4 relative h-72 mt-2 bg-white border-2 border-blue-500 rounded-2xl ">
                      <div className="mb-4">
                        <h1 className="text-3xl font-bold mb-6 text-gray-700">
                          Auto Mode
                        </h1>

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
                  <div className="max-w-4xl mx-auto  bg-white border border-gray-300 rounded-3xl shadow-md">
                    <ul className=" flex justify-center w-full overflow-x-auto ">
                      <li class="   list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded ">
                        <span
                          class="ml-2 underline hover:underline-offset-8  "
                          onClick={() => {
                            sendMode("manual");
                          }}
                        >
                          Manual
                        </span>
                      </li>
                      <li class="list-none flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-4">
                        <span
                          class="ml-2 underline hover:underline-offset-8 "
                          onClick={() => {
                            sendMode("sequent");
                          }}
                        >
                          Sequent
                        </span>
                      </li>
                    </ul>
                    <div className="p-4">
                      {isChecked == "manual" ? (
                        <div
                          className={`mt-2 flex items-center justify-between p-4 mb-4 bg-white border border-gray-300 rounded-md shadow-sm ${
                            pump ? "bg-gray-200" : ""
                          }`}
                        >
                          <span
                            className={`text-lg font-medium ${
                              pump ? "text-blue-600" : "text-gray-600"
                            }`}
                          >
                            Pump : {pump ? "ON" : "OFF"}
                          </span>

                          <button
                            onClick={openDialog}
                            className={`px-4 py-2 rounded-md font-medium text-white transition-colors duration-200 ${
                              pump
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            } ${
                              isLocked ? "cursor-not-allowed opacity-50" : ""
                            }`}
                            disabled={isLocked} // Vô hiệu hóa nút khi đang khóa
                          >
                            {pump ? "Turn Off" : "Turn On"}{" "}
                            {timerSend > 0
                              ? `(${minutes}:${
                                  seconds < 10 ? `0${seconds}` : seconds
                                })`
                              : ""}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className=" ml-2 text-sm font-family:Times New Roman">
                            Chế độ bơm liên tục là chế độ điều khiển máy bơm
                            theo chu kỳ, trong đó Time On là thời gian máy bơm
                            hoạt động và Time Off là thời gian máy bơm ngừng
                            hoạt động (tính bằng phút).
                          </p>
                          <br></br>
                          <p className="ml-2 text-sm font-family:Times New Roman">
                            Giả sử: Time On = 180 phút và Time Off = 30 phút.
                            Máy bơm sẽ hoạt động trong 180 phút. Sau khi hết
                            thời gian hoạt động (Time On), máy bơm sẽ ngừng
                            trong 30 phút (Time Off) và sau đó tự động khởi động
                            lại chu kỳ.
                          </p>
                          <br></br>
                          <div
                            className={` flex p-2 items-center justify-between  mb-4 bg-white border border-gray-300 rounded-3xl shadow-sm `}
                          >
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
                              class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus text-gray-300"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                              <path d="M9 12h6" />
                              <path d="M12 9v6" />
                            </svg>

                            <input
                              type="number"
                              placeholder="Time On"
                              // value={TimeOn}
                              onChange={(e) => {
                                setTimeOn(e.target.value);
                              }}
                              className="ml-2 text-center w-2/5 border-2 border-gray-400 placeholder-slate-300"
                              required
                            />

                            <input
                              type="number"
                              // value={TimeOff}
                              placeholder="Time Off"
                              onChange={(e) => {
                                setTimeOff(e.target.value);
                              }}
                              className="ml-2 text-center w-2/5 border-2 border-gray-400 placeholder-slate-300 "
                            />
                            <button
                              onClick={openDialog}
                              className="ml-2 w-1/5 px-3 py-1 bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
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
