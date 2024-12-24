import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";

function SignUp({ username, setUsername, password, setPassword }) {
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  async function signUp() {
    try {
      const response = await axios.post("http://localhost:8080/userAuth", {
        username: username,
        password: password,
      });
      if (response.status === 201) {
        localStorage.setItem("username", username);
        navigate("/chat");
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      {login ? (
        <div className="page">
          <div className="main">
            <div className="signUpText">Sign Up</div>
            <div>
              <div className="signUp">
                <span>Username: </span>
                <input
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div>
                <span>Password: </span>
                <input
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <button
              className="submit"
              onClick={() => {
                signUp();
              }}
            >
              Submit
            </button>
            <div className="login">
              Already Signed Up?{" "}
              <button
                className="submit"
                onClick={() => {
                  setLogin(!login);
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="page">
          <div className="main">
            <div className="signUpText">Sign In</div>
            <div>
              <div className="signUp">
                <span>Username: </span>
                <input
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div>
                <span>Password: </span>
                <input
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <button className="submit" onClick={() => {}}>
              Submit
            </button>
            <div className="login">
              Haven't Signed Up?{" "}
              <button
                className="submit"
                onClick={() => {
                  setLogin(!login);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUp;
