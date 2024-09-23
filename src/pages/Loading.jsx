import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Loading = () => {
  return (
    <div className="p-10 mt-72 w-2/5 ml-96">
      <Skeleton
        style={{
          "--base-color": "#117554", // Màu cơ bản
          "--highlight-color": "#6A9C89", // Màu highlight
        }}
        customHighlightBackground="linear-gradient(90deg, var(--base-color) 40%, var(--highlight-color) 50%, var(--base-color) 60%)"
      />
    </div>
  );
};

export default Loading;

