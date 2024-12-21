import React, { useState, useEffect } from "react";
import "./Quiz.css";
import axios from "axios";

function Quiz() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [score, setScore] = useState(0);
  const [clickedAnswers, setclickedAnswers] = useState([]);
  const [timer, setTimer] = useState(0);

  function randomShuffle(array) {
    for (let i = 0; i < array.length; i++) {
      let random_index = Math.floor(Math.random() * array.length);
      let temp = array[i];
      array[i] = array[random_index];
      array[random_index] = temp;
    }
    return array;
  }
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const api = "https://opentdb.com/api.php?amount=10";
        const response = await axios.get(api);
        setLoading(!loading);
        const data = response.data.results.map((item) => ({
          ...item,
          shuffledAnswers: randomShuffle([
            ...item.incorrect_answers,
            item.correct_answer,
          ]),
        }));
        setData(data);
        setclickedAnswers(Array(data.length).fill(null));
      } catch (e) {
        console.log(e);
      }
    }
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (score >= 10) return;
    const timeout = setTimeout(() => {
      setTimer(timer + 1);
    }, 1000);
  }, [timer, score]);

  return (
    <>
      <div className="quizApp">Quiz App</div>
      <div className="score">Score: {score}</div>
      <div className="timer">Timer: {timer}</div>

      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          {data.map((item, index) => (
            <div key={index}>
              <span className="question"> Q: {item.question} </span>
              <span className="difficulty">[{item.difficulty}]</span>
              <div className="mcqs">
                {item.shuffledAnswers.map((option, i) => (
                  <div key={i}>
                    <button
                      style={{
                        backgroundColor:
                          clickedAnswers[i] === i
                            ? option === item.correct_answer
                              ? "green"
                              : "red"
                            : "transparent",
                      }}
                      onClick={() => {
                        if (option === item.correct_answer) {
                          setScore(score + 1);
                          setclickedAnswers((prevState) => {
                            const updatedState = [...prevState];
                            updatedState[i] = i;
                            return updatedState;
                          });
                        }
                      }}
                    >
                      {option}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Quiz;
