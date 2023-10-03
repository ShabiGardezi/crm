import { useToDos } from "../../context/ToDoContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/ToDoList/ToDoList.css";

const ToDos = () => {
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

  const handleTabClick = (tab) => {
    // Navigate to the appropriate URL when a tab is clicked
    navigate(`/todo?todos=${tab}`);
  };

  return (
    <>
      {/* <nav>
        <button
          className={todosData === null ? "active" : ""}
          onClick={() => handleTabClick("all")}
        >
          All
        </button>
        <button
          className={todosData === "active" ? "active" : ""}
          onClick={() => handleTabClick("active")}
        >
          Active
        </button>
        <button
          className={todosData === "completed" ? "active" : ""}
          onClick={() => handleTabClick("completed")}
        >
          Completed
        </button>
      </nav> */}
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
                    deleteToDo(todo.id);
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
          <button id="deleteAll" onClick={deleteAll}>
            Delete All
          </button>
        </div>
      )}
    </>
  );
};

export default ToDos;
