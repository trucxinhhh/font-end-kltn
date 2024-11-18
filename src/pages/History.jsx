import React from "react";
import { useEffect, useState } from "react";
// import axios from "axios";
import axios from "./checkToken.jsx";
import { url_api, url_local, url_data } from "../Provider.jsx";
import { notifyInfo, notifyError } from "./include/notifications";
import { Button } from "@material-tailwind/react";

// console.log(master);
const History = () => {
  const [data1, setData] = useState([]);
  const [DataList, setDataList] = useState("data");
  const master = localStorage.getItem("username");
  // Lấy token
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;
  // console.log()
  // const reversedData1 = data1.reverse();
  // lấy trạng thái date
  const [inputType1, setInputType1] = useState("text");
  const [inputType2, setInputType2] = useState("text");

  // date export-file
  const [startDay, setStartDay] = useState();
  const [endDay, setEndDay] = useState();
  const [Flag, setFlag] = useState(false);

  // DATA SENSOR
  useEffect(() => {
    if (!Flag) {
      async function loadData() {
        const response = await axios.get(
          url_data + "api/" + `${DataList}` + "/30",
          {
            headers: {
              Authorization: access_token,
              accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const dt1 = response.data;

        setData(dt1);
      }
      loadData();
    }
  }, [data1, Flag]);
  //apply button
  const DateFil = async () => {
    setFlag(false);
    const date =
      url_data +
      "api/" +
      `${DataList}` +
      "/0?start=" +
      `${startDay}` +
      "&end=" +
      `${endDay}`;
    console.log(date);
    const checkDate =
      (new Date(endDay) - new Date(startDay)) / (1000 * 60 * 60 * 24);
    if (checkDate > 7) {
      notifyError("Limit search within 7 days, please try again!");
    } else if (checkDate.toString() == "NaN") {
      console.log("check", checkDate);
      notifyError("Please select date!");
    } else if (checkDate < 0) {
      console.log("check", checkDate);
      notifyError("Start Day is lesser than End Day !");
    } else {
      console.log("true date", checkDate);
      setFlag(true);
      const response = await axios.get(date, {
        headers: {
          Authorization: access_token,
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("filter", response.data);
      if (response.data.length == 0) {
        notifyError("Data is null. Please try again!");
      } else {
        notifyInfo("Waiting for data...");
        setData(response.data);
      }
    }
  };

  //Sent Mail
  const SentMail = async () => {
    const Account = {
      masterusr: localStorage.getItem("username"),
      masterpwd: localStorage.getItem("password"),
    };
    const address_toSend = url_api + `export-file/${DataList}`;
    console.log("address_toSend", address_toSend);

    if (Flag) {
      console.log("true flag export");
      const response = axios.post(address_toSend, Account, {
        headers: {
          Authorization: access_token,
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      response.then((value) => {
        console.log(value.data["message"]);
        notifyInfo(value.data["message"]);
      });
    } else {
      console.log("false flag export");
      notifyError("Please select date again!");
    }
  };
  // export All
  const ExportAll = async () => {
    const Account = {
      masterusr: localStorage.getItem("username"),
      masterpwd: localStorage.getItem("password"),
    };
    const address_toSend = url_api + `export-file/sensor`;
    const address_Vol_toSend = url_api + `export-file/volume`;

    const response = axios.post(address_toSend, Account, {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const responseVol = axios.post(address_Vol_toSend, Account, {
      headers: {
        Authorization: access_token,
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    response.then((value) => {
      console.log(value.data["message"]);
      notifyInfo(value.data["message"]);
    });
  };
  return (
    <div className="flex-col h-full w-full  ">
      {/* PC View */}
      <div className=" p-2 hidden sm:block w-full h-full">
        <div className="flex-col  h-full w-full data-table-container">
          <div className="h-16 m-3  flex  items-center">
            <div className=" w-2/5">
              <h1 className="text-5xl font-bold">Lịch Sử</h1>
            </div>

            <div className="w-11/12 flex p-4 ">
              <label className="rounded-2xl first-line:inline-flex items-center w-2/3 text-sm font-semibold">
                <select
                  className="text-gray-500 mt-1 px-3 py-2 h-10 bg-white border shadow-sm border-slate-300 placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  name="data-list"
                  id="data-list"
                  onChange={(e) => setDataList(e.target.value)}
                >
                  <option value="admin">Chọn mục </option>
                  <option value="data">Cảm biến </option>
                  <option value="user">Người dùng</option>
                  <option value="warning">Cảnh báo</option>
                </select>
              </label>
              <div className="flex p-1 ml-2 w-7/12 items-center justify-center ">
                <input
                  type={inputType1}
                  placeholder="   Start Day"
                  onFocus={() => setInputType1("date")}
                  onBlur={() => setInputType1("text")}
                  onChange={(e) => setStartDay(e.target.value)}
                  className="rounded-xl w-28 h-10 shadow-lg"
                />
                <input
                  type={inputType2}
                  placeholder="    End Day"
                  onFocus={() => setInputType2("date")}
                  onBlur={() => setInputType2("text")}
                  onChange={(e) => setEndDay(e.target.value)}
                  className="rounded-xl ml-2 w-28 h-10 shadow-lg"
                />
                <Button
                  className="bg-blue-600 text-white float-right text-xs h-10 ml-2"
                  onClick={() => DateFil()}
                >
                  Apply
                </Button>
              </div>
              <div className="w-1/3 mt-1  ">
                <Button
                  className="bg-green-600 text-white float-right text-xs h-10 "
                  onClick={() => SentMail()}
                >
                  EXPORT FILE
                </Button>
              </div>
              {(master === "tai" || master === "truc") && (
                <div className="w-1/3 mt-1 ml-2">
                  <Button
                    className="bg-yellow-600 text-white float-right text-xs h-10"
                    onClick={() => ExportAll()}
                  >
                    EXPORT All
                  </Button>
                </div>
              )}
            </div>
          </div>
          {DataList === "data" && (
            <div className="relative h-4/5 overflow-x-auto rounded-3xl mt-3">
              <table class="w-full h-46 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-900 uppercase dark:text-gray-400 bg-lime-300 sticky top-0 ">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-center">
                      Nhà vườn
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Ngày
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Thời gian
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      CO2
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Nhiệt độ Đất
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Độ ẩm Đất
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Nhiệt độ Không Khí
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Độ ẩm Không Khí
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      EC
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Áp suất
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Lưu lượng
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Bồn đầy
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {data1.map((item) => (
                    <tr class="bg-white dark:bg-gray-800" key={item._id}>
                      <td class="px-6 py-4 text-center">{item.device_name}</td>
                      <td class="px-6 py-4 text-center">{item.date}</td>
                      <td class="px-6 py-4 text-center">{item.time}</td>
                      <td class="px-6 py-4 text-center">{item.CO2}</td>
                      <td class="px-6 py-4 text-center">{item.Temp}</td>
                      <td class="px-6 py-4 text-center">{item.Humi}</td>
                      <td class="px-6 py-4 text-center">{item.AirTemp}</td>
                      <td class="px-6 py-4 text-center">{item.AirHumi}</td>
                      <td class="px-6 py-4 text-center">{item.EC}</td>
                      <td class="px-6 py-4 text-center">{item.Pressure}</td>
                      <td class="px-6 py-4 text-center">{item.flow}</td>
                      <td class="px-6 py-4 text-center">
                        {item.WaterlevelSensor1 ? "ON" : "OFF"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {DataList === "user" && (
            <div className="relative h-4/5  overflow-x-auto  rounded-3xl mt-3">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 rounded-3xl dark:text-gray-400">
                <thead class="text-xs text-gray-900 uppercase dark:text-gray-400 bg-lime-300 sticky top-0">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-center">
                      Họ và Tên
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Tên đăng nhập
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Số điện thoại
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Email
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Phân Quyền
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Lần cuối đăng nhập
                    </th>
                  </tr>
                </thead>
                <tbody className="rounded-b-2xl ">
                  {data1.map((item) => (
                    <tr class="bg-white dark:bg-gray-800" key={item._id}>
                      <td class="px-6 py-4 text-center">{item.full_name}</td>
                      <td class="px-6 py-4 text-center">{item.username}</td>

                      <td class="px-6 py-4 text-center">{item.phone}</td>
                      <td class="px-6 py-4 text-center">{item.email}</td>
                      <td class="px-6 py-4 text-center">{item.role}</td>
                      <td class="px-6 py-4 text-center">{item.lastlogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {DataList === "warning" && (
            <div className="relative h-4/5 bg-white overflow-x-auto  rounded-3xl mt-3">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-900 uppercase dark:text-gray-400 bg-lime-300 sticky top-0">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-center">
                      STT
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Date
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Time
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Message
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      level
                    </th>
                    {/* <th scope="col" class="px-6 py-3 text-center">
                      Role
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Login at
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {data1.map((item) => (
                    <tr
                      key={item._id}
                      className={`bg-white dark:bg-gray-800 ${
                        item.level === "Alarm"
                          ? "text-red-500 font-bold"
                          : "text-black"
                      }`}
                    >
                      <td class="px-6 py-4 text-center">{item._id}</td>
                      <td class="px-6 py-4 text-center">{item.date}</td>
                      <td class="px-6 py-4 text-center">{item.time}</td>
                      <td class="px-6 py-4 text-center">{item.message}</td>
                      <td class="px-6 py-4 text-center">{item.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Mobile View */}
      <div className="sm:hidden h-screen w-screen">
        <div className="flex-col  h-full w-full data-table-container">
          <div className="h-16 p-1   flex  items-center">
            <div className=" w-full flex">
              <label className="inline-flex ml-2 items-center w-7/12 h-10 text-sm font-semibold ">
                <select
                  className="text-gray-500 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1select_box"
                  name="data-list"
                  id="data-list"
                  onChange={(e) => setDataList(e.target.value)}
                >
                  <option value="admin">Choice data </option>
                  <option value="data">Sensor</option>
                  <option value="user">User</option>
                  <option value="warning">Premonition</option>
                </select>
              </label>

              <div className="w-fit  ml-2 ">
                <Button
                  className="bg-lime-600 text-white float-right text-xs"
                  onClick={() => SentMail()}
                >
                  EXPORT FILE
                </Button>
              </div>
            </div>
          </div>
          <div className="h-16 p-1 ml-2  flex  items-center">
            <div className=" w-full flex">
              <div className="inline-flex items-center w-7/12 h-10 text-sm font-semibold">
                <input
                  type={inputType1}
                  placeholder="   Start Day"
                  onTouchStart={() => setInputType1("date")}
                  onBlur={() => setInputType1("text")}
                  onChange={(e) => setStartDay(e.target.value)}
                  className="rounded-xl w-28 h-10 shadow-lg"
                />
                <input
                  type={inputType2}
                  placeholder="    End Day"
                  onTouchStart={() => setInputType2("date")}
                  onBlur={() => setInputType2("text")}
                  onChange={(e) => setEndDay(e.target.value)}
                  className="rounded-xl ml-2 w-28 h-10 shadow-lg"
                />
              </div>
              <div className="w-fit ml-4   ">
                <Button
                  className="bg-blue-600 text-white  w-32 text-sm h-10 "
                  onClick={() => DateFil()}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {DataList === "data" && (
            <div className="relative h-4/5 overflow-x-auto rounded-3xl mt-3">
              <table class="w-full h-46 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-900 uppercase dark:text-gray-400 bg-lime-300 sticky top-0 ">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-center">
                      Nhà vườn
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Ngày
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Thời gian
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      CO2
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Nhiệt độ Đất
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Độ ẩm Đất
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Nhiệt độ Không Khí
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Độ ẩm Không Khí
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      EC
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Áp suất
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Lưu lượng
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Bồn đầy
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {data1.map((item) => (
                    <tr class="bg-white dark:bg-gray-800" key={item._id}>
                      <td class="px-6 py-4 text-center">{item.device_name}</td>
                      <td class="px-6 py-4 text-center">{item.date}</td>
                      <td class="px-6 py-4 text-center">{item.time}</td>
                      <td class="px-6 py-4 text-center">{item.CO2}</td>
                      <td class="px-6 py-4 text-center">{item.Temp}</td>
                      <td class="px-6 py-4 text-center">{item.Humi}</td>
                      <td class="px-6 py-4 text-center">{item.AirTemp}</td>
                      <td class="px-6 py-4 text-center">{item.AirHumi}</td>
                      <td class="px-6 py-4 text-center">{item.EC}</td>
                      <td class="px-6 py-4 text-center">{item.Pressure}</td>
                      <td class="px-6 py-4 text-center">{item.flow}</td>
                      <td class="px-6 py-4 text-center">
                        {item.WaterlevelSensor1 ? "ON" : "OFF"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {DataList === "user" && (
            <div className="relative h-4/5  overflow-x-auto  rounded-3xl mt-3">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 rounded-3xl dark:text-gray-400">
                <thead class="text-xs text-gray-900 uppercase dark:text-gray-400 bg-lime-300 sticky top-0">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-center">
                      Họ và Tên
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Tên đăng nhập
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Số điện thoại
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Email
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Phân Quyền
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Lần cuối đăng nhập
                    </th>
                  </tr>
                </thead>
                <tbody className="rounded-b-2xl ">
                  {data1.map((item) => (
                    <tr class="bg-white dark:bg-gray-800" key={item._id}>
                      <td class="px-6 py-4 text-center">{item.full_name}</td>
                      <td class="px-6 py-4 text-center">{item.username}</td>

                      <td class="px-6 py-4 text-center">{item.phone}</td>
                      <td class="px-6 py-4 text-center">{item.email}</td>
                      <td class="px-6 py-4 text-center">{item.role}</td>
                      <td class="px-6 py-4 text-center">{item.lastlogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {DataList === "warning" && (
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-900 uppercase dark:text-gray-400 bg-lime-300 sticky top-0">
                <tr>
                  <th scope="col" class="px-6 py-3 text-center">
                    STT
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Ngày
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Thời gian
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Thông báo
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Mức độ
                  </th>
                </tr>
              </thead>
              <tbody>
                {data1.map((item) => (
                  <tr class="bg-white dark:bg-gray-800" key={item._id}>
                    <td class="px-6 py-4 text-center">{item._id}</td>
                    <td class="px-6 py-4 text-center">{item.date}</td>
                    <td class="px-6 py-4 text-center">{item.time}</td>
                    <td class="px-6 py-4 text-center">{item.message}</td>
                    <td class="px-6 py-4 text-center">{item.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
