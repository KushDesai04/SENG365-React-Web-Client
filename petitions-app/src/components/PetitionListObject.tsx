import React from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    IconButton, TextField,
    Typography
} from "@mui/material";
import CSS from 'csstype';

interface IPetitionProps {
    petition: Petition
}

const PetitionListObject = (props: IPetitionProps) => {
    const [petition] = React.useState<Petition>(props.petition)
    const petitionCardStyles: CSS.Properties = {
        display: "inline-block", height: "328px", width: "300px", margin: "10px", padding: "0px"
    }

    return (
        <Card sx={petitionCardStyles}>
            <CardMedia
                component="img"
                height="200"
                width="200"
                sx={{objectFit: "cover"}}
                image="https://png.pngitem.com/pimgs/s/150-1503945_transparent-petition-png-default-petition-image-png-png.png"
                alt="Auction hero"
            />
            <CardContent>
                <Typography variant="h5">
                    {petition.title}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default PetitionListObject