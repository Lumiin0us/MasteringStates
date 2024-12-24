import React, { useState, useEffect } from 'react';
import './App.css';
import SideBar from './components/SideBar.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import SignUp from './components/SignUp.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

function App() {
  const [messages, setMessages] = useState([]);
  const [loadedMessages, setLoadedMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const allMessages = [...loadedMessages, ...userMessages];

  useEffect(() => {
    // Register the logged-in user with the server
    const user = localStorage.getItem("username");
    if (user) {
      socket.emit("registerUser", user);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signUp" element={<SignUp username={username} setUsername={setUsername} password={password} setPassword={setPassword} />} />

          <Route
            path="/chat"
            element={
              <div className="chatUI">
                <SideBar
                  socket={socket}
                  loadedMessages={loadedMessages}
                  setLoadedMessages={setLoadedMessages}
                  setUserMessages={setUserMessages}
                  username={username}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
                <ChatPanel
                  socket={socket}
                  allMessages={allMessages}
                  setUserMessages={setUserMessages}
                  username={username}
                  selectedUser={selectedUser}
                />
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
