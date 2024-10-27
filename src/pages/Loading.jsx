import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Loading = () => {
  return (
    // <div className="p-10 mt-72 w-2/5 ml-96">
    //   <Skeleton
    //     style={{
    //       "--base-color": "#117554", // Màu cơ bản
    //       "--highlight-color": "#6A9C89", // Màu highlight
    //     }}
    //     customHighlightBackground="linear-gradient(90deg, var(--base-color) 40%, var(--highlight-color) 50%, var(--base-color) 60%)"
    //   />
    // </div>
    <div class="p-10 mt-72 w-2/5 ml-96">
      <div class="flex justify-center items-center h-full">
        <img
          class="h-16 w-16"
          src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
          alt=""
        />
      </div>
    </div>
  );
};

export default Loading;
