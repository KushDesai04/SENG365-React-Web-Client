import React from "react";
import axios from "axios";
import {
    Avatar,
    Card, CardContent, CardHeader, CardActions,
    Typography,
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";

import CSS from 'csstype';
import dayjs from "dayjs";
import { Link } from "react-router-dom";


interface ISupportTierProps {
    supportTier: SupportTier
    supporters: Supporter[]
}

function SupportTierCard(props: ISupportTierProps) {
    const [supportTier] = React.useState<SupportTier>(props.supportTier);
    const [supporters, setSupporters] = React.useState<Supporter[]>(props.supporters);
    const [openDialog, setOpenDialog] = React.useState(false);


    const CardStyles: CSS.Properties = {
        display: "inline-block", height: "fit", width: "300px", margin: "10px", padding: "0px"
    };

    const displaySupporters = () => {
        // Display modal with supporters
        setOpenDialog(true);
    }

    return (
        // Create a card for a support tier with the following:• List of available support tiers, each one with its title, description and cost
        <div style={{display:"inline-block"}}>
        <Card sx={CardStyles}>
            <CardHeader sx={{ height: "50px" }}
                title={supportTier.title + " - $" + supportTier.cost} />
            <CardContent sx={{ height: "100px" }}>
                <Typography variant="body2" color="text.secondary">
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
        open={openDialog}
        onClose={()=>{ setOpenDialog(false) }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
            {"Supporters"}
        </DialogTitle>
        <DialogContent>
            {supporters.map((supporter) => {
                return (
                <div style={{display:"inline-block"}}>
                    <Avatar>{supporter.supporterFirstName[0] + supporter.supporterLastName[0]}</Avatar>
                    <Typography>{supporter.supporterFirstName + " " + supporter.supporterLastName}</Typography>
                </div>
                )
            })}
        </DialogContent>
        <DialogActions>
            <Button onClick={()=> setOpenDialog(false)}>Close</Button>
        </DialogActions>
    </Dialog>
    </div>
    );
}

export default SupportTierCard