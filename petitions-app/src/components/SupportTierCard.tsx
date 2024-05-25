 import React from "react";
import axios from "axios";
import {
    Avatar,
    Card, CardContent, CardHeader, CardActions,
    Typography,
    Button,
    Chip,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert, Snackbar, TextField,
} from "@mui/material";

import CSS from 'csstype';
import dayjs from "dayjs";
 import {useUserStore} from "../store";


interface ISupportTierProps {
    supportTier: SupportTier
    supporters: Supporter[]
    petitionId: number
}

function SupportTierCard(props: ISupportTierProps) {
    const userToken = useUserStore(state => state.userToken);
    const [supportTier] = React.useState<SupportTier>(props.supportTier);
    const [supporters, setSupporters] = React.useState<Supporter[]>(props.supporters);
    const [petitionId] = React.useState<number>(props.petitionId);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [message, setMessage] = React.useState<string>("");
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [openMessageDialog, setOpenMessageDialog] = React.useState(false);


    const CardStyles: CSS.Properties = {
        display: "inline-block", width: "400px", margin: "10px", padding: "0px"
    };

    const displaySupporters = () => {
        // Display modal with supporters
        setOpenDialog(true);
    }

    const addSupporter = () => {
        let form;
        if (message) {
            form = {
                "supportTierId": supportTier.supportTierId, "message": message
            }
        } else {
            form = {
                "supportTierId": supportTier.supportTierId
            }
        }
        axios.post(`http://localhost:4941/api/v1/petitions/${petitionId}/supporters`, form, {headers: {'X-Authorization': userToken}})
            .then((response) => {
            console.log(response);
            setOpenMessageDialog(false);
        }, (error) => {
            console.log(error);
            setErrorFlag(true);
            if (error.response.statusText.includes("Duplicate supporter")) {
                setErrorMessage("You have already supported this tier");
            } else if (error.response.statusText.includes("Cannot support your own petition")) {
                setErrorMessage("You cannot support your own petition");
            }
        })
    }

    return (<>
        <Snackbar
            open={errorFlag}
            autoHideDuration={5000}
            onClose={() => setErrorFlag(false)}
        >
            <Alert
                severity="error"
                variant="filled"
                sx={{width: '100%'}}
            >
                {errorMessage}
            </Alert>
        </Snackbar>
        <div style={{ display: "inline-block" }}>
            <Card sx={CardStyles}>
                <CardHeader sx={{ height: "50px" }}
                    title={supportTier.title} />
                <CardContent sx={{ height: "100px" }}>
                    <Chip label={"$ " + supportTier.cost} />
                    <Typography variant="body2" color="text.primary" sx={{margin:"5% !important"}}>
                        {supportTier.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* On click, display modal with supporter information */}

                    <Button variant="outlined" onClick={displaySupporters}>View Supporters</Button>
                    {userToken && (
                        <Button variant="outlined" color="success" onClick={()=>setOpenMessageDialog(true)}>Support</Button>
                    )}
                </CardActions>
            </Card>
            <Dialog open={openMessageDialog} onClose={() => setOpenMessageDialog(false)}>
                <DialogTitle>Supporter Message</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Add a message to show your support</Typography>
                    <TextField onChange={(event) => setMessage(event.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenMessageDialog(false)}>Cancel</Button>
                    <Button variant="outlined" onClick={() => addSupporter()} color="success">Support</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={openDialog}
                onClose={() => { setOpenDialog(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">

                <DialogTitle id="alert-dialog-title">
                    {"Supporters"}
                </DialogTitle>
                <DialogContent >
                    {supporters.map((supporter) => {
                        return (
                            <Card sx={{ display: "flex", alignItems: "center", justifyContent: "start", padding: "5px", margin: "5px" }}>
                                <CardHeader
                                    avatar={<Avatar src={"http://localhost:4941/api/v1/users/" + supporter.supporterId + "/image"} aria-label="user profile pic">
                                        {supporter.supporterFirstName[0] + supporter.supporterLastName[0]}
                                    </Avatar>}
                                    title={supporter.supporterFirstName + " " + supporter.supporterLastName}
                                    subheader={"Supporting Since: " + dayjs(supporter.timestamp).format("DD-MM-YYYY")} />
                                <CardContent sx={{paddingBottom: 0}}>
                                    <Typography>{supporter.message}</Typography>
                                </CardContent>
                            </Card>
                        )
                    })}
                    {supporters.length === 0 && <DialogContentText>No supporters found</DialogContentText>}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    </>);
}

export default SupportTierCard