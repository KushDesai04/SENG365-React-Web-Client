import React from "react";
import {Grid, IconButton, Paper, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useUserStore} from "../store";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

import CSS from "csstype";
import MyPetitionsCard from "./MyPetitionsCard";

const MyPetitions = () => {
    const userId = useUserStore(state => state.userId)

    const navigate = useNavigate()
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [myPetitions, setMyPetitions] = React.useState<Petitions[]>([])
    const [noPetitionsFlag, setNoPetitionsFlag] = React.useState(false)

    React.useEffect(() => {
        const getMyPetitions = () => {
            if (userId !== null) {
                const ownerIdRequest = axios.get(`http://localhost:4941/api/v1/petitions?ownerId=${userId}`);
                const supporterIdRequest = axios.get(`http://localhost:4941/api/v1/petitions?supporterId=${userId}`);

                Promise.all([ownerIdRequest, supporterIdRequest])
                    .then(([ownerIdResponse, categoryIdsResponse]) => {
                        setErrorFlag(false);

                        const ownerIdPetitions = ownerIdResponse.data.petitions;
                        const categoryIdsPetitions = categoryIdsResponse.data.petitions;

                        // Combine the results from both API calls
                        const allPetitions = [...ownerIdPetitions, ...categoryIdsPetitions];
                        console.log(allPetitions)

                        // Remove duplicates
                        const filteredMyPetitions = Array.from(new Set(allPetitions));
                        setMyPetitions(filteredMyPetitions);

                        if (filteredMyPetitions.length === 0) {
                            setNoPetitionsFlag(true);
                        } else {
                            setNoPetitionsFlag(false);
                        }
                    })
                    .catch((error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.toString());
                    });
            } else {
                navigate('/petitions')
            }
        }
        getMyPetitions()
        console.log("my pets:" + myPetitions)
    }, [userId])

    const card: CSS.Properties = {
        padding: "10px", margin: "0", display: "block"
    }

    const petition_rows = () => myPetitions.map((petition: Petitions) => <MyPetitionsCard
        key={petition.petitionId + petition.title} petition={petition}
    />)

    return (<>
            <Paper elevation={3} style={card}>
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", position: "relative"
                }}>
                    <Grid item xs={12}>
                        <Typography variant="h3" sx={{mt: 2}}>My Petitions</Typography>
                        <Link to="/createPetition">
                            <IconButton color="primary" sx={{border: "1px solid", marginLeft: "5px"}}>
                                <AddIcon fontSize="inherit"/>
                            </IconButton>
                        </Link>
                    </Grid>
                </div>

                <div style={{display: "inline-block", width: "100%", marginTop: "15px"}}>
                    {noPetitionsFlag ? "No petitions yet" : petition_rows()}
                </div>
            </Paper>
        </>);
}
export default MyPetitions