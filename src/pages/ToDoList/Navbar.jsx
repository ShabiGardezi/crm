import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/ToDoList/ToDoList.css";
import { useToDos } from "../../context/ToDoContext";

const NavBar = () => {
  const { TODO } = useToDos();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const todosData = searchParams.get("todos");

  const handleTabClick = (tab) => {
    // Navigate to the appropriate URL when a tab is clicked
    navigate(`/todo?todos=${tab}`);
  };
  let filterToDo = TODO;

  if (todosData === "active") {
    filterToDo = TODO.filter((todo) => !todo.completed);
  }
  const activeCount = TODO.filter((todo) => !todo.completed).length;
  const completedCount = TODO.filter((todo) => todo.completed).length;

  return (
    <nav>
      <Link
        className={todosData === null ? "active" : ""}
        onClick={() => handleTabClick("all")}
      >
        All
      </Link>
      <Link
        to="/todo?todos=active"
        className={todosData === "active" ? "active" : ""}
        onClick={() => handleTabClick("active")}
      >
        Active ({activeCount})
      </Link>
      <Link
        to="/todo?todos=completed"
        className={todosData === "completed" ? "active" : ""}
        onClick={() => handleTabClick("completed")}
      >
        Completed ({completedCount})
      </Link>
    </nav>
  );
};

export default NavBar;
