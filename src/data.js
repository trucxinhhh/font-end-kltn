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
// const TimeSpamLoadData = 3 * 60 * 1000; // n * 1000 *60 = n (min)
const TimeToSpam = 5; //seconds
const TimeDelaysNotify = 30; //min
const TimeSpamLoadData = TimeToSpam * 1000;
const TimeDelays = (60 * TimeDelaysNotify) / TimeToSpam;
const Layout = () => {
  const location = useLocation();
  const [FlagNotify, setFlagNotify] = useState(false);
  const [displayNotify, setDisplayNotify] = useState(0);
  const [count, setCount] = useState(0);
  //check time to reset data
  const [FisrtGet, setFirstGet] = useState(false);
  const [ResetData, setResetdata] = useState(false);
  const [DataSensor, setDataSensor] = useState([]);
  const [DataMotor, setDataMotor] = useState([]);
  const [DataVol, setDataVol] = useState([]);
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
      autoClose: 3000, // Auto close after 3 seconds
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
  // console.log("username", localStorage.getItem("username"));
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
  async function loadData(date) {
    let link;
    if (date === undefined) {
      link = "/1";
      // console.log("undefined", date);
      // console.log("link", link);
    } else {
      link = `/300?start=${date}&end=${date}`;
      // console.log("date", date);
      // console.log("link", link);
    }

    // console.log("dateLoad", link);
    //get data sensor
    const response = await axios.get(url_data + "api/data" + link, {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const responseVol = await axios.get(url_data + "api/volume" + link, {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const responseMotor = await axios.get(url_data + "api/motor" + link, {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const dt1 = response.data;
    const dataVol = responseVol.data;
    const dt2 = responseMotor.data;
    console.log("FisrtGet", FisrtGet);
    if (FisrtGet) {
      console.log("huhu");
    } else {
      console.log("ok");
      setDataSensor(dt1);
      setDataMotor(dataVol);
      setDataVol(dt2);
      setFirstGet(true);
    }
    console.log("DataSensor", DataSensor);
    console.log("DataMotor", DataMotor);
    console.log("DataVol", DataVol);
    // localStorage.setItem("dataSensor", JSON.stringify(dt1));
    // filteVolume(dataVol);
    // localStorage.setItem("volume", JSON.stringify(dataVol));
    // localStorage.setItem("dataMotor", JSON.stringify(dt2));

    // localStorage.setItem(
    //   "TotalVolume",
    //   JSON.stringify(dataVol.slice(-1)[0]["total"])
    // );
    // localStorage.setItem(
    //   "pump1Status",
    //   JSON.stringify(dt2.slice(-1)[0]["motor"])
    // );

    //warning
  }
  // var listSensorData = ["CO2", "Humi", "Temp"];
  // for (var i = 0; i < listSensorData.length; i++) {
  //   var val = dt1.slice(-1)[0][listSensorData[i]];
  //   const checkMAX = listSensorData[i] + "_MAX";
  //   const checkMIN = listSensorData[i] + "_MIN";
  //   if (DataMap[checkMIN] > val || val > DataMap[checkMAX]) {
  //     if (FlagNotify && displayNotify == 2) {
  //       setCount(count + 1);
  //       // console.log(count);
  //       if (count == TimeDelays) {
  //         setFlagNotify(false);
  //         setCount(0);
  //       }
  //     } else {
  //       setDisplayNotify(displayNotify + 1);

  //       notify(`Warning ${listSensorData[i]} over threshold`);
  //       if (displayNotify == 2) {
  //         setDisplayNotify(0);
  //         setFlagNotify(true);
  //       }
  //     }
  //   }
  // }
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
    const response = await axios.get(url_data + "api/motor/1", {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log(response.data[0]["mode"]);
    localStorage.setItem("isChecked", JSON.stringify(response.data[0]["mode"]));
  };
  // console.log(rpsNotify);
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

  //get inf once time
  useEffect(() => {
    getInf();
    getIn4();
    GetMode();
    getHumiThresh();
    let today = new Date().toISOString().slice(0, 10);
    loadData(today);

    console.log(today);
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    // Thiết lập interval để gọi loadData mỗi giây
    const intervalId = setInterval(() => {
      loadData();
    }, TimeSpamLoadData);
    console.log("spam");

    // Cleanup function để xóa interval khi component unmount
    return () => clearInterval(intervalId);
  });

  return <></>;
};

export default Layout;
