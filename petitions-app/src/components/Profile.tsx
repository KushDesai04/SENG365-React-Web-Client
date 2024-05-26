import React from 'react'
import {useUserStore} from '../store'
import {Alert, Avatar, Box, Button, Grid, IconButton, Paper, Snackbar, styled, Typography} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the DeleteIcon component
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'

const Profile = () => {
    const userId = useUserStore(state => state.userId)
    const userToken = useUserStore(state => state.userToken)
    const [user, setUser] = React.useState<User | null>(null)
    const navigate = useNavigate()
    const [profilePictureUrl, setProfilePictureUrl] = React.useState<string>("")
    const [invalidImageError, setInvalidImageError] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!userId) {
            navigate('/login')
        } else {
            getUser();
        }
    }, [userId])

    const getUser = () => {
        if (userId) {
            axios.get(`http://localhost:4941/api/v1/users/${userId}`, {headers: {'X-Authorization': userToken}})
                .then((response) => {
                    setUser(response.data)
                    setProfilePictureUrl(`http://localhost:4941/api/v1/users/${userId}/image?${new Date().getTime()}`)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

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

    return (<>
        <h1>My Profile</h1>
            {user && (<Paper sx={{padding: '20px', margin: '20px auto', maxWidth: '600px'}}>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Box position="relative" display="inline-block">

                                <Box>
                                    <Avatar src={profilePictureUrl} sx={{width: 150, height: 150}}>
                                        {`${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`}
                                    </Avatar>

                                </Box>

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
                                {profilePictureUrl && ( // Only show the remove button if there's a profile picture
                                    <OverlayDeleteIconContainer>

                                        <IconButton component="span" size="small" onClick={removeImage}>
                                            <DeleteIcon style={{color: 'white'}}/>
                                        </IconButton>

                                    </OverlayDeleteIconContainer>)}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
                            <Typography variant="body1">{user.email}</Typography>
                            <Link to={"/editprofile"}>
                            <Button variant="outlined" sx={{marginTop: 2}}>Edit Details</Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>)}
            <Snackbar
                open={invalidImageError}
                autoHideDuration={6000}
                onClose={handleCloseInvalidImageError}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Image must be a PNG, JPEG, or GIF.
                </Alert>
            </Snackbar>
        </>)

}

export default Profile
