import React, { useState } from 'react';
import { useUserStore } from '../store';
import { Alert, Avatar, Box, Button, Grid, IconButton, Paper, Snackbar, styled, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const userId = useUserStore(state => state.userId);
    const userToken = useUserStore(state => state.userToken);
    const [user, setUser] = React.useState<User | null>(null);
    const navigate = useNavigate();
    const [profilePictureUrl, setProfilePictureUrl] = React.useState<string>('');
    const [invalidImageError, setInvalidImageError] = React.useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    React.useEffect(() => {
        if (!userId) {
            navigate('/login');
        } else {
            getUser();
        }
    }, [userId]);

    const getUser = () => {
        if (userId) {
            axios.get(`http://localhost:4941/api/v1/users/${userId}`, { headers: { 'X-Authorization': userToken } })
                .then((response) => {
                    setUser(response.data);
                    setProfilePictureUrl(`http://localhost:4941/api/v1/users/${userId}/image?${new Date().getTime()}`);
                })
                .catch((error) => {
                    console.log(error);
                });
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

    const handleCloseInvalidImageError = () => {
        setInvalidImageError(false);
    };

    const handleCloseSnackbar = () => {
        setOpen(false);
    };

    const chooseImage = (file: File | null) => {
        if (file) {
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
                    setInvalidImageError(true);
                    return;
            }

            const config = {
                headers: {
                    'Content-Type': contentType, 'X-Authorization': userToken
                }
            };

            axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, file, config)
                .then((response) => {
                    console.log(response);
                    setProfilePictureUrl(`http://localhost:4941/api/v1/users/${userId}/image?${new Date().getTime()}`);
                })
                .catch((error) => {
                    console.log("image error");
                    console.log(error);
                });
        }
    };

    const removeImage = () => {
        const config = {
            headers: {
                'X-Authorization': userToken
            }
        };

        axios.delete(`http://localhost:4941/api/v1/users/${userId}/image`, config)
            .then((response) => {
                console.log(response);
                setProfilePictureUrl(""); // Clear the profile picture URL
            })
            .catch((error) => {
                console.log("error removing image");
                console.log(error);
            });
    };

    const updateDetails = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const firstName = data.get('firstName') as string;
        const lastName = data.get('lastName') as string;
        const email = data.get('email') as string;
        const currentPassword = data.get('currentPassword') as string;
        const password = data.get('newPassword') as string;

        let form = {};
        if (currentPassword && password) {
            form = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": password,
                "currentPassword": currentPassword
            };
        } else {
            form = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email
            };
        }

        axios.patch(`http://localhost:4941/api/v1/users/${userId}`, form, { headers: { 'X-Authorization': userToken } })
            .then((response) => {
                console.log(response);
                navigate('/profile');
            })
            .catch((error) => {
                setError(error.response.data.message || 'An error occurred');
                setOpen(true);
            });
    };

    return (
        <>
            <h1>Edit Profile</h1>
            {user && (
                <Paper sx={{ padding: '20px', margin: '20px auto', maxWidth: '600px' }}>
                    <Grid component="form" noValidate onSubmit={updateDetails} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box position="relative" display="inline-block">
                                    <Box>
                                        <Avatar src={profilePictureUrl} sx={{ width: 150, height: 150 }}>
                                            {profilePictureUrl ? null : `${user.firstName[0]}${user.lastName[0]}`}
                                        </Avatar>
                                    </Box>
                                    <OverlayIconContainer>
                                        <label htmlFor="image-upload">
                                            <input
                                                id="image-upload"
                                                name="image-upload"
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={(event) => chooseImage(event.target.files ? event.target.files[0] : null)}
                                            />
                                            <IconButton component="span">
                                                <EditIcon sx={{ color: 'white' }} />
                                            </IconButton>
                                        </label>
                                    </OverlayIconContainer>
                                    {profilePictureUrl && (
                                        <OverlayDeleteIconContainer>
                                            <IconButton component="span" size="small" onClick={removeImage}>
                                                <DeleteIcon style={{ color: 'white' }} />
                                            </IconButton>
                                        </OverlayDeleteIconContainer>
                                    )}
                                </Box>
                            </Grid>
                            {user && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            id="firstName"
                                            name="firstName"
                                            label="First Name"
                                            defaultValue={user.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            id="lastName"
                                            name="lastName"
                                            label="Last Name"
                                            defaultValue={user.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            id="email"
                                            name="email"
                                            label="Email"
                                            defaultValue={user.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="currentPassword"
                                            name="currentPassword"
                                            label="Current Password"
                                            type="password"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="newPassword"
                                            name="newPassword"
                                            label="New Password"
                                            type="password"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" sx={{ marginTop: 2 }} type="submit">
                                            Save Changes
                                        </Button>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            )}
            <Snackbar
                open={invalidImageError}
                autoHideDuration={6000}
                onClose={handleCloseInvalidImageError}
            >
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    Image type not supported. Please upload a PNG, JPEG, or GIF file.
                </Alert>
            </Snackbar>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditProfile;
