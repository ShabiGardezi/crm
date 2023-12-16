/*
// import React, { useState, useEffect } from "react";
// import { useToDos } from "../../context/ToDoContext";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "../../styles/ToDoList/ToDoList.css";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// const AddToDo = (props) => {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const { handleAddToDo } = useToDos();
//   const [note, setNote] = useState("");
//   const [userId, setUserId] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const { setnotesList, notesList } = props;
//   const [openDialog, setOpenDialog] = useState(false);
//   const [sameNotes, setSameNotes] = useState([]);
//   const [dialogIndex, setDialogIndex] = useState(0);
//   const [date, setDate] = useState(new Date());

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user && user._id) {
//       setUserId(user._id);
//     }

//     const today = new Date().toDateString();

//     const notesForToday = notesList.filter(
//       (item) =>
//         item.date === today && item.seen === false && item.status === true
//     );

//     setSameNotes(notesForToday);

//     if (notesForToday.length > 0) {
//       setOpenDialog(true);
//     }
//   }, [notesList]);
//   const handleNextNote = async (id) => {
//     await updateNote(id);

//     if (dialogIndex < sameNotes.length - 1) {
//       /!*
//                     await updateNote(id);
//         *!/
//       setDialogIndex(dialogIndex + 1);
//     } else {
//       setDialogIndex(0);
//       setOpenDialog(false);
//     }
//   };
//   const handleDialogClose = async (id) => {
//     await updateNote(id);
//     setOpenDialog(false);
//   };
//   async function updateNote(id) {
//     console.log("update");
//     try {
//       let seen = true;
//       const response = await axios.put(`${apiUrl}/api/notes/seen`, {
//         id: id,
//         seen: seen,
//       });
//       if (response.status === 200) {
//       }
//     } catch (error) {
//       console.error("Error updating note:", error);
//     }
//   }
//   const addToDoItem = async (userId, note, date) => {
//     try {
//       const response = await axios.post(`${apiUrl}/api/notes`, {
//         userId: userId,
//         note: note,
//         status: true,
//         date: date.toISOString().slice(0, 10), // Format the date as yy-MM-dd
//       });
//       if (response.status === 200) {
//         console.log("Note added:", response.data.payload);
//         setnotesList([...notesList, response.data.payload]);
//       }
//     } catch (error) {
//       console.error("Error adding note:", error);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleAddToDo(note);
//     addToDoItem(userId, note, date);
//     setNote("");
//   };

//   return (
//     <>
//       <form style={{ textAlign: "center" }} onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         />
//         <DatePicker
//           className="date"
//           selected={date}
//           onChange={(date) => setDate(date)}
//           dateFormat="yyyy-MM-dd"
//         />
//         <button type="submit">Add</button>
//       </form>
//       <Dialog open={openDialog} onClose={handleDialogClose}>
//         <DialogTitle>Due Date is today for these Notes!!</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             {sameNotes.length > 0 && sameNotes[dialogIndex].note}
//           </DialogContentText>
//         </DialogContent>
//         <Button
//           onClick={() => handleDialogClose(sameNotes[dialogIndex]._id)}
//           color="primary"
//         >
//           Ok
//         </Button>
//         <Button
//           onClick={() => handleNextNote(sameNotes[dialogIndex]._id)}
//           color="primary"
//         >
//           Next
//         </Button>
//       </Dialog>
//     </>
//   );
// };

// export default AddToDo;
import React, { useState, useEffect } from "react";
import { useToDos } from "../../context/ToDoContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/ToDoList/ToDoList.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const AddToDo = (props) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { handleAddToDo } = useToDos();
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState(new Date());
  const { setnotesList, notesList } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [sameNotes, setSameNotes] = useState([]);
  const [dialogIndex, setDialogIndex] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }

    const today = new Date().toDateString();

    const notesForToday = notesList.filter(
      (item) =>
        item.date === today && item.seen === false && item.status === true
    );

    setSameNotes(notesForToday);

    if (notesForToday.length > 0) {
      setOpenDialog(true);
    }
  }, [notesList]);

  const handleNextNote = async (id) => {
    await updateNote(id);

    if (dialogIndex < sameNotes.length - 1) {
      /!*
                        await updateNote(id);
            *!/
      setDialogIndex(dialogIndex + 1);
    } else {
      setDialogIndex(0);
      setOpenDialog(false);
    }
  };

  const handleDialogClose = async (id) => {
    await updateNote(id);
    setOpenDialog(false);
  };
  const addToDoItem = async (userId, note, date) => {
    try {
      const response = await axios.post(`${apiUrl}/api/notes`, {
        userId: userId,
        note: note,
        status: true,
        date: date.toDateString(),
      });
      if (response.status === 200) {
        setnotesList([...notesList, response.data.payload]);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  async function updateNote(id) {
    console.log("update");
    try {
      let seen = true;
      const response = await axios.put(`${apiUrl}/api/notes/seen`, {
        id: id,
        seen: seen,
      });
      console.log("rrr", response);
      if (response.status === 200) {
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddToDo(note);
    addToDoItem(userId, note, date);
    setNote("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <DatePicker
          className="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yy-MM-dd"
        />
        <button type="submit">Add</button>
      </form>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Due Date is today for these Notes!!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {sameNotes.length > 0 && sameNotes[dialogIndex].note}
          </DialogContentText>
        </DialogContent>
        <Button
          onClick={() => handleDialogClose(sameNotes[dialogIndex]._id)}
          color="primary"
        >
          Ok
        </Button>
        <Button
          onClick={() => handleNextNote(sameNotes[dialogIndex]._id)}
          color="primary"
        >
          Next
        </Button>
      </Dialog>
    </>
  );
};

export default AddToDo;
*/
// import React, { useState, useEffect } from "react";
// import { useToDos } from "../../context/ToDoContext";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "../../styles/ToDoList/ToDoList.css";
// import Button from "@mui/material/Button";
// import { Box, Checkbox, FormControlLabel } from "@mui/material";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";

