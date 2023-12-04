import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/ToDoList/ToDoList.css";
import { useToDos } from "../../context/ToDoContext";
import axios from "axios";
import { useEffect, useState } from "react";

const NavBar = () => {
  const { TODO } = useToDos();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const todosData = searchParams.get("todos");
  const [notesList, setnotesList] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/notes?userId=${user._id}`);
        setnotesList(res.data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotes();
  }, []);
  const handleTabClick = (tab) => {
    // Navigate to the appropriate URL when a tab is clicked
    navigate(`/todo?todos=${tab}`);
  };
  let filterToDo = TODO;

  if (todosData === "active") {
    filterToDo = TODO.filter((todo) => !todo.completed);
  }
  const activeCount = notesList.filter((todo) => !todo.completed).length;
  const completedCount = notesList.filter((todo) => todo.completed).length;

  return (
    <nav style={{ display: "flex", justifyContent: "space-evenly" }}>
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
