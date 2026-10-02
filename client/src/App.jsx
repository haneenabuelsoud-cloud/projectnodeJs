import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import BoardsPage from "./pages/BoardsPage";

function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" replace />
            : <AuthPage mode="login" setUser={setUser} />
        }
      />

      <Route
        path="/signup"
        element={
          user
            ? <Navigate to="/" replace />
            : <AuthPage mode="signup" setUser={setUser} />
        }
      />

      <Route
        path="/"
        element={
          user
            ? <BoardsPage user={user} setUser={setUser} />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}