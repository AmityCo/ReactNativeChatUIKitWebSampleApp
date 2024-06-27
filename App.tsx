import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Chat from "./Chat";
import Social from "./Social";
import LiveChat from "./LiveChatTransparent";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/social" replace />} />
        <Route path="/social" element={<Social />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/live-chat" element={<LiveChat />} />
      </Routes>
    </Router>
  );
}