// const AddToDo = (props) => {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const { handleAddToDo } = useToDos();
//   const [note, setNote] = useState("");
//   const [userId, setUserId] = useState("");
//   const [date, setDate] = useState(new Date());
//   const { setnotesList, notesList } = props;
//   const [openDialog, setOpenDialog] = useState(false);
//   const [sameNotes, setSameNotes] = useState([]);
//   const [dialogIndex, setDialogIndex] = useState(0);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user && user._id) {
//       setUserId(user._id);
//     }

//     const today = new Date().toDateString();
//     const notesForToday = notesList.filter(
//       (item) => item.date === today && item.status === true
//       // && item.seen === false
//     );

//     setSameNotes(notesForToday);

//     if (notesForToday.length > 0) {
//       setOpenDialog(true);
//     }
//   }, [notesList]);

//   const handleNextNote = async (id) => {
//     await updateNote(id);

//     if (dialogIndex < sameNotes.length - 1) {
//       /*
//                   await updateNote(id);
//       */
//       setDialogIndex(dialogIndex + 1);
//     } else {
//       setOpenDialog(false);
//       // setDialogIndex(0);
//     }
//   };

//   const handleDialogClose = async (id) => {
//     await updateNote(id);
//     setOpenDialog(false);
//   };
//   const addToDoItem = async (userId, note, date) => {
//     try {
//       const response = await axios.post(`${apiUrl}/api/notes`, {
//         userId: userId,
//         note: note,
//         status: true,
//         date: date.toDateString(),
//       });
//       if (response.status === 200) {
//         setnotesList([...notesList, response.data.payload]);
//       }
//     } catch (error) {
//       console.error("Error adding note:", error);
//     }
//   };

//   async function updateNote(id) {
//     try {
//       let seen = true;
//       const response = await axios.put(`${apiUrl}/api/notes/seen`, {
//         id: id,
//         seen: seen,
//       });
//       if (response.status === 200) {
//       }
//     } catch (error) {
//       console.error("Error updating note:", error);
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleAddToDo(note);
//     addToDoItem(userId, note, date);
//     setNote("");
//   };
//   async function updateNoteStatus(id) {
//     const status = false;
//     try {
//       const response = await axios.put(`${apiUrl}/api/notes/update`, {
//         id,
//         status,
//       });
//     } catch (error) {
//       if (error.response) {
//         console.error("Error response from server:", error.response.data);
//       } else if (error.request) {
//         console.error("No response received:", error.request);
//       } else {
//         console.error("Error setting up the request:", error.message);
//       }
//     }
//   }
//   const handleCheckBox = async (id) => {
//     try {
//       await updateNoteStatus(id);

