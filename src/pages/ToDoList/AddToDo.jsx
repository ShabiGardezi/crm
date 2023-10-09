import { useState, useEffect } from "react";
import { useToDos } from "../../context/ToDoContext";
import axios from "axios";
import "../../styles/ToDoList/ToDoList.css";

const AddToDo = () => {
  const { handleAddToDo } = useToDos();
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState(""); // Initialize userId state

  // Use useEffect to retrieve user ID from local storage when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      // Access the user ID using _id
      setUserId(user._id);
    }
  }, []);

  const addToDoItem = async (userId, note) => {
    try {
      const response = await axios.post("http://localhost:5000/api/notes", {
        userId: userId,
        note: note,
      });
      if (response.status === 200) {
        console.log("Note added:", response.data.payload);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddToDo(note);
    addToDoItem(userId, note); // Call the function to add the item to the database
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddToDo;
