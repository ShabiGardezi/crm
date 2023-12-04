import {useState, useEffect} from "react";
import {useToDos} from "../../context/ToDoContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/ToDoList/ToDoList.css";

const AddToDo = (props) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const {handleAddToDo} = useToDos();
    const [note, setNote] = useState("");
    const [userId, setUserId] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const {setnotesList, notesList} = props;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user._id) {
            setUserId(user._id);
        }
    }, []);

    const addToDoItem = async (userId, note) => {
        try {
            const response = await axios.post(`${apiUrl}/api/notes`, {
                userId: userId,
                note: note,
                status: true,
            });
            if (response.status === 200) {
                console.log("Note added:", response.data.payload);
                setnotesList([...notesList, response.data.payload]);
            }
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddToDo(note);
        addToDoItem(userId, note);
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
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yy-MM-dd"
                />
                <button type="submit">Add</button>
            </form>
        </>
    );
};

export default AddToDo;
