import React, { useState, useEffect } from "react";
const TimeToSpam = 5; //seconds
const TimeDelaysNotify = 30; //min
const TimeSpamLoadData = TimeToSpam * 1000;
const TimeDelays = (60 * TimeDelaysNotify) / TimeToSpam;
function TimerComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
      console.log("Count updated:", count);
      console.log("Current time:", new Date().toLocaleTimeString());
    }, TimeSpamLoadData);

    return () => clearInterval(interval); // Cleanup khi component bị unmount
  }, [count]); // Depend vào count để log giá trị cập nhật mới nhất

  return (
    <div>
      <h1>Count: {count}</h1>
      <p>Cập nhật mỗi 30 phút</p>
    </div>
  );
}

export default TimerComponent;
