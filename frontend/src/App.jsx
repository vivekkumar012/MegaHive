import { Route, Routes } from "react-router-dom";
import "./App.css";
import UserLayout from "./components/Layout/UserLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>{/* User Layout */}</Route>
      <Route>{/* Admin Layout */}</Route>
    </Routes>
  );
}

export default App;
