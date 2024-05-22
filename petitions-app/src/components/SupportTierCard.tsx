import React from "react";
import axios from "axios";
import {
    Avatar,
    Card, CardContent, CardHeader, CardActions,
    Typography,
    Button,
    Chip,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";

import CSS from 'csstype';
import dayjs from "dayjs";


interface ISupportTierProps {
    supportTier: SupportTier
    supporters: Supporter[]
}

function SupportTierCard(props: ISupportTierProps) {
    const [supportTier] = React.useState<SupportTier>(props.supportTier);
    const [supporters, setSupporters] = React.useState<Supporter[]>(props.supporters);
    const [openDialog, setOpenDialog] = React.useState(false);


    const CardStyles: CSS.Properties = {
        display: "inline-block", width: "300px", margin: "10px", padding: "0px"
    };

    const displaySupporters = () => {
        // Display modal with supporters
        setOpenDialog(true);
    }

    return (
        // Create a card for a support tier with the following:• List of available support tiers, each one with its title, description and cost
        <div style={{ display: "inline-block" }}>
            <Card sx={CardStyles}>
                <CardHeader sx={{ height: "50px" }}
                    title={supportTier.title} />
                <CardContent sx={{ height: "120px" }}>
                    <Chip label={"$" + supportTier.cost} />
                    <Typography variant="body2" color="text.primary">
                        {supportTier.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* On click, display modal with supporter information */}
                    <Typography variant="body2" color="text.secondary">
                        <Button onClick={displaySupporters}>View Supporters</Button>
                    </Typography>
                </CardActions>
            </Card>

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
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SupportTierCard