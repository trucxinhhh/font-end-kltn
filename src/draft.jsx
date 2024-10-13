import React, { useState, useEffect } from "react";

function PumpControlButton() {
  const [pump, setPump] = useState(false); // Trạng thái bật/tắt
  const [timer, setTimer] = useState(0); // Timer ban đầu tính bằng giây
  const [isLocked, setIsLocked] = useState(false); // Trạng thái khóa nút
  const [showDialog, setShowDialog] = useState(false); // Hiển thị dialog để đặt timer
  const [inputTime, setInputTime] = useState(0); // Giá trị nhập từ người dùng

  // Hàm để mở hộp thoại
  const openDialog = () => {
    setShowDialog(true); // Mở hộp thoại
  };

  // Hàm xử lý khi nhấn OK trong hộp thoại
  const handleOk = () => {
    setShowDialog(false); // Đóng hộp thoại
    if (inputTime > 0) {
      setTimer(inputTime * 60); // Chuyển giá trị từ phút sang giây
      setPump(!pump); // Đổi trạng thái pump
      setIsLocked(true); // Khóa nút
    }
  };

  // Hàm xử lý khi nhấn Cancel trong hộp thoại
  const handleCancel = () => {
    setShowDialog(false); // Đóng hộp thoại
  };

  // Sử dụng useEffect để giảm timer mỗi giây
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000); // 1000ms = 1 giây

      return () => clearInterval(interval); // Dọn dẹp interval khi unmount hoặc thay đổi
    } else if (timer === 0 && isLocked) {
      setIsLocked(false); // Mở khóa khi timer = 0
    }
  }, [timer]);

  // Chuyển đổi từ giây sang phút và giây
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div>
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
        {timer > 0
          ? `(${minutes}:${seconds < 10 ? `0${seconds}` : seconds})`
          : ""}
      </button>

      {/* Hiển thị hộp thoại */}
      {showDialog && (
        <div className="dialog">
          <h3>Set Timer</h3>
          <input
            type="number"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            placeholder="Enter minutes"
          />
          <button onClick={handleOk}>OK</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default PumpControlButton;
