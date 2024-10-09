import React, { useState } from "react";
import { ParaGraph } from "./include/DefaultData";

const AboutUs = () => {
  const [display, setDisplay] = useState("ov");

  // Create an array of numbers to loop through for each section
  const sections = [1, 2, 3];
  return (
    <div className="flex h-full w-full">
      {/* PC View */}
      <div className="hidden w-full bg-white sm:flex rounded-3xl">
        <div className="w-1/4 border-r-2 border-gray-300 p-4 ml-3 mt-10">
          <h4
            className="mt-10 cursor-pointer"
            onClick={() => {
              setDisplay("ov");
            }}
          >
            Over View
          </h4>
          <h4
            className="mt-2 cursor-pointer"
            onClick={() => {
              setDisplay("inf");
            }}
          >
            Introduction Project
          </h4>
          <h4
            className="mt-2 cursor-pointer"
            onClick={() => {
              setDisplay("US");
            }}
          >
            Us
          </h4>
        </div>

        <div className="w-3/4 mt-6 ml-3">
          <div className="">
            <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block mt-5">
              <span className="relative text-white text-5xl pacifico-regular">{ParaGraph[`nameTitle_${display}`]}</span>
            </span>
            <ul className="p-4 lg:p-8 dark:bg-gray-100 dark:text-gray-800">
              {sections.map((section) => (
                <li key={section}>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-3 rounded-xl lg:p-1 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h4 className="prata-regular mb-1 ml-8 font-blod md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph[`title_${section}_${display}`]}
                      </h4>

                      <p className="poiret-one-regular text-lg  md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph[`paragraph_${section}_${display}`]}
                      </p>
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
