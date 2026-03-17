import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import Credentials from "./Credentials/Credentials";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import Configurations from "./Configurations/Configurations";
import { Bounce, ToastContainer } from "react-toastify";
import PrivateLayout from "./PrivateLayout";
import { AuthProvider } from "./context/AuthContext";
import Scripts from "./Scripts/Scripts";
function LayoutWrapper({ children }) {
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
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateLayout />}>
            <Route
              path="/home"
              element={
                <LayoutWrapper>
                  <Dashboard />
                </LayoutWrapper>
              }
            />
            <Route
              path="/credentials"
              element={
                <LayoutWrapper>
                  <Credentials />
                </LayoutWrapper>
              }
            />
            <Route
              path="/scripts"
              element={
                <LayoutWrapper>
                  <Scripts />
                </LayoutWrapper>
              }
            />
            <Route
              path="/configurations"
              element={
                <LayoutWrapper>
                  <Configurations />
                </LayoutWrapper>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          theme="light"
          transition={Bounce}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
