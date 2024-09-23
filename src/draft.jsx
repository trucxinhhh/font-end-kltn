import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Toast thông báo thành công
  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000, // Đóng sau 2 giây
    });
  };

  // Toast thông báo lỗi
  const notifyError = () => {
    toast.error("This is an error message!", {
      position: "top-center",
      autoClose: 3000, // Đóng sau 3 giây
    });
  };

  // Toast thông báo thông tin
  const notifyInfo = () => {
    toast.info("This is an info message!", {
      position: "bottom-right",
      autoClose: 2500, // Đóng sau 2.5 giây
    });
  };

  return (
    <div>
      <h1>React Toastify Example</h1>

      {/* Các nút nhấn để hiển thị toast */}
      <button
        onClick={() => {
          notifySuccess("This is a success message!");
        }}
      >
        Show Success Toast
      </button>
      <button onClick={notifyError}>Show Error Toast</button>
      <button onClick={notifyInfo}>Show Info Toast</button>

      {/* ToastContainer để render thông báo toast */}
      <ToastContainer />
    </div>
  );
};

export default App;


