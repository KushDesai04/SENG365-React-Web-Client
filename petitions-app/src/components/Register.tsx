import axios from 'axios';
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {Button, CssBaseline, Grid, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useUserStore} from "../store";
import {wait} from "@testing-library/user-event/dist/utils";

const Register = () => {
    const setUserId = useUserStore(state => state.setUserId)
    const setUserToken = useUserStore(state => state.setUserToken)
    const [firstNameError, setFirstNameError] = React.useState(false)
    const [lastNameError, setLastNameError] = React.useState(false)
    const [emailError, setEmailError] = React.useState(false)
    const [emailInUseError, setEmailInUseError] = React.useState(false)
    const [passwordError, setPasswordError] = React.useState(false)
    const [imageError, setImageError] = React.useState(false);
    const [contentType, setContentType] = React.useState('');
    const [image, setImage] = React.useState<File | null>(null);
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

                axios.post('http://localhost:4941/api/v1/users/login', {
                    "email": data.get('email'),
                    "password": data.get('password')
                }).then(response =>{
                    uploadImage(userId, response.data.token)
                    setUserToken(response.data.token)
                    setUserId(userId)

                })
            }, (error) => {
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

    const chooseImage = (file: File | null) => {
        if (file) {
            setImageError(false);
            let contentType;
            switch (file.type) {
                case 'image/png':
                    contentType = 'image/png';
                    break;
                case 'image/jpeg':
                    contentType = 'image/jpeg';
                    break;
                case 'image/gif':
                    contentType = 'image/gif';
                    break;
                default:
                    setImageError(true);
                    return;
            }

            setContentType(contentType);
            setImage(file)
        } else {
            setImageError(!file);
        }
    };

    const uploadImage = async (userId: number, userToken: string) => {
        if (userId && image && contentType) {
            const config = {
                headers: {
                    'Content-Type': contentType,
                    'X-Authorization': userToken
                }
            };
            try {
                await axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, image, config);
                console.log('Image uploaded successfully');
                navigate('/petitions');
            } catch (error) {
                console.log("Image error:", error);
            }
        }
    };

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
                            <Typography variant="overline" color="error" align="left">
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
                            <Typography variant="overline" color="error" align="left">
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
                            <Typography variant="overline" color="error" align="left">
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
                            <Typography variant="overline" color="error" align="left">
                                {passwordError ? "Password must be at least 6 characters long" : ""}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button variant="contained" component="label">
                        Upload Image
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            hidden
                            onChange={e => chooseImage(e.target.files?.[0] || null)}
                        />
                    </Button>
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