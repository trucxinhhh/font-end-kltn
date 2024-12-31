import React, { useState, useEffect } from "react";
const TimeToSpam = 5; //seconds
const TimeDelaysNotify = 30; //min
const TimeSpamLoadData = TimeToSpam * 1000;
const TimeDelays = (60 * TimeDelaysNotify) / TimeToSpam;
function TimerComponent() {
  const [count, setCount] = useState([]);

  return (
    <div>
      <h1>Count: {count[0]}</h1>
      <button
        onClick={() => setCount(["1", "3"])}
        className="ml-2 px-4 py-2 bg-[#024CAA] text-white rounded-md hover:bg-green-700 transition-colors duration-150"
      >
        Đồng ý
      </button>
      s
    </div>
  );
}

export default TimerComponent;
