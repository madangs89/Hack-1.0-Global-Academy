import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Hero from "./pages/Hero";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAuth, setUser } from "./redux/Slice/authSlice";
import Roadmap from "./pages/Roadmap";

const App = () => {
  const authSlice = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/is-auth`,
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          console.log(res.data);

          dispatch(setAuth(true));
          dispatch(setUser(res.data.user));
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="w-full overflow-hidden h-screen bg-white">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Hero />} />
        <Route path="/home/:id" element={<Hero />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </div>
  );
};

export default App;
