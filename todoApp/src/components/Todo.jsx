import React, {useState} from "react";
import './Todo.css'

function Todo(){
    const [input, setInput] = useState('');
    const [task, setTask] = useState([]);
    const [edit, setEdit] = useState([]);

    console.log(edit)
    return<>
    <div>Todo App</div>
    <div>
        <input type="text" onChange={(e) => {setInput(e.target.value)}} />
        <button onClick={() => {setTask([...task, input]); setEdit([...edit, false])}}>Add</button>
        <ul>
        {task.map((t, index) => (
            <div key={index}>
                {edit[index] === false? <span>{t}</span> : <input value={t} onChange={(e) => {setTask(task.map((item, i) => i === index? e.target.value : item))}} />}
                <span>
                    <button onClick={() => {
                        setEdit((prevState) => {
                            const updatedEdit = [...prevState];
                            updatedEdit[index] = !updatedEdit[index]
                            return updatedEdit
                        })
                    }}>{edit[index] === false? "Edit" : "Save"}</button>
                    <button onClick={() => {
                        setTask(task.filter((_, i) => i !== index));
                    }}>Delete</button>
                </span>
            </div>
        ))}
        </ul>
    </div>
    </>
}

export default Todo; 