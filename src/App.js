import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import Credentials from "./Credentials/Credentials";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import Configurations from "./Configurations/Configurations";
import { Bounce, ToastContainer } from "react-toastify";

function ProtectedLayout({ children }) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">{children}</div>
      <Navbar />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/credentials"
          element={
            <ProtectedLayout>
              <Credentials />
            </ProtectedLayout>
          }
        />
        <Route
          path="/configurations"
          element={
            <ProtectedLayout>
              <Configurations />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
