import React, {useState, useEffect} from "react";
import {
    Grid,
    Box,
    Button,
    FormControl,
    TextField,
    Typography,
    Container,
    Checkbox,
    FormControlLabel,
} from "@material-ui/core";
import {createTheme, ThemeProvider} from "@material-ui/core/styles";
import SigninImg from "../assests/Rank-BPO-PVT-LTD-LOGO-02 copy.png";
import "../styles/SignIn.css";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";

const theme = createTheme();

const SignIn = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const url = process.env.REACT_APP_API_URL;

    // Load saved email and password from localStorage on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        const savedPassword = localStorage.getItem("savedPassword");

        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${apiUrl}/api/user/signin`,
                {email, password}
            );
            localStorage.setItem("user", JSON.stringify(response.data.payload));
            navigate("/home");

            toast.success("Login successful"); // Show success toast
        } catch (error) {
            console.log("Error logging in:", error);
            toast.error("Login failed"); // Show error toast
        }
    };

    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        const rememberedPassword = localStorage.getItem("rememberedPassword");
        if (rememberedEmail && rememberedPassword) {
            setEmail(rememberedEmail);
            setPassword(rememberedPassword);
            setRememberMe(true);
        }
    }, []);

    return (
        // <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <div className="image-container">
                        <img
                            src={SigninImg}
                            alt="Left Img"
                            style={{maxWidth: "80%", height: "auto"}}
                        />
                    </div>
                </Grid>
                <Grid className="signIn-form" item xs={12} md={6}>
                    <Typography variant="h4" style={{marginTop:"15px"}}>Sign In</Typography>

                    <form onSubmit={handleLogin}>
                        <FormControl style={{marginTop: "10px"}} fullWidth>
                            <TextField
                                type="email"
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormControl> <br/>
                        <FormControl style={{marginTop: "10px"}} fullWidth>
                            <TextField
                                type="password"
                                label="Password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FormControl>
                        <div style={{marginTop: "10px"}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                }
                                label="Remember Me"
                            />
                        </div>
                        <Button
                            className="signin-btn"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Sign In
                        </Button>
                    </form>
                    <Grid item>
                        <Typography variant="body2" style={{marginTop: "10px"}}>
                            Don't have an account?
                            <Link to="/signup">
                                <Button
                                    color="primary"
                                    style={{textDecoration: "underline", cursor: "pointer"}}
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
        // </ThemeProvider>
    );
};

export default SignIn;
