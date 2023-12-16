import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/ToDoList/ToDoList.css";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Grid, TextField, Typography } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ToDos = (props) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [searchParams] = useSearchParams();
  const todosData = searchParams.get("todos");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedNote, setselectedNote] = useState();
  const { notesList, setnotesList } = props;
  const user = JSON.parse(localStorage.getItem("user"));
  let filterToDo = notesList;
  if (todosData === "active") {
    filterToDo = notesList.filter((note) => note.status === true);
  } else if (todosData === "completed") {
    filterToDo = notesList.filter((note) => note.status === false);
  }

  async function updateNoteStatus(id) {
    const status = false;
    try {
      const response = await axios.put(`${apiUrl}/api/notes/update`, {
        id,
        status,
      });
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  }

  const handleDeleteAll = async () => {
    try {
      // Send a DELETE request to delete all todos
      const response = await axios.delete(
        `${apiUrl}/api/notes/all?userId=${user._id}&status=false`
      );

      // Check the response status
      if (response.status === 200) {
        console.log("Notes deleted successfully");
      } else {
        console.error("Failed to delete notes. Status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting all todos:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.patch(`${apiUrl}/api/notes?noteId=${selectedNote._id}`, {
        note: selectedNote.note,
      });
      const newState = notesList.map((note) => {
        if (note._id === selectedNote._id)
          return { ...note, note: selectedNote.note };

        return note;
      });
      setnotesList(newState);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCheckBox = async (id) => {
    try {
      await updateNoteStatus(id);

      // Toggle the status locally in the state
      const updatedNotes = notesList.map((note) => {
        if (note._id === id) {
          return { ...note, status: !note.status };
        }
        return note;
      });

      setnotesList(updatedNotes);
    } catch (error) {
      console.error("Error updating note status:", error);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {filterToDo.map((todo) => (
          <Grid item xs={12} key={todo._id}>
            <Box
              sx={{
                border: 1,
                borderRadius: 2,
                padding: 2,
                display: "flex",
                justifyContent: "space-evenly",
                // flexDirection: "column",
                // alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                id={`todo-${todo._id}`}
                checked={todo.completed}
                onChange={() => {
                  handleCheckBox(todo._id);
                }}
              />
              <label htmlFor={`todo-${todo._id}`}>{todo.note}</label>
              <label htmlFor="date"> {todo.date}</label>
              <button
                onClick={() => {
                  handleOpen();
                  setselectedNote(todo);
                }}
                style={{
                  backgroundColor: "#7257ee" /* Green background color */,
                  color: "white" /* White text color */,
                  padding: "10px 15px" /* Padding */,
                  border: "none" /* No borders */,
                  borderRadius: "4px" /* Rounded corners */,
                  cursor: "pointer" /* Pointer cursor on hover */,
                }}
              >
                Edit
              </button>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            value={selectedNote?.note}
            onChange={(e) => {
              setselectedNote((prev) => {
                return { ...prev, note: e.target.value };
              });
            }}
          ></TextField>
          <Button
            variant="contained"
            onClick={handleEdit}
            style={{ display: "flex", marginTop: "5%" }}
          >
            Save
          </Button>
        </Box>
      </Modal>
      <div
        className="complete-btn"
        style={{ display: "flex", justifyContent: "center", marginTop: "2%" }}
      >
        <Button variant="contained" color="error" onClick={handleDeleteAll}>
          Delete Completed
        </Button>
      </div>
    </>
  );
};

export default ToDos;
