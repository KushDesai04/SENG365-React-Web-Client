import React from "react";
import {
    Avatar,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import {useUserStore} from "../store";
import Box from "@mui/material/Box";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
    const userId = useUserStore(state => state.userId)
    const setUserId = useUserStore(state => state.setUserId)
    const setUserToken = useUserStore(state => state.setUserToken)
    const navigate = useNavigate()
    const [errorFlag, setErrorFlag] = React.useState(false)
    React.useEffect(() => {
        axios.get('http://localhost:4941/api/v1/users/' + userId).then((response) => {
            navigate('/petitions')
        }, (error) => {
            console.log(error)
        })
    }, [])

    const login = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        axios.post('http://localhost:4941/api/v1/users/login', {"email": data.get("email"), "password": data.get("password")})
            .then((response) => {
                setUserId(response.data.userId)
                setUserToken(response.data.token)
                navigate('/petitions')
            }, (error) => {
                setErrorFlag(true)
            })
    }

    return (<>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={errorFlag}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={errorFlag}
                        />
                        <Typography variant="overline" color="error" align="left">
                            {errorFlag ? "Invalid email or password" : ""}
                        </Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>

                            <Grid item>
                                <Link to={"/register"}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
export default Login