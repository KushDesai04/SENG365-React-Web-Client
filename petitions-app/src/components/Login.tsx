import React from "react";
import {Typography} from "@mui/material";
import {useUserStore} from "../store";

const Login = () => {
    const user = useUserStore(state => state.user)

    return (<>

        <Typography component="h1" variant="h5">
            {user.firstName} {user.lastName}
        </Typography>
        </>
    );
}
export default Login