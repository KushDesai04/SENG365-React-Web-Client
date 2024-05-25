import React from 'react';
import {AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import {useUserStore} from "../store";
import axios from "axios";


const Navbar: React.FC = () => {
    const userId = useUserStore(state => state.userId);
    const userToken = useUserStore(state => state.userToken);
    const removeUser = useUserStore(state => state.removeUser);
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        if (userId) {
            axios.get('http://localhost:4941/api/v1/users/' + userId).then((response) => {
                setUser(response.data)
            }, (error) => {
                console.log(error)
            })
        }
    }, [userId])

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        removeUser();
        handleClose();
        window.location.reload()
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center'}}>
                <Typography variant="h6" component="div" sx={{textAlign: "left"}}>
                    <Button
                        sx={{"&:hover": {background: "rgba(255, 255, 255, 0.3)"}, fontSize: "1rem"}}
                        color="inherit"
                        component={Link}
                        to="/petitions"
                    >
                        Petitions App
                    </Button>
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        variant="outlined"
                        sx={{margin: "5px", "&:hover": {background: "rgba(255, 255, 255, 0.3)"}}}
                        color="inherit"
                        component={Link}
                        to="/petitions"
                    >
                        Petitions
                    </Button>
                    {userToken && (
                        <Button
                            variant="outlined"
                            sx={{margin: "5px", "&:hover": {background: "rgba(255, 255, 255, 0.3)"}}}
                            color="inherit"
                            component={Link}
                            to="/mypetitions"
                        >
                            My Petitions
                        </Button>
                    )}
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    {userToken ? (
                        <>
                            <IconButton onClick={handleMenu} color="inherit">
                                <Avatar alt="Profile Pic" src={`http://localhost:4941/api/v1/users/${userId}/image`}>
                                    {user ? user.firstName[0] + user.lastName[0] : ""}
                                </Avatar>
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outlined"
                                sx={{margin: "5px", "&:hover": {background: "rgba(255, 255, 255, 0.3)"}}}
                                color="inherit"
                                component={Link}
                                to="/login"
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{margin: "5px", "&:hover": {background: "rgba(255, 255, 255, 0.3)"}}}
                                color="inherit"
                                component={Link}
                                to="/register"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;