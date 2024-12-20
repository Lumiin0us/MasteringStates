import React, {useState} from "react";
import './Counter.css'

function Counter() {
    const [count, setCount] = useState(0);
    const limit = 10
    function increment(){
        if(count !== limit)
        {
            setCount(count + 1)
        }
        else 
        {
            alert("Limit Reached")
        }
    }
    function reset()
    {
        setCount(0)
    }
    return <>
    <div className="main">
        <div className="counter">
            <div className="counterText">Counter</div>
            <div className="counterValue">{count}</div>
        </div>
        <div className="counterButtonHolder">
            <button className="counterButton" onClick={increment}>Press</button>
            <button className="counterButton" onClick={reset}>Reset</button>
        </div>
        

    </div>
    </>
}

export default Counter;