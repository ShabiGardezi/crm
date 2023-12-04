import React, {useEffect, useState} from "react";
import {useToDos} from "../../context/ToDoContext";
import {useSearchParams, useNavigate} from "react-router-dom";
import "../../styles/ToDoList/ToDoList.css";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {TextField} from "@mui/material";

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
    const {TODO, handleToggleToDo, deleteToDo, deleteAll} = useToDos();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const todosData = searchParams.get("todos");
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedNote, setselectedNote] = useState();
    const user = JSON.parse(localStorage.getItem("user"));
    const {notesList, setnotesList} = props;

    console.log(notesList);
    let filterToDo = notesList;
    if (todosData === "active") {
        filterToDo = notesList.filter(note=>note.status===true);
        console.log("Active");
        console.log(filterToDo);
    } else if (todosData === "completed") {
        filterToDo = notesList.filter(note=>note.status===false);
        console.log("Completed");
        console.log(filterToDo);
    }

    async function updateNoteStatus(id) {
        const status = false;
        try {
            const response = await axios.put(`${apiUrl}/api/notes/update`, {id, status});
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
    const handleEdit = async () => {
        try {
            await axios.patch(`${apiUrl}/api/notes?noteId=${selectedNote._id}`, {
                note: selectedNote.note,
            });
            const newState = notesList.map((note) => {
                if (note._id === selectedNote._id)
                    return {...note, note: selectedNote.note};

                return note;
            });
            setnotesList(newState);
            handleClose();
        } catch (error) {
            console.log(error);
        }
    };
    const handleCheckBox = async (id) => {
        await updateNoteStatus(id);
    }
    return (
        <>
            <ul className="main-task">
                {filterToDo.map((todo) => {
                    return (
                        <li key={todo._id}>
                            <input
                                type="checkbox"
                                id={`todo-${todo._id}`}
                                checked={todo.completed}
                                onChange={() => {
/*
                                    handleToggleToDo(todo._id);
*/
                                    handleCheckBox(todo._id);
                                }}
                            />
                            <label htmlFor={`todo-${todo._id}`}> {todo.note}</label>
                            <button
                                onClick={() => {
                                    handleOpen();
                                    setselectedNote(todo);
                                }}
                            >
                                Edit
                            </button>
                            {/* {todo.completed && (
                <button
                  onClick={() => {
                    handleDeleteTodo(todo.id);
                  }}
                >
                  Delete
                </button>
              )} */}
                        </li>
                    );
                })}
            </ul>
            {/* {notesList.length > 0 && (
        <div className="deleteall">
          <button id="deleteAll" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      )} */}
            <div>
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
                                    return {...prev, note: e.target.value};
                                });
                            }}
                        ></TextField>
                        <Button variant="contained" onClick={handleEdit}>
                            Save
                        </Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

export default ToDos;