//       // Toggle the status locally in the state
//       const updatedNotes = notesList.map((note) => {
//         if (note._id === id) {
//           return { ...note, status: !note.status };
//         }
//         return note;
//       });

//       setnotesList(updatedNotes);
//     } catch (error) {
//       console.error("Error updating note status:", error);
//     }
//   };
//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         />
//         <DatePicker
//           className="date"
//           selected={date}
//           onChange={(date) => setDate(date)}
//           dateFormat="yy-MM-dd"
//         />
//         <button type="submit">Add</button>
//       </form>

//       <Dialog open={openDialog} onClose={handleDialogClose}>
//         <DialogTitle>Due Date is today for these Notes!!</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             {/* {sameNotes.length > 0 && sameNotes[dialogIndex].note} */}
//             {sameNotes.length > 0 && sameNotes[dialogIndex].note}
//           </DialogContentText>
//           <FormControlLabel
//             label="Completed"
//             control={
//             <Checkbox
//               // checked={sameNotes[dialogIndex].completed}
//               onChange={() => handleCheckBox(sameNotes[dialogIndex]._id)}
//             />
//           }
//           />
//         </DialogContent>
//         <Box sx={{ display: "flex", justifyContent: "space-around" }}>
//           <Button
//             onClick={() => console.log(sameNotes[dialogIndex])}
//             color="primary"
//           >
//             Next
//           </Button>
//           <Button
//             onClick={() => handleDialogClose(sameNotes[dialogIndex]._id)}
//             color="primary"
//           >
//             Ok
//           </Button>
//         </Box>
//       </Dialog>
//     </>
//   );
// };

// export default AddToDo;

import React, { useState, useEffect } from "react";
import { useToDos } from "../../context/ToDoContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/ToDoList/ToDoList.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControlLabel, Checkbox, Box } from "@mui/material";

const AddToDo = (props) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { handleAddToDo } = useToDos();
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState(new Date());
  const { setnotesList, notesList } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [sameNotes, setSameNotes] = useState([]);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }

    const today = new Date().toDateString();
    let notesForToday = sameNotes;
    if (!checked) {
    notesForToday = notesList.filter(
      (item) => item.date === today && item.status === true && item.seen === false
    );
    }

    setSameNotes(notesForToday);

    if (notesForToday.length > 0) {
      setOpenDialog(true);
    }
  }, [notesList]);

  const handleNextNote = async (id) => {
    setChecked(false);
    await updateNote(id);

    if (dialogIndex < sameNotes.length - 1) {
      
                  await updateNote(id);
      
      setDialogIndex(dialogIndex + 1);
    } else {
      setOpenDialog(false);
      setDialogIndex(0);
    }
  };

  const handleDialogClose = async (id) => {
    await updateNote(id);
    setOpenDialog(false);
  };
  const addToDoItem = async (userId, note, date) => {
    try {
      const response = await axios.post(`${apiUrl}/api/notes`, {
        userId: userId,
        note: note,
        status: true,
        date: date.toDateString(),
      });
      if (response.status === 200) {
        setnotesList([...notesList, response.data.payload]);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  async function updateNote(id) {
    try {
      let seen = true;
      const response = await axios.put(`${apiUrl}/api/notes/seen`, {
        id: id,
        seen: seen,
      });
      if (response.status === 200) {
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddToDo(note);
    addToDoItem(userId, note, date);
    setNote("");
  };
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
  const handleCheckBox = async (id) => {
    setChecked(!checked);
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <DatePicker
          className="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yy-MM-dd"
        />
        <button type="submit">Add</button>
      </form>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Notes Due Date Notifications </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* {sameNotes.length > 0 && sameNotes[dialogIndex].note} */}
            {sameNotes.length > 0 && sameNotes[dialogIndex].note}
          </DialogContentText>
          <FormControlLabel
            label="Completed"
            control={
            <Checkbox
              checked={checked}
              onChange={() => handleCheckBox(sameNotes[dialogIndex]._id)}
            />
          }
          />
        </DialogContent>
        <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
        <Button
          onClick={() => handleNextNote(sameNotes[dialogIndex]._id)}
          color="primary"
        >
          Next
        </Button>
        <Button
          onClick={() => handleDialogClose(sameNotes[dialogIndex]._id)}
          color="primary"
        >
          Ok
        </Button></Box>
      </Dialog>
    </>
  );
};

export default AddToDo;