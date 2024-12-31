// notifications.js
import { toast } from "react-toastify";

export const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-center", // Vị trí ở trên cùng
    autoClose: 3000, // Tự động đóng sau 3 giây
  });
};

export const notifyInfo = (message) => {
  toast.info(message, {
    position: "top-center", // Vị trí ở trên cùng
    autoClose: 3000, // Tự động đóng sau 3 giây
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: "top-center", // Vị trí ở trên cùng
    autoClose: 3000, // Tự động đóng sau 3 giây
  });
};
export const notifyWarning = (message) => {
  toast.warning(message, {
    position: "top-center", // Vị trí ở trên cùng
    autoClose: 3000, // Tự động đóng sau 3 giây
  });
};
