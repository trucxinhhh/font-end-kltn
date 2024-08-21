import React from "react";

const Settings = () => {
  return (
    <div className="flex  h-full  w-full  ">
      {/* PC View */}

      <div className="hidden w-full sm:block  "></div>
      {/* Mobile View */}
      <div className="sm:hidden h-fit w-screen  "></div>
    </div>
  );
};

export default Settings;

