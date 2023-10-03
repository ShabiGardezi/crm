import { useState, useContext, createContext } from "react";
import "../styles/ToDoList/ToDoList.css";
const todosContext = createContext(null);

const ToDoContext = ({ children }) => {
  const [TODO, setTODO] = useState(() => {
    const data = localStorage.getItem("todos") || "[]";
    return JSON.parse(data);
  });

  const handleAddToDo = (task) => {
    setTODO((prev) => {
      const newTodos = [
        {
          id: Math.random().toString(),
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
    setTODO((prev) => {
      const newTodos = prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      localStorage.setItem("todos", JSON.stringify(newTodos));
      return newTodos;
    });
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
      value={{ TODO, handleAddToDo, handleToggleToDo, deleteToDo, deleteAll }}
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
