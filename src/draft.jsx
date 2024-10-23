import React from "react";
import { url_data, url_api, url_local } from "./Provider.jsx";
import axios from "./pages/checkToken.jsx";

const draft = () => {
  // Lấy token
  const token = localStorage.getItem("token");
  const access_token = "Bearer " + token;
  const getdata = async () => {
    try {
      const response = await fetch(url_data + "api/data/30", {
        method: "GET",
        headers: {
          Authorization: access_token,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Kiểm tra nếu phản hồi không thành công (status code không phải 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Chuyển đổi dữ liệu nhận được thành JSON
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <button onClick={getdata}>get</button>
    </div>
  );
};

export default draft;
