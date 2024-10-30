import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
import axios from "./checkToken";
import { Bar } from "react-chartjs-2";
import { Dialog } from "@headlessui/react";
import { UserManual } from "./include/DefaultData";
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
const MODE_NAME_CHANGE = [
  "Bơm tự động",
  "Bơm thủ công",
  "Bơm hẹn giờ",
  "Bơm tuần tự",
];
const MODE_NAME_GET = ["auto", "manual", "schedule", "sequent"];
function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = "00"; // Assuming seconds are always zero

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const Draft = () => {
  // Lấy token
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;
  const role = localStorage.getItem("role");

  //status mode
  const [isChecked, setIsChecked] = useState(
    JSON.parse(localStorage.getItem("isChecked"))
  );

  const [selectedMode, setSelectedMode] = useState(null);
  const [StatusSwitchMode, setStatusSwitchMode] = useState();
  const modeIndex = MODE_NAME_GET.indexOf(isChecked);
  const displayName =
    modeIndex !== -1 ? MODE_NAME_CHANGE[modeIndex] : "Không xác định";

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
  //mode in manual
  const [PassToCheck, SetPassCheck] = useState("");
  const [timerSend, setTimer] = useState(0);
  const [inputTime, setInputTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  //mode sequent
  const [TimeOn, setTimeOn] = useState(0);
  const [TimeOff, setTimeOff] = useState(0);
  //mode schedule
  const [TimeOnSchedule, setTimeOnSchedule] = useState(0);
  const [TimeOffSchedule, setTimeOffSchedule] = useState(0);
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
    const filteredData = data.filter((item) => item.date === listday);
    const maxTotal =
      filteredData.length > 0
        ? Math.max(...filteredData.map((item) => item.total))
        : 0;

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
        label: "m³",

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
          text: "Day times", // Set the y-axis title with the unit
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
        getHumiThresh();
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
    console.log(response.data["lower"]);
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

    setDataVol(responseVol.data);
  };

  // Freq, Thresh
  useEffect(() => {
    getHumiThresh();
    getFrequencyPump();
    getSampleCycle();
    getVol();
  }, []);
  const resetGateway = async () => {
    if (role == "admin") {
      const registerform = {
        masterusr: localStorage.getItem("username"),
        masterpwd: PassToCheck,
      };
      const response = await axios.post(url_api + "rsgw", registerform, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: access_token,
        },
      });

      notifyInfo(response.data["message"]);
    } else {
      notifyError("Permission Denied!");
    }
  };

  const dataMotor = localStorage.getItem("dataMotor");
  const dt1 = JSON.parse(dataMotor);

  const postMode = async (mode, data) => {
    console.log("MODE BF send", mode);
    const response = await axios.post(url_api + "control/" + mode, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: access_token,
      },
    });
    console.log("response ", response.data);
    notifyInfo(response.data["message"]);
    const responseMode = await axios.get(url_api + "api/motor/1", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(
      "assssssssssssss",
      JSON.stringify(responseMode.data[0]["mode"])
    );
    setIsChecked(responseMode.data[0]["mode"]);
    localStorage.setItem(
      "isChecked",
      JSON.stringify(responseMode.data[0]["mode"])
    );
  };
  const sendMode = async (mode) => {
    if (mode == "sequent") {
      const data = { mode: "sequent" };
      postMode(mode, data);
      setIsChecked("sequent");
    } else {
      // const data = { status: true, timerSend: 1 };
      const data = { mode: "manual" };
      postMode(mode, data);
      // setIsChecked("manual");
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
      // setIsChecked(JSON.parse(localStorage.getItem("isChecked")));
      calculateTotals();
    }, 1000);

    // Cleanup function để xóa interval khi component unmount
    return () => clearInterval(intervalId);
  });
  const openDialog = () => {
    console.log(
      formatDateTime(TimeOnSchedule),
      formatDateTime(TimeOffSchedule)
    );
    if (role == "admin") {
      setIsDialogOpen(true);
    } else {
      notifyError("Permission Denied!");
    }
  };
  // POST MODE
  const handleButtonClickMode = (index) => {
    if (role == "admin") {
      setSelectedMode(MODE_NAME_CHANGE[index]);
      console.log("Chế độ đã chọn:", MODE_NAME_GET[index]);
      let data = { mode: "" };
      postMode(MODE_NAME_GET[index], data);
    } else {
      notifyError("Permission Denied!");
    }
  };
  const closeDialog = async () => {
    if (isChecked == "manual") {
      if (inputTime > 0) {
        setTimer(inputTime * 60);
        setIsLocked(true);
      }
      const registerform = {
        timer: inputTime,
        status: !pump,
        masterusr: localStorage.getItem("username"),
        masterpwd: PassToCheck,
      };
      postMode("motor", registerform);
    } else {
      const registerform = {
        on: TimeOn,
        off: TimeOff,
        masterusr: localStorage.getItem("username"),
        masterpwd: PassToCheck,
      };
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
      setTimer(0);
      setInputTime(0);
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
        onClose={hiddenDialog}
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

      <div className="hidden sm:block p-4 w-full">
        <div className="flex flex-col  h-full w-full ">
          {/* Điều khiển chung */}
          <div className="  p-4 flex  h-fit w-fullrounded-3xl ">
            {/* Thay đổi chế độ điều khiển */}
            <div className="flex flex-col h-fit w-2/5 bg-white border-2 border-[#4CC9FE] p-2  rounded-xl ">
              <div className="flex">
                <strong className="w-1/2">TRẠNG THÁI HIỆN TẠI: </strong>
                <strong className="w-1/2 text-red-500 ">{displayName}</strong>
              </div>
              <div className=" mt-1 flex">
                {MODE_NAME_CHANGE.map((mode, index) => (
                  <button
                    key={index}
                    onClick={() => handleButtonClickMode(index)}
                    className=" text-white rounded-2xl "
                    style={{
                      margin: "5px",
                      padding: "10px",
                      backgroundColor:
                        isChecked === MODE_NAME_GET[index]
                          ? "#024CAA"
                          : "#EC8305",
                    }}
                  >
                    Chế độ {mode}
                  </button>
                ))}
              </div>
            </div>
            {/* END Thay đổi chế độ điều khiển */}
            {/* Bảng điều khiển tần số */}
            <div className=" ml-2 lex flex-col h-fit w-3/5 bg-white  p-2 border-2 border-[#4CC9FE] rounded-xl ">
              <div className=" mt-1 flex">
                <div class="list-none w-3/5 flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  Tần số hoạt động của máy bơm (Hz)
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
                  Chu kì lấy mẫu cảm biến (Giây)
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
                <div class="list-none w-3/5 flex items-center text-red-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                  Reset Alarm
                </div>

                <button
                  onClick={resetGateway}
                  className="mt-1 w-2/5 bg-red-500 text-white rounded-3xl "
                >
                  Reset
                </button>
              </div>
            </div>
            {/* END Bảng điều khiển tần số */}
          </div>
          {/* hướng dẫn sử dụng và bảng điều khiển */}
          <div className="p-4 flex  h-4/5 w-fullrounded-3xl  ">
            <div className="hidden w-full bg-white sm:flex border-2 border-[#185519] rounded-3xl">
              {/* HƯỚNG DẪN SỬ DỤNG */}
              <div className="w-1/3 border-r-2 border-gray-300 ml-3 mt-10 p-2">
                <h4 className="text-center">{displayName}</h4>
                <div className="mt-2">
                  <p className=" mt-2 ml-2 text-base  playwrite-gb-s">
                    {UserManual[`${isChecked}_1`]}
                  </p>
                  <br></br>
                  <p className="ml-2 text-base  playwrite-gb-s">
                    {UserManual[`${isChecked}_2`]}
                  </p>
                  <br></br>
                </div>
              </div>
              <div className="w-2/3 ml-3 p-6">
                {isChecked == "auto" ? (
                  <div>
                    {/* AUTO MODE */}
                    <div className="mt-8 ">
                      <p className="text-gray-600 mb-2">
                        Máy bơm sẽ bật khi ngưỡng nhiệt độ thấp hơn
                        <span className="ml-2 font-bold text-red-500">
                          {startThreshold}%
                        </span>
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
                    <div className=" ">
                      <p className="text-gray-600 mb-2">
                        Máy bơm sẽ tắt khi ngưỡng nhiệt độ cao hơn
                        <span className="ml-3 font-bold text-blue-500">
                          {stopThreshold}%
                        </span>
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
                    </div>{" "}
                  </div>
                ) : isChecked == "manual" ? (
                  <div>
                    {" "}
                    {/* MANUAL MODE */}{" "}
                    <div
                      className={`mt-2 flex w-1/2 items-center justify-between p-4  bg-white border border-gray-300 rounded-md shadow-sm ${
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
                        } ${isLocked ? "cursor-not-allowed opacity-50" : ""}`}
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
                    <div className="h-2/3 w-full p-4 mt-3">
                      <div className="relative p-4 h-full mt-2 bg-white border-2 border-blue-500 rounded-2xl flex items-center justify-center">
                        <div className="w-full h-full">
                          <Bar
                            data={data2}
                            options={{
                              ...optionsBar,
                              responsive: true,
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : isChecked == "sequent" ? (
                  <div>
                    {/* SEQUENT MODE */}
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
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M9 12h6" />
                        <path d="M12 9v6" />
                      </svg>

                      <input
                        type="number"
                        placeholder="Time On"
                        onChange={(e) => {
                          setTimeOn(e.target.value);
                        }}
                        className="ml-2 text-center w-2/5 border-2 border-gray-400 placeholder-slate-300"
                        required
                      />

                      <input
                        type="number"
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
                    </div>{" "}
                  </div>
                ) : (
                  <div>
                    {/* SCHEDULE MODE */}
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
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M9 12h6" />
                        <path d="M12 9v6" />
                      </svg>

                      <input
                        type="datetime-local"
                        placeholder="Time On"
                        onChange={(e) => {
                          setTimeOnSchedule(e.target.value);
                        }}
                        className="ml-2 text-center w-2/5 border-2 border-gray-400 placeholder-slate-300"
                        required
                      />

                      <input
                        type="datetime-local"
                        placeholder="Time Off"
                        onChange={(e) => {
                          setTimeOffSchedule(e.target.value);
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
      </div>

      {/* -----------------------Mobile View----------------------- */}
      <div className="sm:hidden h-screen w-screen p-4">
        <div className="flex flex-col  h-full w-full ">
          {/* Điều khiển chung */}
          <div className=" flex  h-fit w-fullrounded-3xl ">
            {/* Thay đổi chế độ điều khiển */}
            <div className="flex flex-col h-fit w-full bg-white border-2 border-[#4CC9FE] p-2  rounded-xl ">
              <div className="flex">
                <strong className="w-3/5 text-sm">TRẠNG THÁI HIỆN TẠI: </strong>
                <strong className="w-2/5 text-red-500">{displayName}</strong>
              </div>
              <div className=" mt-1 flex">
                {MODE_NAME_CHANGE.map((mode, index) => (
                  <button
                    key={index}
                    onClick={() => handleButtonClickMode(index)}
                    className=" text-white rounded-2xl"
                    style={{
                      margin: "5px",
                      padding: "10px",
                      backgroundColor:
                        isChecked === MODE_NAME_GET[index]
                          ? "#024CAA"
                          : "#EC8305",
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            {/* END Thay đổi chế độ điều khiển */}
          </div>
          {/* Bảng điều khiển tần số */}
          <div className="  mt-2 flex flex-col h-fit w-full bg-white  p-2 border-2 border-[#4CC9FE] rounded-xl ">
            <div className=" mt-1 flex">
              <div class="list-none w-3/5 flex items-center text-green-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                Tần số hoạt động của máy bơm (Hz)
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
                Chu kì lấy mẫu cảm biến (Giây)
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
              <div class="list-none w-3/5 flex items-center text-red-500 font-bold cursor-pointer  hover:text-yellow-500 rounded p-2">
                Reset Alarm
              </div>

              <button
                onClick={resetGateway}
                className="mt-1 w-2/5 bg-red-500 text-white rounded-3xl "
              >
                Reset
              </button>
            </div>
          </div>
          {/* END Bảng điều khiển tần số */}
          {/* hướng dẫn sử dụng và bảng điều khiển */}
          <div className="mt-2  flex  h-4/5 w-full rounded-3xl  ">
            <div className=" w-full bg-white  border-2 border-[#4CC9FE] rounded-xl">
              {/* HƯỚNG DẪN SỬ DỤNG */}
              <div className="w-full border-r-2 border-gray-300 ml-3  p-2">
                <h4 className="text-center">{displayName}</h4>
                {/* <div className="mt-2">
                  <p className=" mt-2 ml-2 text-base  playwrite-gb-s">
                    {UserManual[`${isChecked}_1`]}
                  </p>
                  <br></br>
                  <p className="ml-2 text-base  playwrite-gb-s">
                    {UserManual[`${isChecked}_2`]}
                  </p>
                  <br></br>
                </div> */}
              </div>
              <div className="w-full ml-3 p-2">
                {isChecked == "auto" ? (
                  <div>
                    {/* AUTO MODE */}
                    <div className="mt-1 ">
                      <p className="text-gray-600 mb-2">
                        Máy bơm sẽ bật khi ngưỡng nhiệt độ thấp hơn
                        <span className="ml-2 font-bold text-red-500">
                          {startThreshold}%
                        </span>
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
                    <div className=" ">
                      <p className="text-gray-600 mb-2">
                        Máy bơm sẽ tắt khi ngưỡng nhiệt độ cao hơn
                        <span className="ml-3 font-bold text-blue-500">
                          {stopThreshold}%
                        </span>
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
                    </div>{" "}
                  </div>
                ) : isChecked == "manual" ? (
                  <div>
                    {/* MANUAL MODE */}
                    <div
                      className={`ml-1 flex w-11/12 items-center justify-between p-2 bg-white border border-gray-300 rounded-md shadow-sm ${
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
                        } ${isLocked ? "cursor-not-allowed opacity-50" : ""}`}
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
                    <div className=" w-full mr-2 mt-3 ">
                      <div className="mr-6  h-full  bg-white border-2 border-blue-500 rounded-2xl flex ">
                        <div className="w-full h-full">
                          <Bar
                            data={data2}
                            options={{
                              ...optionsBar,
                              responsive: true,
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : isChecked == "sequent" ? (
                  <div>
                    {/* SEQUENT MODE */}
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
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M9 12h6" />
                        <path d="M12 9v6" />
                      </svg>

                      <input
                        type="number"
                        placeholder="Time On"
                        onChange={(e) => {
                          setTimeOn(e.target.value);
                        }}
                        className="ml-2 text-center w-2/5 border-2 border-gray-400 placeholder-slate-300"
                        required
                      />

                      <input
                        type="number"
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
                    </div>{" "}
                  </div>
                ) : (
                  <div>
                    {/* SCHEDULE MODE */}
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
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M9 12h6" />
                        <path d="M12 9v6" />
                      </svg>

                      <input
                        type="datetime-local"
                        placeholder="Time On"
                        onChange={(e) => {
                          setTimeOnSchedule(e.target.value);
                        }}
                        className="ml-2 text-center w-2/5 border-2 border-gray-400 placeholder-slate-300"
                        required
                      />

                      <input
                        type="datetime-local"
                        placeholder="Time Off"
                        onChange={(e) => {
                          setTimeOffSchedule(e.target.value);
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
      </div>
    </div>
  );
};

export default Draft;
