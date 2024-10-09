import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Login from "./pages/Login";

import PrivateRoute from "./PrivateRoute";
import Management from "./pages/Management";

import Layout from "./Layout";
import Loading from "./pages/Loading.jsx";

async function delayForDemo(promise) {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  return promise;
}
const Home = lazy(() => delayForDemo(import("./pages/Home")));
import Control from "./pages/Control";
import History from "./pages/History";
import AboutUs from "./pages/AboutUs.jsx";
import Draft from "./draft.jsx"

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
                <Management />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
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
          <Route path="/test" element={<Draft />} />
        </Route>
        <Route path="/test-out" element={<Draft />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;

