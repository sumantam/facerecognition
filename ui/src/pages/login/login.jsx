import React, { useEffect } from 'react';
import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, Link, Paper, TextField, Typography, Stack } from "@mui/material";
import Logo from '../../images/rsn.png';
// import XYZLogo from '../../images/xyz_logo.jpg';
// import ABCLogo from '../../images/abc_logo.png';
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchLoggedInUserDetails } from "../../reducers/loggedin-user-reducer";
import userService from "../../services/user-service";
import { setDateFilter, fetchPlants, setThemeFilter } from "../../reducers/filter-reducer";
import themes from '../../theme';

function Login() {

    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleForgotPassword = () => {
        navigate("/forgotpassword");
    };

    // const setDateParam = async () => {
    //     let locLastDate = await userService.getLastDate();
    //     let date = locLastDate["data"]["lastDate"];
    //     dispatch(setDateFilter(new Date(date)));
    //     dispatch(fetchPlants());
    // }

    const setDateParam = async () => {
        try {
            let locLastDate = await userService.getLastDate();
            console.log("Response from getLastDate:", locLastDate);
    
            if (!locLastDate || !locLastDate.data || !locLastDate.data.lastDate) {
                throw new Error("Invalid response from getLastDate");
            }
    
            let date = locLastDate.data.lastDate;
            dispatch(setDateFilter(new Date(date)));
            dispatch(fetchPlants());
        } catch (error) {
            console.error("Error in setDateParam:", error);
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");

        if (!email && !password) {
            setInvalidCredentials("Please enter your email and password");
            return;
        }

        if (!email) {
            setInvalidCredentials("Please enter your email");
            return;
        }

        if (!password) {
            setInvalidCredentials("Please enter your password");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            dispatch(fetchLoggedInUserDetails(userCredential.user.email));
            // navigate("/oee");
            console.log("Navigating to:  >>>>>>>>>>>>>  /oee/usermgmt"); // Add before navigate()
            navigate("/oee/usermgmt")

            // if (userData.role === "Admin") {
            //     const userString = JSON.stringify(userData);
            //     localStorage.setItem("user", userString);
            //     //navigate("/smtdashboard", { state: { email: user.email } });
            // } else if (userData.role === "User") {
            //     const userString = JSON.stringify(userData);
            //     localStorage.setItem("user", userString);
            //     //navigate("/smtdashboard", { state: { email: user.email } });
            // }
        } catch (error) {
            toast.error('Error logging in', { position: 'top-right', autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            setInvalidCredentials("Invalid credentials");
        }
    };

    useEffect(() => {
        return () => {
            setDateParam();
            dispatch(setThemeFilter(themes.find(i => i.title === "Theme 8")));
        };
    }, []);


    return (
        <div>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <Grid item xs={false} sm={4} md={8} sx={{ display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(#005ea1, #000000)" }}>
                    <Stack direction="column" spacing={1}>
                        <Typography
                            style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                fontFamily: "cursive",
                                color: "whitesmoke"
                            }}
                        >
                            Welcome to Attendance Dashboard
                        </Typography>
                        {/* <img src={Logo} alt="Resonance Logo" /> */}
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Avatar sx={{ m: 1, bgcolor: "#063c6f" }}>
                            <LockOutlined />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: "bold", fontSize: "24px" }}>
                            Log In To Your Account
                        </Typography>
                        <Typography sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "16px" }}>
                            Integrated Attendance System
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoFocus type="email" />
                            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" />

                            {invalidCredentials && (
                                <div style={{ backgroundColor: "pink", textAlign: "center", marginTop: "10px", padding: "10px", color: "white" }}>
                                    {invalidCredentials}
                                </div>
                            )}

                            <Grid item xs>
                                <Link href="#" variant="body2" sx={{ color: "#063c6f", fontWeight: "bold" }} onClick={handleForgotPassword}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Box sx={{ textAlign: "center", width: "100%" }}>
                                <Button type="submit" id="login-btn" sx={{ backgroundColor: "#063c6f", color: "white", mt: 3, mb: 2, "&:hover": { background: "#06009a" }, width: "10vw" }}>
                                    Login
                                </Button>
                            </Box>
                        </Box>
                        {/* <Stack direction="row" spacing={1} style={{ marginTop: "50%" }}>
                            <Typography sx={{ fontFamily: "'Roboto', sans-serif", fontSize: "1.5rem" }}>
                                C&copy;pyright by
                            </Typography>
                            <img src={XYZLogo} width={120} style={{ marginTop: "-0.4rem" }} alt="Company1 Logo" />
                            <img src={MetaSmartLogo} width={120} style={{ marginTop: "-0.4rem" }} alt="Company1 Logo" />
                        </Stack> */}

                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default Login;