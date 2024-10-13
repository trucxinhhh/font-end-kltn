import React, { useEffect } from "react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from "./pages/checkToken.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { url_data, url_api, url_local } from "./Provider.jsx";
import { DataMap } from "./pages/include/DefaultData.jsx";
const TimeDelays = 60 * 30;
const TimeSpamLoadData = 1 * 1000; //seconds

const Layout = () => {
  const location = useLocation();
  const [FlagNotify, setFlagNotify] = useState(false);
  const [displayNotify, setDisplayNotify] = useState(0);
  const [count, setCount] = useState(0);
  // user information
  const [displayNavigateBar, setDisplay] = useState(false);
  const [fullName, setFullname] = useState("");
  const [Role, setRole] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mode, setMode] = useState(false);
  const [PassToCheck, SetPassCheck] = useState("");

  // project information now
  const [NameProject, setNameProject] = useState([]);
  const [startDay, setstartDay] = useState([]);
  const [Area, setArea] = useState([]);
  const [Quantity, setQuantity] = useState([]);

  //create new project information
  const [newNameProject, setnewNameProject] = useState([]);
  const [newstartDay, setnewstartDay] = useState([]);
  const [newArea, setnewArea] = useState([]);
  const [newQuantity, setnewQuantity] = useState([]);
  const [newHarvestDate, setnewHarvestDate] = useState([]);
  const [newStage, setnewnewStage] = useState([]);

  // data for volume draw chart
  const today = new Date().toISOString().slice(0, 10);
  const itemsByHour = Array.from({ length: 24 }, () => []);
  const TotalHour = [];

  //warning report
  const [rpsNotify, setrpsNotify] = useState(null);
  const notify = (message) => {
    toast.warning(message.toString(), {
      position: "top-center", // Position at the top
      autoClose: 1000, // Auto close after 3 seconds
    });
  };
  const RPSNotify = (message) => {
    toast.success(message, {
      position: "top-center", // Position at the top
      autoClose: 3000, // Auto close after 3 seconds
    });
  };
  // Lấy token
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;

  // get local inf
  localStorage.setItem("role", Role);
  localStorage.setItem("full_name", fullName);

  // open Dialog to change information project
  const openDialog = (mode) => {
    setMode(mode);
    setIsDialogOpen(true);
  };

  const closeDialog = async () => {
    setIsDialogOpen(false);
  };
  // logout account
  const goOut = async () => {
    localStorage.clear();
    window.location.href = url_local;
  };

  //set status navigate bar
  const ToggleListSettings = async () => {
    setDisplay((prevDisplay) => (prevDisplay === "1" ? "0" : "1"));
  };

  // get user information
  const getInf = async () => {
    const url = url_api + "users/me";
    const response = await axios.get(url, {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setRole(response.data["role"]);
    setFullname(response.data["full_name"]);
  };

  // get project information
  const getIn4 = async () => {
    const respone = await axios.get(url_api + "crop", {
      headers: {
        Authorization: access_token,
      },
    });

    const dt = respone.data;
    setnewArea(dt[0]["area"]);
    setnewNameProject(dt[0]["project"]);
    setnewQuantity(dt[0]["quantity"]);
    setnewstartDay(dt[0]["startdate"]);
    setnewnewStage(dt[0]["stage"]);
    setnewHarvestDate(dt[0]["harvestdate"]);
  };

  // thay đổi avartar theo role,username
  const imagePath = new URL(
    `/src/assets/user/${localStorage.getItem("username")}.jpg`,
    import.meta.url
  ).href;
  const ImgUsr = (usr) => {
    const a = new URL(`/src/assets/user/${usr}.jpg`, import.meta.url).href;
    if (a === url_local + "src/undefined") {
      return new URL(`/src/assets/user/user.jpg`, import.meta.url).href;
    } else {
      return a;
    }
  };
  const filteVolume = async (data) => {
    const filteredData = data.filter((item) => item.date === today);
    filteredData.filter((item) => {
      const hour = parseInt(item.time.split(":")[0], 10); // Tách và chuyển phần giờ từ chuỗi 'time' thành số nguyên
      const data = item.volume;
      itemsByHour[hour].push(data);
    });

    itemsByHour.filter((item, index) => {
      TotalHour[index] = item.reduce((a, b) => a + b, 0);
    });
    localStorage.setItem("TotalHour", JSON.stringify(TotalHour));
  };
  // get data all
  async function loadData() {
    //get data sensor
    const response = await axios.get(url_data + "api/data/30", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const dt1 = response.data;
    localStorage.setItem("dataSensor", JSON.stringify(dt1));

    //get volume
    const responseVol = await axios.get(url_data + "api/volume/300", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const dataVol = responseVol.data;
    filteVolume(dataVol);
    localStorage.setItem("volume", JSON.stringify(dataVol));

    const responseMotor = await axios.get(url_data + "api/motor/30", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const dt2 = responseMotor.data;
    if (dt2) {
      localStorage.setItem(
        "pump1Status",
        JSON.stringify(dt2.slice(-1)[0]["motor"])
      );
    }
    localStorage.setItem("dataMotor", JSON.stringify(dt2));
    var listSensorData = ["CO2", "Humi", "Temp"];
    for (var i = 0; i < listSensorData.length; i++) {
      var val = dt1.slice(-1)[0][listSensorData[i]];
      const checkMAX = listSensorData[i] + "_MAX";
      const checkMIN = listSensorData[i] + "_MIN";
      if (DataMap[checkMIN] > val || val > DataMap[checkMAX]) {
        if (FlagNotify && displayNotify == 2) {
          setCount(count + 1);
          // console.log(count);
          if (count == TimeDelays) {
            setFlagNotify(false);
            setCount(0);
          }
        } else {
          setDisplayNotify(displayNotify + 1);

          notify(`Warning ${listSensorData[i]} over threshold`);
          if (displayNotify == 2) {
            setDisplayNotify(0);
            setFlagNotify(true);
          }
        }
      }
    }
  }
  // post and resize avatar
  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        const img = new Image();
        img.onload = () => {
          // Set canvas size to 1:1 aspect ratio (square)
          const canvas = document.createElement("canvas");
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");

          // Draw the image centered to maintain 1:1 ratio
          ctx.drawImage(
            img,
            (img.width - size) / 2, // X-axis offset
            (img.height - size) / 2, // Y-axis offset
            size,
            size,
            0,
            0,
            size,
            size
          );

          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
            });
            // setImageFile(resizedFile); // Store file for POST request
            uploadImage(resizedFile);
          }, file.type);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  // upload avatar user
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", localStorage.getItem("username"));

    try {
      const response = await fetch(url_api + "upload-img", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setrpsNotify(data["message"]);
        RPSNotify(data["message"]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  //post Project
  const sendChange = async () => {
    try {
      const response = axios.post(
        url_api + "crop",
        {
          usr: {
            masterusr: localStorage.getItem("username"),
            masterpwd: PassToCheck,
          },
          crop_data: {
            project: NameProject,
            startdate: startDay,
            quantity: Quantity,
            area: Area,
          },
        },
        {
          headers: {
            Authorization: access_token,
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setrpsNotify(true);
      RPSNotify("Change Information Successful");
      closeDialog();
      getIn4();
    } catch (error) {
      console.error("Error to change Information:", error);
    }
  };
  //get mode control
  const GetMode = async () => {
    const response = await axios.get(url_api + "control_mode", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    localStorage.setItem(
      "isChecked",
      JSON.stringify(response.data["system_mode"])
    );
    console.log("system_mode", JSON.parse(localStorage.getItem("isChecked")));
  };
  // console.log(rpsNotify);
  //get inf once time
  useEffect(() => {
    getInf();
    getIn4();
  }, [rpsNotify]); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    // Thiết lập interval để gọi loadData mỗi giây
    const intervalId = setInterval(() => {
      loadData();
      GetMode();
      // checkSensorData();
    }, TimeSpamLoadData);

    // Cleanup function để xóa interval khi component unmount
    return () => clearInterval(intervalId);
  });

  return (
    <>
      {location.pathname != "/" && (
        <div className="flex">
          <Dialog
            open={isDialogOpen}
            onClose={closeDialog}
            className="fixed inset-0 z-10 overflow-y-auto"
          >
            {mode ? (
              <div className="flex items-center bg-opacity-75 bg-black justify-center min-h-screen px-4">
                <div className="relative bg-white rounded-lg max-w-sm mx-auto p-6">
                  <h1>Change Information</h1>
                  <div class="relative">
                    <input
                      type="text"
                      id="floating_outlined"
                      class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      onChange={(e) => setNameProject(e.target.value)}
                    />
                    <label
                      for="floating_outlined"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Project Name
                    </label>
                  </div>
                  <div class="relative mt-3">
                    <input
                      type="date"
                      id="floating_outlined"
                      class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder="YYYY-MM-DD"
                      onChange={(e) => setstartDay(e.target.value)}
                    />
                    <label
                      for="floating_outlined"
                      class="absolute text-sm   w-32 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 peer-focus:w-fit"
                    >
                      Start Day
                    </label>
                  </div>
                  <div class="relative mt-3">
                    <input
                      type="text"
                      id="floating_outlined"
                      class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <label
                      for="floating_outlined"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Quantity
                    </label>
                  </div>
                  <div class="relative mt-3">
                    <input
                      type="text"
                      id="floating_outlined"
                      class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      onChange={(e) => setArea(e.target.value)}
                    />
                    <label
                      for="floating_outlined"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Area
                    </label>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={closeDialog}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors duration-150"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => openDialog(false)}
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
                  <div className="text-lg font-bold text-gray-900">
                    Enter Password
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
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
                      onClick={closeDialog}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors duration-150"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendChange}
                      className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors duration-150"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog>
          <ToastContainer />
          <div className="hidden sm:block h-screen w-screen max-h-fit max-ww-fit gradient-background">
            <div className="p-10 h-screen w-screen max-h-fit max-ww-fit gradient-background ">
              <div className=" flex  bg-white bg-opacity-50 h-full rounded-l-3xl rounded-r-3xl">
                {/* ------------------------------List Box-----------------------------*/}

                <div className="p-0 w-1/5 h-full hidden md:block">
                  <div className="p-4 w-46 h-fit rounded-r-xl rounded-l-xl bg-white Green_screen">
                    <div className="flex items-center h-1/6 w-full">
                      <img
                        className="block mx-auto h-16 w-16 rounded-full sm:mx-0 sm:flex-shrink-0"
                        src={ImgUsr(localStorage.getItem("username"))}
                        alt={`${localStorage.getItem("role")}`}
                        onClick={handleImageClick}
                      />
                      <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                      <div style={{ marginLeft: 10 }}>
                        <p className="roboto-flex text-2xl">
                          <strong className="font-bold">
                            {localStorage.getItem("full_name")}
                          </strong>
                        </p>
                        <span className="roboto-flex">{Role}</span>
                      </div>
                    </div>
                    <br />
                    <ul className="fmt-5 leading-10 flex flex-col ">
                      <a className="inline-flex items-center w-full text-lg text-green-500 font-bold transition-colors duration-150 cursor-pointer hover:text-teal-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="34"
                          height="34"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="icon icon-tabler icons-tabler-outline icon-tabler-home"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                          <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                        </svg>

                        <Link to="/home">
                          <span
                            className="ml-4 mt-1 archivo text-xl justify-center items-center"
                            onClick={() => {
                              setDisplay(false);
                            }}
                          >
                            Dashboard
                          </span>
                        </Link>
                      </a>
                      {Role === "admin" && (
                        <Link to="/user-management">
                          <a
                            className="mt-2 inline-flex items-center w-full text-lg text-green-500 font-bold transition-colors duration-150 cursor-pointer hover:text-teal-600"
                            href=""
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="34"
                              height="34"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-users"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                            </svg>

                            <span
                              className="ml-4 mt-1 archivo text-xl justify-center items-center"
                              onClick={() => {
                                setDisplay(false);
                              }}
                            >
                              User Management
                            </span>
                          </a>
                        </Link>
                      )}
                      <Link to="/control">
                        <a
                          className="inline-flex items-center w-full text-lg text-green-500 font-bold transition-colors duration-150 cursor-pointer hover:text-teal-600"
                          href=""
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
                            class="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M4 6l8 0" />
                            <path d="M16 6l4 0" />
                            <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M4 12l2 0" />
                            <path d="M10 12l10 0" />
                            <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M4 18l11 0" />
                            <path d="M19 18l1 0" />
                          </svg>

                          <span
                            className="ml-4 mt-1 archivo text-xl justify-center items-center"
                            onClick={() => {
                              setDisplay(false);
                            }}
                          >
                            Control Panel
                          </span>
                        </a>
                      </Link>
                      <Link to="/history">
                        <a
                          className="inline-flex items-center w-full text-lg text-green-500 font-bold transition-colors duration-150 cursor-pointer hover:text-teal-600"
                          href=""
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
                            class="icon icon-tabler icons-tabler-outline icon-tabler-file-description"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                            <path d="M9 17h6" />
                            <path d="M9 13h6" />
                          </svg>

                          <span
                            className="ml-4 mt-1 archivo text-xl justify-center items-center"
                            onClick={() => {
                              setDisplay(false);
                            }}
                          >
                            History
                          </span>
                        </a>
                      </Link>
                      <Link to="/about-us">
                        <a
                          className="inline-flex items-center w-full text-lg text-green-500 font-bold transition-colors duration-150 cursor-pointer hover:text-teal-600"
                          href=""
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
                            class="icon icon-tabler icons-tabler-outline icon-tabler-info-hexagon"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
                            <path d="M12 9h.01" />
                            <path d="M11 12h1v4h1" />
                          </svg>

                          <span className="ml-4 mt-1 archivo text-xl justify-center items-center">
                            About us
                          </span>
                        </a>
                      </Link>
                      <a
                        className="ml-1 inline-flex items-center w-full text-lg text-green-500 font-bold transition-colors duration-150 cursor-pointer hover:text-teal-600"
                        href=""
                        onClick={() => goOut()}
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
                          class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                          <path d="M9 12h12l-3 -3" />
                          <path d="M18 15l3 -3" />
                        </svg>
                        <span className="ml-4 mt-1 archivo text-xl justify-center items-center">
                          Logout
                        </span>
                      </a>
                    </ul>
                  </div>
                  <div className="p-2 w-46 h-2/5 rounded-r-xl rounded-l-xl bg-white Green_screen">
                    <p className="ml-4 font-bold pacifico-regular text-center text-3xl mb-4">
                      Information
                    </p>

                    <table className="ml-4 w-4/5">
                      <tbody>
                        <tr>
                          <th className="text-left ">Project:</th>
                          <td className="text-right">{newNameProject}</td>
                        </tr>
                        <tr>
                          <th className="text-left">Start Day:</th>
                          <td className="text-right">{newstartDay}</td>
                        </tr>
                        <tr>
                          <th className="text-left">Harvest Day:</th>
                          <td className="text-right">{newHarvestDate}</td>
                        </tr>
                        <tr>
                          <th className="text-left">Stage:</th>
                          <td className="text-right">{newStage}</td>
                        </tr>
                        <tr>
                          <th className="text-left">Quantity:</th>
                          <td className="text-right">
                            {newQuantity} <FontAwesomeIcon icon={faTree} />
                          </td>
                        </tr>
                        <tr>
                          <th className="text-left">Area:</th>
                          <td className="text-right">
                            {newArea} m<sup>2</sup>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="flex justify-center mt-1">
                      <button
                        value="create"
                        onClick={() => openDialog(true)}
                        className="px-4 py-1 button-create-user bg-green-500 transition-colors duration-150 cursor-pointer hover:bg-green-900 text-cyan-50 rounded-full font-bold"
                      >
                        Change Project
                      </button>
                    </div>
                  </div>
                </div>
                {/* -------------------------- End List Box----------------------------- */}
                <div className="p-4 w-4/5">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
          {/* Mobile View */}
          <div className="sm:hidden h-screen w-screen bg-green-100 bg-opacity-50">
            {/* Inf box*/}
            <div className="h-20 sticky bg-[#059212] top-0">
              <div className="">
                <div className="flex  ">
                  {/* Img */}
                  <div className=" m-3 w-1/5">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={imagePath}
                      alt={`${localStorage.getItem("role")}`}
                      onClick={handleImageClick}
                    />
                    <input
                      id="fileInput"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </div>
                  {/* End Img */}

                  {/* User Inf*/}
                  <div className=" mt-4 text-white w-3/5">
                    <p className="roboto-flex">
                      <strong>{localStorage.getItem("full_name")}</strong>
                    </p>
                    <span>{Role}</span>
                  </div>
                  {/*End User Inf*/}

                  {/* Icon */}
                  <div className="ml-5 mt-5 text-white w-1/5 ">
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
                      class="icon icon-tabler icons-tabler-outline icon-tabler-align-right"
                      onClick={() => ToggleListSettings()}
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 6l16 0" />
                      <path d="M10 12l10 0" />
                      <path d="M6 18l14 0" />
                    </svg>
                  </div>
                  {/*End Icon */}
                </div>
              </div>
            </div>
            {/* End Inf box*/}
            {/* List Box */}

            {displayNavigateBar === "1" && (
              <aside className="p-4 fixed inset-y-0 z-20 right-0 flex-shrink-0 w-3/5 mt-20 overflow-y-auto  bg-[#0A6847]">
                <ul className="fmt-6 leading-10 flex flex-col space-y-4">
                  <Link
                    className="inline-flex items-center w-full text-lg text-white font-bold transition-colors duration-150 cursor-pointer hover:text-green-500"
                    to="/home"
                    onClick={() => {
                      setDisplay(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-home"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                    </svg>
                    <span className="ml-4 mt-1 archivo text-xl justify-center items-center">
                      Dashboard
                    </span>
                  </Link>
                  {Role === "admin" && (
                    <Link
                      className="inline-flex items-center w-full text-lg text-white font-bold transition-colors duration-150 cursor-pointer hover:text-green-500"
                      to="/user-management"
                      onClick={() => {
                        setDisplay(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-users"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                      </svg>
                      <span className="ml-4 mt-1 archivo text-xl justify-center items-center">
                        User Management
                      </span>
                    </Link>
                  )}
                  {/* Control */}
                  <Link
                    className="inline-flex items-center w-full text-lg text-white font-bold transition-colors duration-150 cursor-pointer hover:text-green-500"
                    to="/control"
                    onClick={() => {
                      setDisplay(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M4 6l8 0" />
                      <path d="M16 6l4 0" />
                      <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M4 12l2 0" />
                      <path d="M10 12l10 0" />
                      <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M4 18l11 0" />
                      <path d="M19 18l1 0" />
                    </svg>
                    <span className="ml-4 mt-1 archivo text-xl justify-center items-center">
                      Control Panel
                    </span>
                  </Link>
                  {/* History */}
                  <Link
                    className="inline-flex items-center w-full text-lg text-white font-bold transition-colors duration-150 cursor-pointer hover:text-green-500"
                    to="/Data-Analysis"
                    onClick={() => {
                      setDisplay(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-file-description"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      <path d="M9 17h6" />
                      <path d="M9 13h6" />
                    </svg>
                    <span className="ml-4 mt-1 archivo text-xl justify-center items-center">
                      History
                    </span>
                  </Link>

                  <Link
                    className="inline-flex items-center w-full text-lg text-white font-bold transition-colors duration-150 cursor-pointer hover:text-green-500"
                    to="/about-us"
                    onClick={() => {
                      setDisplay(false);
                    }}
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
                      class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    </svg>
                    <span className="ml-4 mt-1 archivo text-xl justify-center items-center">
                      About Us
                    </span>
                  </Link>
                  {/* Logout */}

                  <a
                    className="inline-flex items-center w-full text-lg text-white font-bold transition-colors duration-150 cursor-pointer hover:text-green-500"
                    onClick={goOut}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                      <path d="M9 12h12l-3 -3" />
                      <path d="M18 15l3 -3" />
                    </svg>
                    <span className="ml-4 mt-1 archivo text-xl justify-center items-center">
                      Logout
                    </span>
                  </a>
                </ul>
              </aside>
            )}

            {/* End List Box */}
            <div className="flex  h-full w-screen flex-col md:flex-row ">
              {/* Outletx*/}
              <div className=" w-full md:w-4/5  bg-opacity-50">
                <Outlet />
              </div>

              {/* End Outletx*/}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
