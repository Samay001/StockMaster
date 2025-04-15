import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { AuthProvider } from "./pages/context/authContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/auth" element={<Auth />}></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
