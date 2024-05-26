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
    petition: Petition
}

const numberToRGB = (num: number) => {
    const r = (num * 137.5) % 360;
    return `hsl(${r}, 100%, 40%)`
}

function PetitionCard(props: IPetitionProps) {
    const [petition] = React.useState<Petition>(props.petition);
    const [category, setCategory] = React.useState<string>("");
    const petitionCardStyles: CSS.Properties = {
        display: "inline-block", width: "50vw", margin: "10px", padding: "0px"
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
        <Card sx={petitionCardStyles}>
            <CardActionArea component={Link} to={'/petitions/' + petition.petitionId}>
                <CardHeader style={{ textAlign: "left", height: "50px" }}
                    avatar={<Avatar src={"http://localhost:4941/api/v1/users/" + petition.ownerId + "/image"} aria-label="user profile pic">
                        {petition.ownerFirstName[0] + petition.ownerLastName[0]}
                    </Avatar>}
                    title={petition.ownerFirstName + " " + petition.ownerLastName}
                    subheader={"Created: " + dayjs(petition.creationDate).format("HH:mm DD/MM/YYYY")} />
                <CardMedia
                    component="img"
                    sx={{ objectFit: "cover", maxHeight:"50vh"}}
                    image={"http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/image"}
                    alt="Petition hero" />
                <CardContent sx={{ height: "250px"}}>
                    <Typography variant="h5">
                        {petition.title}
                    </Typography>
                    <Typography variant="h6">
                        {petition.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Money Raised: ${petition.moneyRaised}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Chip label={category} size="medium" sx={{backgroundColor: numberToRGB(petition.categoryId), color:"white", fontWeight: "bold"}}/>
                    <Chip label={"Supporters: " + petition.numberOfSupporters} sx={{marginLeft: "auto !important"}} size="medium"/>

                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default PetitionCard