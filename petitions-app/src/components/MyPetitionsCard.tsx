import React from "react";
import axios from "axios";
import {
    Alert,
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Typography
} from "@mui/material";
import CSS from 'csstype';
import dayjs from "dayjs";
import {Link, useNavigate} from "react-router-dom";
import {useUserStore} from "../store";

interface IPetitionProps {
    petition: Petitions
}

const numberToRGB = (num: number) => {
    const r = (num * 137.5) % 360;
    return `hsl(${r}, 100%, 40%)`
}

function PetitionsCard(props: IPetitionProps) {
    const navigate = useNavigate();
    const userToken = useUserStore(state => state.userToken);
    const userId = useUserStore(state => state.userId);
    const [petition] = React.useState<Petitions>(props.petition);
    const [category, setCategory] = React.useState<string>("");
    const [categoryId] = React.useState<number>(petition.categoryId);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [petitionImageURL, setPetitionImageURL] = React.useState<string>("");
    const [infoFlag, setInfoFlag] = React.useState(false);

    React.useEffect(() => {
        setPetitionImageURL(`http://localhost:4941/api/v1/petitions/${petition.petitionId}/image`)
    }, [])

    const petitionCardStyles: CSS.Properties = {
        display: "inline-block", width: "400px", margin: "10px", padding: "0px"
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const handleDelete = () => {
        // Add your delete logic here
        // For example:
        axios.delete(`http://localhost:4941/api/v1/petitions/${petition.petitionId}`, {headers: {'X-Authorization': userToken}})
            .then(() => {
                setInfoFlag(true)
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
                setOpen(true);
                setOpenDialog(false);
            });
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

    return (<>
            <Snackbar
                open={infoFlag}
                autoHideDuration={6000}
                onClose={()=>setInfoFlag(false)}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Deleted Successfully
                </Alert>
            </Snackbar>
            <Card sx={petitionCardStyles}>
                <CardActionArea component={Link} to={'/petitions/' + petition.petitionId}>
                    <CardHeader style={{textAlign: "left", height: "50px"}}
                                avatar={<Avatar
                                    src={petitionImageURL}
                                    aria-label="user profile pic">
                                    {petition.ownerFirstName[0] + petition.ownerLastName[0]}
                                </Avatar>}
                                title={petition.ownerFirstName + " " + petition.ownerLastName}
                                subheader={"Created: " + dayjs(petition.creationDate).format("DD-MM-YYYY")}/>
                    <CardMedia
                        component="img"
                        height="200"
                        width="300"
                        sx={{objectFit: "cover"}}
                        image={"http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/image"}
                        alt="Petition hero"/>
                    <CardContent sx={{height: "100px"}}>
                        <Typography variant="h6">
                            {petition.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cost: {petition.supportingCost}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Chip label={category} variant="filled"
                          sx={{backgroundColor: numberToRGB(categoryId), color: "white", fontWeight: "bold"}}/>

                    {petition.ownerId === userId ? (
                        <>
                            <Button variant="outlined" sx={{marginLeft: "auto !important"}}
                                    onClick={() => navigate('/editPetition/' + petition.petitionId)}>
                                Edit
                            </Button>
                            <Button color="error" variant="outlined"
                                    onClick={() => setOpenDialog(true)}>
                                Delete
                            </Button>
                            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogContent>
                                    <Typography variant="body1">Are you sure you want to delete this
                                        petition?</Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button variant="outlined" onClick={handleDelete} color="error">Delete</Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    ) : ""}

                </CardActions>
            </Card>

            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Cannot delete a petition with existing supporters
                </Alert>
            </Snackbar>
        </>
    )

}

export default PetitionsCard