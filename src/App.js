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
import AddScript from "./Scripts/AddScript";
import EditScript from "./Scripts/EditScript";
import Queries from "./Queries/Queries";
import AddQuery from "./Queries/AddQuery";
import EditQuery from "./Queries/EditQuery";
import Commands from "./Commands/Commands";
import ConfigFiles from "./ConfigFiles/ConfigFiles";
import AddConfigFile from "./ConfigFiles/AddConfigFile";
import EditConfigFile from "./ConfigFiles/EditConfigFile";
import Notes from "./Notes/Notes";
import AddNote from "./Notes/AddNote";
import EditNote from "./Notes/EditNote";
import Fondet from "./Fondet/Fondet";
import Profile from "./Profile/Profile";
import ImportFondet from "./Fondet/ImportFondet";
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
              path="/commands"
              element={
                <LayoutWrapper>
                  <Commands />
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
              path="/scripts/add-script"
              element={
                <LayoutWrapper>
                  <AddScript />
                </LayoutWrapper>
              }
            />
            <Route
              path="/scripts/edit-script/:id"
              element={
                <LayoutWrapper>
                  <EditScript />
                </LayoutWrapper>
              }
            />

            <Route
              path="/queries"
              element={
                <LayoutWrapper>
                  <Queries />
                </LayoutWrapper>
              }
            />
            <Route
              path="/queries/add-query"
              element={
                <LayoutWrapper>
                  <AddQuery />
                </LayoutWrapper>
              }
            />
            <Route
              path="/queries/edit-query/:id"
              element={
                <LayoutWrapper>
                  <EditQuery />
                </LayoutWrapper>
              }
            />
            <Route
              path="/config-files"
              element={
                <LayoutWrapper>
                  <ConfigFiles />
                </LayoutWrapper>
              }
            />
            <Route
              path="/config-files/add-file"
              element={
                <LayoutWrapper>
                  <AddConfigFile />
                </LayoutWrapper>
              }
            />
            <Route
              path="/config-files/edit-file/:id"
              element={
                <LayoutWrapper>
                  <EditConfigFile />
                </LayoutWrapper>
              }
            />

            <Route
              path="/notes"
              element={
                <LayoutWrapper>
                  <Notes />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notes/add-note"
              element={
                <LayoutWrapper>
                  <AddNote />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notes/edit-note/:id"
              element={
                <LayoutWrapper>
                  <EditNote />
                </LayoutWrapper>
              }
            />

            <Route
              path="/fondet-skanuara"
              element={
                <LayoutWrapper>
                  <Fondet />
                </LayoutWrapper>
              }
            />

            <Route
              path="/fondet/import"
              element={
                <LayoutWrapper>
                  <ImportFondet />
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
            <Route
              path="/profile"
              element={
                <LayoutWrapper>
                  <Profile />
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
