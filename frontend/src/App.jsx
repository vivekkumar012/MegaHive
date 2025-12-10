import { Route, Routes } from "react-router-dom";
import "./App.css";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route>{/* Admin Layout */}</Route>
        
      </Routes>
    </div>
  );
}

export default App;
