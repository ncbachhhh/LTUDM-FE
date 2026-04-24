import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/chat/ChatPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
