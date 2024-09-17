import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Login from "./pages/Login";
// import App from "./App.tsx";
import PrivateRoute from "./PrivateRoute";
import Decentralization from "./pages/Decentralization";
//import Home from "./pages/Home";
import Layout from "./Layout";
import Loading from "./pages/Loading.jsx";

function delayForDemo(promise) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
const Home = lazy(() => delayForDemo(import("./pages/Home")));
import Control from "./pages/Control";
import DataAnalysis from "./pages/DataAnalysis";
import AboutUs from "./pages/AboutUs.jsx";

import Test from "./draft";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Suspense fallback={<Loading />}>
                  <Home />
                </Suspense>
              </PrivateRoute>
            }
          />

          <Route
            path="/control"
            element={
              <PrivateRoute>
                <Control />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <PrivateRoute>
                <Decentralization />
              </PrivateRoute>
            }
          />
          <Route
            path="/Data-Analysis"
            element={
              <PrivateRoute>
                <DataAnalysis />
              </PrivateRoute>
            }
          />
          <Route
            path="/about-us"
            element={
              <PrivateRoute>
                <AboutUs />
              </PrivateRoute>
            }
          />
//          <Route path="/test" element={<Test />} />
        </Route>
	    <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;

