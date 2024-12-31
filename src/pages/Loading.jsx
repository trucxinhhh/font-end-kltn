import React from "react";

function SpinnerPage() {
  return (
    <div className="flex flex-row h-full items-center justify-center w-full ">
      {[4].map((size, index) => (
        <div className="flex items-center mb-20 " key={index}>
          <div className="relative">
            {/* Outer Ring */}
            <div
              className={`w-12 h-12 rounded-full absolute border-${size} border-dashed opacity-50 border-gray-200`}
            />
            {/* Inner Ring */}
            <div
              className={`w-12 h-12 rounded-full animate-spin absolute border-${size} border-dashed border-blue-500 border-t-transparent`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to return color based on size

export default SpinnerPage;
