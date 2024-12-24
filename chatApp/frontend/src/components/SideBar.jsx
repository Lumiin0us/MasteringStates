import React, { useState, useEffect } from "react";
import "./SideBar.css";
import axios from "axios";

function SideBar({
  socket,
  loadedMessages,
  setLoadedMessages,
  setUserMessages,
  username,
  selectedUser,
  setSelectedUser,
}) {
  const [search, setSearch] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localUsername, setLocalUsername] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("http://localhost:8080/users");
        const users = response.data.map((user) => user.username);
        setUserData(users);
        setLoading(!loading);
        console.log(users);
      } catch (e) {
        console.log("Error Fetching Users from DB:", e);
      }
    }
    fetchUserData();
    setLocalUsername(localStorage.getItem("username"));
  }, []);

  const getMessages = async (sender, receiver) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/chatMessages/${sender}/${receiver}`
      );

      return response.data;
    } catch (e) {
      console.error("Error fetching messages:", e);
      return [];
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", user);
    const newMessages = await getMessages(
      localStorage.getItem("username"),
      user
    );
    setLoadedMessages(newMessages);
    setUserMessages([]);
    socket.emit("selectUser", { sender: username, receiver: user });
  };

  return (
    <>
      {loading ? (
        "Loading..."
      ) : (
        <div className="sideBar">
          <div className="chatApp">Chat App</div>
          <hr />
          <span className="username">{localUsername}</span>
          <div className="searchBar">
            <span className="searchBarText">Search Bar</span>
            <input
              className="sideBarInput"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          {search === null ? (
            <div>
              {userData.map((user, index) => (
                <div key={index}>
                  {" "}
                  <button onClick={() => handleUserClick(user)}>
                    {user}
                  </button>{" "}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {userData
                .filter((filteredUser) =>
                  filteredUser.toLowerCase().includes(search.toLowerCase())
                )
                .map((user, index) => (
                  <div key={index}>
                    <button onClick={() => handleUserClick(user)}>
                      {user}
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SideBar;
