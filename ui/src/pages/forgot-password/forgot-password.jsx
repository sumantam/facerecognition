import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../../firebase/firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import Logo from "../../images/rsn.png";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError(false);
    };

    const handleResetPassword = async () => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setEmailError(true);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
        } catch (error) {
            console.error("Error sending password reset email", error);
        }
    };

    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            <Grid item xs={false} sm={4} md={8} sx={{ display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(#5A57FF, #B649B1)" }}>
                <img src={Logo} alt="Resonance Logo" />
            </Grid>
            <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
                <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h1>Forgot Password</h1>
                    {!emailSent ? (
                        <>
                            <p>Please enter your email address to reset your password:</p>
                            <TextField label="Email" value={email} onChange={handleEmailChange} error={emailError} helperText={emailError ? "Invalid email format" : ""} fullWidth margin="normal" sx={{ marginBottom: "5vh" }} />
                            <Button variant="contained" onClick={handleResetPassword} sx={{ background: "#063c6f" }}>Reset Password</Button>
                        </>
                    ) : (
                        <>
                            <p>
                                An email with instructions to reset your password has been
                                sent to your email address.
                            </p>
                            <Button type="button" variant="contained" sx={{ background: "#9e4dc6", marginRight: "0.5rem" }} onClick={() => { navigate("/"); }}>Back to Login</Button>
                        </>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
}

export default ForgotPassword;