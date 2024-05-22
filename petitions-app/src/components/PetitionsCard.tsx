import React from "react";
import axios from "axios";
import {
    Avatar,
    Card,
    CardContent, CardHeader, CardActionArea, CardActions, CardMedia,
    Typography,
    Chip
} from "@mui/material";
import CSS from 'csstype';
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface IPetitionProps {
    petition: Petitions
}

function PetitionCard(props: IPetitionProps) {
    const [petition] = React.useState<Petitions>(props.petition);
    const [category, setCategory] = React.useState<string>("");
    const petitionCardStyles: CSS.Properties = {
        display: "inline-block", width: "300px", margin: "10px", padding: "0px"
    };
    React.useEffect(() => {
        const getCategory = () => {
            axios.get('http://localhost:4941/api/v1/petitions/categories').then(response => {
                response.data.forEach((cat: { categoryId: number; name: string; }) => {
                    if (cat.categoryId === petition.categoryId) {
                        setCategory(cat.name);
                    }
                });
            });
        };
        getCategory();
    }, []);

    return (
        // Create a card for a petition with the following:
        // Hero image,
        // title,
        // creation date,
        // category,
        // owner (first and last name and hero image),
        // supporting cost (of the minimum tier)
        <Card sx={petitionCardStyles}>
            <CardActionArea component={Link} to={'/petitions/' + petition.petitionId}>
                <CardHeader style={{ textAlign: "left", height: "50px" }}
                    avatar={<Avatar src={"http://localhost:4941/api/v1/users/" + petition.ownerId + "/image"} aria-label="user profile pic">
                        {petition.ownerFirstName[0] + petition.ownerLastName[0]}
                    </Avatar>}
                    title={petition.ownerFirstName + " " + petition.ownerLastName}
                    subheader={"Created: " + dayjs(petition.creationDate).format("DD-MM-YYYY")} />
                <CardMedia
                    component="img"
                    height="200"
                    width="300"
                    sx={{ objectFit: "cover"}}
                    image={"http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/image"}
                    alt="Petition hero" />
                <CardContent sx={{ height: "100px"}}>
                    <Typography variant="h6">
                        {petition.title}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Chip label={category}/>
                    <Typography variant="body2" color="text.secondary" sx={{marginLeft: "auto !important"}}>
                        Cost: {petition.supportingCost}
                    </Typography>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default PetitionCard