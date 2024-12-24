import React, { useState, useEffect } from "react";
import "./ChatPanel.css";
import axios from "axios";

function ChatPanel({
  socket,
  allMessages,
  userMessages,
  setUserMessages,
  username,
  selectedUser,
}) {
  const [text, setText] = useState("");

  const currTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const chatBody = document.querySelector(".chatBody");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      if (data.sender === selectedUser) {
        setUserMessages((prev) => [
          ...prev,
          { message: data.message, time: currTime },
        ]);
      }
    });
  }, [socket, selectedUser]);

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const newMessage = { message: text, time: currTime };
    setUserMessages((prev) => [...prev, newMessage]);

    socket.emit("sendMessage", {
      sender: localStorage.getItem("username"),
      receiver: selectedUser,
      message: text,
    });

    setText("");
  };
  return (
    <>
      <div className="chatPanel">
        <div className="chatPanelText">
          {" "}
          <span>{selectedUser}</span> Chat Panel
        </div>
        <div className="chatBody">
          {allMessages.map((message, index) => (
            <div
              className={`chatMessage ${
                message.sender === username ? "sentMessage" : "receivedMessage"
              }`}
              key={index}
            >
              {message.message}
            </div>
          ))}
        </div>

        <div className="chat">
          <input
            className="chatInput"
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button onClick={handleSendMessage}>Enter</button>
        </div>
      </div>
    </>
  );
}
export default ChatPanel;
