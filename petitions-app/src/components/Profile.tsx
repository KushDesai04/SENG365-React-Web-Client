import React from 'react'
import { useUserStore } from '../store'
import { Avatar, Paper, Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const userId = useUserStore(state => state.userId)
    const userToken = useUserStore(state => state.userToken)
    const [user, setUser] = React.useState<User | null>(null)
    const navigate = useNavigate()

    React.useEffect(() => {
        if (!userId) {
            navigate('/login')
        } else {
            getUser();
        }
    }, [userId]) // re-run the effect when `userId` changes

    const getUser = () => {
        if (userId) {
            axios.get(`http://localhost:4941/api/v1/users/${userId}`, {headers: {'X-Authorization': userToken}}).then((response) => {
                setUser(response.data)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    return (
        <>
            {user && (
                <Paper>
                    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                        <Grid item>
                            <Avatar 
                                alt="Profile Pic" 
                                src={`http://localhost:4941/api/v1/users/${userId}/image`}
                                sx={{ width: 150, height: 150, margin: 5 }}
                            >
                                {user.firstName[0] + user.lastName[0]}
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
                            <Typography variant="body1">{user.email}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </>
    )
}

export default Profile
