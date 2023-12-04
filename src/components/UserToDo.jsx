import React, {useEffect, useState} from "react";
import Navbar from "../pages/ToDoList/Navbar";
import AddToDo from "../pages/ToDoList/AddToDo";
import ToDos from "../pages/ToDoList/ToDos";
import ToDoContext from "../context/ToDoContext";
import Header from "../pages/Header";
import {Card, CardContent, Typography} from "@material-ui/core"; // Import Material-UI components
import "../styles/ToDoList/ToDoList.css";
import axios from "axios";

const UserToDo = ({wrapInCard, showHeader}) => {
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

    if (wrapInCard) {
        return (
            <>
                <div className="ticketHeading">
                    <Typography variant="h5">Personal Notebook</Typography>
                </div>
                {showHeader && <Header/>} {/* Conditionally render the Header */}
                <div className="todolists">
                    <ToDoContext>
                        <Card variant="outlined">
                            <CardContent>
                                <Navbar/>
                                <AddToDo setnotesList={setnotesList} notesList={notesList}/>
                                <ToDos notesList={notesList} setnotesList={setnotesList}/>
                            </CardContent>
                        </Card>
                    </ToDoContext>
                </div>
            </>
        );
    } else {
        return (
            <>
                {showHeader && <Header/>}
                <div className="todolists">
                    <ToDoContext>
                        <Navbar/>
                        <AddToDo setnotesList={setnotesList} notesList={notesList}/>
                        <ToDos notesList={notesList} setnotesList={setnotesList}/>
                    </ToDoContext>
                </div>
            </>
        );
    }
};

export default UserToDo;
