import React from "react";
import { data } from "../data";
const Draft = () => {
  const today = new Date().toISOString().slice(0, 10);
  console.log(today); // Hiển thị dạng YYYY-MM-DD
  const filteredData = data.filter((item) => item.date === "2024-10-07");
const filteredData = data.filter((item) => {
  const hour = parseInt(item.time.split(":")[0], 10); // Tách và chuyển phần giờ từ chuỗi 'time' thành số nguyên

  // Tạo một mảng 24 phần tử để lưu các mục tương ứng với mỗi giờ
  const itemsByHour = Array.from({ length: 24 }, () => []);

  // Lưu item vào vị trí tương ứng trong mảng
  itemsByHour[hour].push(item);

  return itemsByHour; // Trả về mảng itemsByHour để kiểm tra
});

// In ra các mục đã lưu theo giờ
for (let i = 0; i < filteredData.length; i++) {
  console.log(`Hour ${i}:`, filteredData[i]);
}


  // const filteredTime = data.filter((item) => {
  //   console.log(item.time);
  // });
  // console.log("filteredData", filteredData);s

  return <div></div>;
};

export default Draft;
