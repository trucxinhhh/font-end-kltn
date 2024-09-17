import React from "react";

const Loading = () => {
  return (
    <div>
      <div class=" p-10 mt-36 ml-96 scene-loading body-loading justify-center">
        <div class="shadow-loading"></div>
        <div class="jumper-loading">
          <div class="spinner-loading">
            <div class="scaler">
              <div class="loader-loading">
                <div class="cuboid">
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                  <div class="cuboid__side"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

