import axios from 'axios';
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {Button, CssBaseline, Grid, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useUserStore} from "../store";

const Register = () => {
    const setUser = useUserStore(state => state.setUser)
    const setUserId = useUserStore(state => state.setUserId)
    const [firstNameError, setFirstNameError] = React.useState(false)
    const [lastNameError, setLastNameError] = React.useState(false)
    const [emailError, setEmailError] = React.useState(false)
    const [emailInUseError, setEmailInUseError] = React.useState(false)
    const [passwordError, setPasswordError] = React.useState(false)
    const navigate = useNavigate();


    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        axios.post('http://localhost:4941/api/v1/users/register', {
            "email": data.get('email'),
            "firstName": data.get('firstName'),
            "lastName": data.get('lastName'),
            "password": data.get('password')
        })
            .then((response) => {
                const userId = response.data.userId
                console.log(userId)
                const user = {
                    email: data.get('email') as string,
                    firstName: data.get('firstName') as string,
                    lastName: data.get('lastName') as string

                }
                setUser(user)
                setUserId(userId)
                navigate('/login')
            }, (error) => {
                setErrorFlag(true)
                const errorMessage = error.response.statusText.split('/')[1]
                const errorType = error.response.status
                setFirstNameError(false)
                setLastNameError(false)
                setEmailError(false)
                setPasswordError(false)
                setEmailInUseError(false)
                console.log(errorType)
                if (errorType === 403) {
                    setEmailInUseError(true)
                } else {
                    if (errorMessage.includes('firstName')) {
                        setFirstNameError(true)
                    } else if (errorMessage.includes('lastName')) {
                        setLastNameError(true)
                    } else if (errorMessage.includes('email')) {
                        setEmailError(true)
                    } else if (errorMessage.includes('password')) {
                        setPasswordError(true)
                    }
                }
            })
    }

    return (

        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={submit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                error={firstNameError}
                            />
                            <Typography variant="caption" color="error" align="left">
                                {firstNameError ? "First name is required" : ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                error={lastNameError}
                            />
                            <Typography variant="caption" color="error" align="left">
                                {lastNameError ? "Last name is required" : ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                error={emailError || emailInUseError}
                            />
                            <Typography variant="caption" color="error" align="left">
                                {emailError ? "Email must be in the format: jane@doe.com" : ""}
                                {emailInUseError ? "Email is already in use" : ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={passwordError}
                            />
                            <Typography variant="caption" color="error" align="left">
                                {passwordError ? "Password must be at least 6 characters long" : ""}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        type="submit"
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to={"/login"}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
export default Register