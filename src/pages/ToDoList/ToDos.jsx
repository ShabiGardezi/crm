import React from "react";
import { useToDos } from "../../context/ToDoContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/ToDoList/ToDoList.css";
import axios from "axios";

const ToDos = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { TODO, handleToggleToDo, deleteToDo, deleteAll } = useToDos();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const todosData = searchParams.get("todos");

  let filterToDo = TODO;
  if (todosData === "active") {
    filterToDo = TODO.filter((todo) => !todo.completed);
  } else if (todosData === "completed") {
    filterToDo = TODO.filter((todo) => todo.completed);
  }

  const handleDeleteTodo = async (noteId) => {
    try {
      // Send a DELETE request to your server
      await axios.delete(`${apiUrl}/api/notes/${noteId}`);
      deleteToDo(noteId);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      // Send a DELETE request to delete all todos
      await axios.delete(`${apiUrl}/api/notes/all`);
      // Assuming "deleteAll" function in your context clears the TODO state
      deleteAll();
    } catch (error) {
      console.error("Error deleting all todos:", error);
    }
  };

  return (
    <>
      <ul className="main-task">
        {filterToDo.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => {
                  handleToggleToDo(todo.id);
                }}
              />
              <label htmlFor={`todo-${todo.id}`}> {todo.task}</label>
              {todo.completed && (
                <button
                  onClick={() => {
                    handleDeleteTodo(todo.id);
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {filterToDo.length > 0 && (
        <div className="deleteall">
          <button id="deleteAll" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      )}
    </>
  );
};

export default ToDos;
