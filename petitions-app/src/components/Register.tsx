import axios from 'axios';
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {Avatar, Button, CssBaseline, Grid, IconButton, styled, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useUserStore} from "../store";
import {wait} from "@testing-library/user-event/dist/utils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Register = () => {
    const setUserId = useUserStore(state => state.setUserId)
    const setUserToken = useUserStore(state => state.setUserToken)
    const userToken = useUserStore(state => state.userToken)
    const [firstNameError, setFirstNameError] = React.useState(false)
    const [lastNameError, setLastNameError] = React.useState(false)
    const [emailError, setEmailError] = React.useState(false)
    const [emailInUseError, setEmailInUseError] = React.useState(false)
    const [passwordError, setPasswordError] = React.useState(false)
    const [imageError, setImageError] = React.useState(false);
    const [contentType, setContentType] = React.useState('');
    const [image, setImage] = React.useState<File | null>(null);
    const [selectedFile, setSelectedFile] = React.useState<File>()
    const [preview, setPreview] = React.useState<string>("")
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();


    React.useEffect(() => {
        if (userToken) {
            navigate('/petitions')
        }
        
        if (!selectedFile) {
            setPreview("")
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

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
                    navigate('/petitions')
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
            setSelectedFile(file)
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
    const OverlayIconContainer = styled(Box)({
        position: 'absolute',
        bottom: 0,
        right: 1,
        backgroundColor: 'rgba(25, 118, 210, 1)',
        padding: '4px',
        borderRadius: '50%',
        cursor: 'pointer',
    });

    const OverlayDeleteIconContainer = styled(Box)({
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(210, 0, 0, 1)',
        padding: '4px',
        borderRadius: '50%',
        cursor: 'pointer',
    });

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
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                error={passwordError}
                                InputProps={{
                                    endAdornment: (
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={()=> setShowPassword(!showPassword)}
                                        edge="end"
                                      >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                      </IconButton>
                                    ),
                                  }}
                            />
                            <Typography variant="overline" color="error" align="left">
                                {passwordError ? "Password must be at least 6 characters long" : ""}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box position="relative" display="inline-block">
                        <Grid item xs={12} sx={{display: "flex", justifyContent:"center", marginTop: "10px"}}>
                            <Avatar src={preview} sx={{width: 150, height: 150}}>
                                {null}
                            </Avatar>
                        </Grid>

                        <OverlayIconContainer>
                            <label htmlFor="image-upload">
                                <input
                                    id="image-upload"
                                    name="image-upload"
                                    type="file"
                                    style={{display: 'none'}}
                                    onChange={(event) => chooseImage(event.target.files ? event.target.files[0] : null)}
                                />
                                <IconButton component="span">
                                    <EditIcon sx={{color: 'white'}}/>
                                </IconButton>
                            </label>
                        </OverlayIconContainer>
                        {preview && ( // Only show the remove button if there's a profile picture
                            <OverlayDeleteIconContainer>
                                <IconButton component="span" size="small" onClick={()=> setPreview("")}>
                                    <DeleteIcon style={{color: 'white'}}/>
                                </IconButton>
                            </OverlayDeleteIconContainer>)}
                    </Box>

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