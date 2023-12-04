import {useState, useContext, createContext} from "react";
import "../styles/ToDoList/ToDoList.css";
import axios from "axios";

const todosContext = createContext(null);
const apiUrl = process.env.REACT_APP_API_URL;

const ToDoContext = ({children}) => {
    const [TODO, setTODO] = useState(() => {
        const data = localStorage.getItem("todos") || "[]";
        return JSON.parse(data);
    });

    const handleAddToDo = (task) => {
        setTODO((prev) => {
            const newTodos = [
                {
                    // id: Math.random().toString(),
                    task,
                    completed: false,
                    createdAt: new Date(),
                },
                ...prev,
            ];
            localStorage.setItem("todos", JSON.stringify(newTodos));
            return newTodos;
        });
    };

    const handleToggleToDo = (id) => {
  /*      async function updateNoteStatus() {
            const status = false;
            try {
                const response = await axios.put(`${apiUrl}/api/notes/update`, { id, status });
                console.log('Updated Note:', response.data);
            } catch (error) {
                if (error.response) {
                    console.error('Error response from server:', error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up the request:', error.message);
                }
            }
        }*/

    };

    const deleteToDo = (id) => {
        setTODO((prev) => {
            const newToDos = prev.filter((todo) => todo.id !== id);
            localStorage.setItem("todos", JSON.stringify(newToDos));
            return newToDos;
        });
    };

    const deleteAll = () => {
        setTODO([]);
        localStorage.removeItem("todos");
    };

    return (
        <todosContext.Provider
            value={{TODO, handleAddToDo, handleToggleToDo, deleteToDo, deleteAll}}
        >
            {children}
        </todosContext.Provider>
    );
};

export default ToDoContext;

export const useToDos = () => {
    const todosConsumer = useContext(todosContext);
    if (!todosConsumer) {
        throw new Error("useTodos used outside of Provider");
    }
    return todosConsumer;
};
