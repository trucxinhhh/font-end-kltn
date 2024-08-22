import React from "react";
import { useEffect, useState } from "react";
import { ParaGraph } from "./include/DefaultData";
const AboutUs = () => {
  const [display, setDisplay] = useState("ov");
  // console.log(display);
  return (
    <div className="flex  h-full  w-full  ">
      {/* PC View */}

      {/* <div className="hidden w-full bg-white sm:block rounded-3xl  "></div> */}
      <div className="hidden w-full bg-white sm:flex rounded-3xl">
        <div className="w-1/4 border-r-2 border-gray-300 p-4 ml-3 mt-10">
          <h3
            className="mt-10"
            onClick={() => {
              setDisplay("ov");
            }}
          >
            Over View
          </h3>
          <h3
            className="mt-2"
            onClick={() => {
              setDisplay("infpr");
            }}
          >
            Introduction Project
          </h3>
          <h3
            className="mt-2"
            onClick={() => {
              setDisplay("us");
            }}
          >
            Us
          </h3>
          {/* <h3 className="mt-2">Introduction Project</h3> */}
        </div>
        <div className="w-3/4 mt-6 ml-3">
          {display === "ov" && (
            <div className="">
              <span class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block mt-5">
                <span class="relative text-white text-5xl">Over View</span>
              </span>
              <ul className="p-4 lg:p-8 dark:bg-gray-100 dark:text-gray-800">
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_1_ov}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph.paragraph_1_ov}
                      </p>
                    </a>
                  </article>
                </li>
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_2_ov}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph.paragraph_2_ov}
                      </p>
                    </a>
                  </article>
                </li>
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_3_ov}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700 ">
                        {ParaGraph.paragraph_3_ov}
                      </p>
                    </a>
                  </article>
                </li>
              </ul>
            </div>
          )}
          {display === "infpr" && (
            <div className="">
              <span class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block mt-5">
                <span class="relative text-white text-5xl">
                  Introduction Project
                </span>
              </span>
              <ul className="p-4 lg:p-8 dark:bg-gray-100 dark:text-gray-800">
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_1_inf}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph.paragraph_1_inf}
                      </p>
                    </a>
                  </article>
                </li>
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_2_inf}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph.paragraph_2_inf}
                      </p>
                    </a>
                  </article>
                </li>
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_3_inf}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph.paragraph_3_inf}
                      </p>
                    </a>
                  </article>
                </li>
              </ul>
            </div>
          )}
          {display === "us" && (
            <div className="">
              <span class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block mt-5">
                <span class="relative text-white text-5xl">US</span>
              </span>
              <ul className="p-4 lg:p-8 dark:bg-gray-100 dark:text-gray-800">
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_1_US}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph.paragraph_1_US}
                      </p>
                    </a>
                  </article>
                </li>
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_2_US}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph.paragraph_2_US}
                      </p>
                    </a>
                  </article>
                </li>
                <li>
                  <article>
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="grid p-4 overflow-hidden md:grid-cols-5 rounded-xl lg:p-6 xl:grid-cols-12 hover:dark:bg-gray-50"
                    >
                      <h3 className="mb-1 ml-8 font-semibold md:col-start-2 md:col-span-4 md:ml-0 xl:col-start-3 xl:col-span-9">
                        {ParaGraph.title_3_US}
                      </h3>

                      <p className="ml-8 md:col-start-2 md:col-span-4 xl:col-start-3 xl:col-span-9 md:ml-0 dark:text-gray-700">
                        {ParaGraph.paragraph_3_US}
                      </p>
                    </a>
                  </article>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden h-fit w-screen  "></div>
    </div>
  );
};

export default AboutUs;

