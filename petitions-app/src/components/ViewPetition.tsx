import { useState, useEffect } from 'react';
import {
    Alert,
    Avatar,
    Box,
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
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { styled } from '@mui/system';
import { useUserStore } from '../store';
import { useNavigate } from 'react-router-dom';
import CSS from 'csstype';
import PetitionCard from './PetitionCard';
import PetitionsCard from './PetitionsCard';


const ViewPetition = () => {
    const userToken = useUserStore(state => state.userToken);
    const { petitionId } = useParams<{ petitionId: string }>();
    const [petition, setPetition] = useState<Petition | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const [currentSupportTier, setCurrentSupportTier] = useState<number | null>(null);
    const [similarPetitions, setSimilarPetitions] = useState<Petitions[]>([]);
    const [message, setMessage] = useState<string>('');
    const [supportDialog, setSupportDialog] = useState(false);
    const [tierSupport, setTierSupport] = useState<SupportTier | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errorFlag, setErrorFlag] = useState<boolean>(false);
    const [successFlag, setSuccessFlag] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
            return;
        }
        axios.get(`http://localhost:4941/api/v1/petitions/${petitionId}`)
            .then((response) => {
                setPetition(response.data);
                fetchSimilarPetitions(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [petitionId]);

    const fetchSimilarPetitions = (petition: Petition) => {
        const fetchByOwner = axios.get(`http://localhost:4941/api/v1/petitions?ownerId=${petition.ownerId}`);
        const fetchByCategory = axios.get(`http://localhost:4941/api/v1/petitions?categoryIds=${petition.categoryId}`);

        Promise.all([fetchByOwner, fetchByCategory])
            .then(([ownerResponse, categoryResponse]) => {
                const ownerPetitions = ownerResponse.data.petitions;
                const categoryPetitions = categoryResponse.data.petitions;

                const combinedPetitions = [...ownerPetitions, ...categoryPetitions];
                const uniquePetitions = Array.from(new Set(combinedPetitions.map(p => p.petitionId)))
                    .map(id => combinedPetitions.find(p => p.petitionId === id))
                    .filter(p => p.petitionId !== petition.petitionId);

                setSimilarPetitions(uniquePetitions);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDialogOpen = (supportTier: SupportTier) => {
        setCurrentSupportTier(supportTier.supportTierId);
        axios.get(`http://localhost:4941/api/v1/petitions/${petitionId}/supporters`)
            .then((response) => {
                setSupporters(response.data);
                setOpenDialog(true);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSupporters([]);
        setCurrentSupportTier(null);
    };

    const sortedSupporters = (supporters: Supporter[]) =>
        supporters.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (!petition) {
        return <div>Loading...</div>;
    }

    const filteredSupporters = currentSupportTier
        ? supporters.filter(supporter => supporter.supportTierId === currentSupportTier)
        : [];

    const sortedFilteredSupporters = sortedSupporters(filteredSupporters);
    const setTierToSupport = (supportTier: SupportTier) => {
        setSupportDialog(true);
        setTierSupport(supportTier);
    }

    const addSupporter = () => {
        let form;
        if (tierSupport) {
            const supportTier = tierSupport;
            if (message) {
                form = {
                    "supportTierId": supportTier.supportTierId,
                    "message": message
                }
            } else {
                form = {
                    "supportTierId": supportTier.supportTierId
                }
            }
            axios.post(`http://localhost:4941/api/v1/petitions/${petitionId}/supporters`, form, { headers: { 'X-Authorization': userToken || '' } })
                .then(() => {
                    axios.get(`http://localhost:4941/api/v1/petitions/${petitionId}`)
                        .then((response) => {
                            setSupportDialog(false);
                            setMessage("")  
                            setSuccessFlag(true)
                            setErrorFlag(false)
                            setErrorMessage("Successfully supported petition")
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    if (error.response.statusText.includes("Duplicate")) {
                        setErrorMessage("You are already supporting this petition")
                    } else if (error.response.statusText.includes("your own petition")) {
                        setErrorMessage("You cannot support your own petition")
                    } else {
                        setErrorMessage(error.response.statusText)
                    }
                    
                    setErrorFlag(true)
                });
        }
    }

    const CardStyles: CSS.Properties = {
        display: "inline-block",
        width: "400px",
        margin: "10px",
        padding: "0px"
    };

    const card: CSS.Properties = {
        padding: "10px", margin: "0", display: "block"
    }

    const petition_rows = () => similarPetitions.map((similarPet: Petitions) => <PetitionsCard
        key={similarPet.petitionId + similarPet.title} petition={similarPet}
    />)

    return (
        <>
            <Snackbar
                open={errorFlag || successFlag}
                autoHideDuration={5000}
                onClose={() => {setErrorFlag(false); setSuccessFlag(false)}}
            >
                <Alert
                    severity={errorFlag ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
    
            <Paper elevation={5} style={card}>
                {<PetitionCard key={petition.petitionId + petition.title} petition={petition} />}
                <Typography variant="h6">Support Tiers</Typography>
            </Paper>
            <Paper>
                {petition.supportTiers.map((supportTier: SupportTier) => (
                    <Card sx={CardStyles}>
                        <CardHeader sx={{ height: "50px" }}
                            title={supportTier.title} />
                        <CardContent sx={{ height: "150px" }}>
                            <Chip label={"$ " + supportTier.cost} sx={{backgroundColor:"lightgreen"}}/>
                            <Typography variant="body2" color="text.primary" sx={{ margin: "5% !important" }}>
                                {supportTier.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" onClick={()=>handleDialogOpen(supportTier)}>View Supporters</Button>
                            {userToken && (
                                <Button variant="outlined" color="success" onClick={() => setTierToSupport(supportTier)}>Support</Button>
                            )}
                        </CardActions>
                    </Card>
                ))}
                <Dialog open={supportDialog} onClose={() => setSupportDialog(false)}>
                    <DialogTitle>Support Petition</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Message"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSupportDialog(false)}>Cancel</Button>
                        <Button onClick={() => addSupporter()} color="success">Support</Button>
                    </DialogActions>
                </Dialog>
    
                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={openDialog}
                    onClose={handleDialogClose}
                    aria-labelledby="supporters-dialog-title"
                    aria-describedby="supporters-dialog-description"
                >
                    <DialogTitle id="supporters-dialog-title">Supporters</DialogTitle>
                    <DialogContent>
                        {sortedFilteredSupporters.length > 0 ? (
                            <List>
                                {sortedFilteredSupporters.map((supporter) => (
                                    <ListItem key={supporter.supportId} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar src={`http://localhost:4941/api/v1/users/${supporter.supporterId}/image`} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${supporter.supporterFirstName} ${supporter.supporterLastName}`}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="textPrimary">
                                                        {supporter.message || 'No message'}
                                                    </Typography>
                                                    <br />
                                                    {`Supporting Since: ${dayjs(supporter.timestamp).format('HH:mm DD/MM/YYYY')}`}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <DialogContentText>No supporters found</DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                        </Paper>
                {similarPetitions.length === 0 ? "" : (
                <Paper elevation={5} style={card}>
                    <h1>Similar Petitions</h1>
                    {petition_rows()}
                </Paper>
            )}
        </>
    );
}                   
export default ViewPetition;   