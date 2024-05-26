import axios from 'axios';
import React from "react";
import Container from "@mui/material/Container";
import {
    Alert,
    Avatar,
    Box,
    Button,
    CssBaseline,
    Dialog,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Snackbar,
    styled,
    TextField,
    Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useUserStore} from "../store";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const EditPetition = () => {
    const {petitionId} = useParams<{ petitionId: string }>();
    const userToken = useUserStore(state => state.userToken);
    const userId = useUserStore(state => state.userId);
    const [petition, setPetition] = React.useState<Petition>();
    const [titleError, setTitleError] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [categoryIdError, setCategoryIdError] = React.useState(false);
    const [supportTiersError, setSupportTiersError] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const [supportTiers, setSupportTiers] = React.useState<SupportTier[]>([{
        supportTierId: -1,
        title: '',
        description: '',
        cost: 0
    }]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<string>("1");
    const [openDialogs, setOpenDialogs] = React.useState<boolean[]>(new Array(supportTiers.length).fill(false));
    const [snackboxMessage, setSnackboxMessage] = React.useState<string>("");
    const [successSnackboxOpen, setSuccessSnackboxOpen] = React.useState<boolean>(false);
    const [errorSnackboxOpen, setErrorSnackboxOpen] = React.useState<boolean>(false);
    const [petitionPictureUrl, setPetitionPictureUrl] = React.useState<string>("");
    const navigate = useNavigate();

    React.useEffect(() => {
        const getPetition = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${petitionId}`)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.ownerId !== userId) {
                        navigate('/petitions');
                    }
                    setPetition(response.data);
                    setSelectedCategory(response.data.categoryId);
                    setSupportTiers(response.data.supportTiers);
                    setPetitionPictureUrl(`http://localhost:4941/api/v1/petitions/${petitionId}/image?${new Date().getTime()}`);
                }, (error) => {
                    console.log(error);
                });
        };
        const getCategories = () => {
            axios.get('http://localhost:4941/api/v1/petitions/categories')
                .then((response) => {
                    setCategories(response.data);
                }, (error) => {
                    console.log(error);
                });
        };
        getCategories();
        getPetition();
    }, []);

    const OverlayIconContainer = styled(Box)({
        position: 'absolute',
        bottom: 10,
        right: 0,
        backgroundColor: 'rgba(25, 118, 210, 1)',
        padding: '4px',
        borderRadius: '50%',
        cursor: 'pointer',
    });

    const selectCategoryChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedCategory(event.target.value);
    };

    const handleSupportTierChange = (index: number, field: keyof SupportTier, value: string | number) => {
        const newSupportTiers = [...supportTiers];
        newSupportTiers[index] = {...newSupportTiers[index], [field]: value};
        setSupportTiers(newSupportTiers);
    };

    const addSupportTier = () => {
        if (supportTiers.length < 3) {
            setSupportTiers([...supportTiers, {supportTierId: -1, title: '', description: '', cost: 0}]);
            openDialogs[supportTiers.length] = true
        }
    };

    const updatePetition = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const title = data.get('title') as string;
        const description = data.get('description') as string;
        const categoryId = selectedCategory;

        if (!title || !description || categoryId === "") {
            setTitleError(!title);
            setDescriptionError(!description);
            setCategoryIdError(!categoryId);
            return;
        }

        axios.patch('http://localhost:4941/api/v1/petitions/' + petitionId, {
            title, description, categoryId
        }, {headers: {'X-Authorization': userToken}})
            .then((response) => {
                setSnackboxMessage("Petition updated successfully");
                setSuccessSnackboxOpen(true);
                setErrorSnackboxOpen(false);
            })
            .catch((error) => {
                console.log(error);
                setSnackboxMessage("Error updating petition");
                setErrorSnackboxOpen(true);
                setSuccessSnackboxOpen(false);
            });
    };

    const chooseImage = (file: File | null) => {
        if (file) {
            setImageError(false);
            let contentType;
            switch (file.type) {
                case 'image/png':
                    contentType = 'image/png';
                    break;
                case 'image/jpeg':
                    contentType = 'image/jpeg';
                    break;
                case 'image/gif':
                    contentType = 'image/gif';
                    break;
                default:
                    setImageError(true);
                    return;
            }

            uploadImage(petitionId, contentType, file);
        } else {
            setImageError(!file);
        }
    };

    const uploadImage = (petitionId: string | undefined, contentType: string, file: File) => {
        if (petitionId) {
            const config = {
                headers: {
                    'Content-Type': contentType, 'X-Authorization': userToken
                }
            };

            axios.put(`http://localhost:4941/api/v1/petitions/${petitionId}/image`, file, config)
                .then((response) => {
                    console.log(response);
                    setSnackboxMessage("Image uploaded successfully");
                    setSuccessSnackboxOpen(true);
                    setErrorSnackboxOpen(false);
                    setPetitionPictureUrl(`http://localhost:4941/api/v1/petitions/${petitionId}/image?${new Date().getTime()}`);
                })
                .catch((error) => {
                    console.log("image error");
                    console.log(error);
                    setSnackboxMessage("Error uploading image");
                    setErrorSnackboxOpen(true);
                    setSuccessSnackboxOpen(false);
                });
        }
    };

    const toggleDialog = (index: number) => {
        const newOpenDialogs = [...openDialogs];
        newOpenDialogs[index] = !newOpenDialogs[index];
        setOpenDialogs(newOpenDialogs);

        if (!newOpenDialogs[index] && supportTiers[index].supportTierId === -1) {
            const newSupportTiers = supportTiers.filter((_, i) => i !== index);
            setSupportTiers(newSupportTiers);
            console.log(newSupportTiers);
            setOpenDialogs(newOpenDialogs.filter((_, i) => i !== index)); // Remove the corresponding dialog state
        }
    };

    const deleteSupporterTier = (index: number) => {
        const tierId = supportTiers[index].supportTierId;
        if (tierId !== -1) {
            console.log("tierId: " + tierId);
            axios.delete('http://localhost:4941/api/v1/petitions/' + petitionId + '/supportTiers/' + tierId, {headers: {'X-Authorization': userToken}})
                .then((response) => {
                    setSnackboxMessage("Support tier deleted successfully");
                    setSuccessSnackboxOpen(true);
                    setErrorSnackboxOpen(false)
                    const newSupportTiers = [...supportTiers];
                    newSupportTiers.splice(index, 1);
                    setSupportTiers(newSupportTiers);
                    toggleDialog(index);
                    window.location.reload();
                }, (error) => {
                    console.log(error);
                    setSnackboxMessage(error.response.statusText || "Error deleting support tier");
                    setErrorSnackboxOpen(true);
                    setSuccessSnackboxOpen(false);
                });
        } else {
            const newSupportTiers = [...supportTiers];
            newSupportTiers.splice(index, 1);
            setSupportTiers(newSupportTiers);
        }
    };

    const createSupportTier = (index: number) => {
        const supportTier = supportTiers[index];
        console.log(supportTier);
        if (supportTier.title === "" || supportTier.description === "") {
            setSupportTiersError(true);
            return;
        }
        if (supportTier.supportTierId === -1) {
            axios.put('http://localhost:4941/api/v1/petitions/' + petitionId + '/supportTiers', {
                title: supportTier.title,
                description: supportTier.description,
                cost: supportTier.cost
            }, {headers: {'X-Authorization': userToken}})
                .then((response) => {
                    setSnackboxMessage("Support tier created successfully");
                    setSuccessSnackboxOpen(true);
                    setErrorSnackboxOpen(false);
                    toggleDialog(index);
                    const newSupportTiers = [...supportTiers];
                    newSupportTiers[index] = {...newSupportTiers[index], supportTierId: supportTier.supportTierId};
                    setSupportTiers(newSupportTiers);
                    window.location.reload()
                })
                .catch((error) => {
                    console.log(error);
                    setSnackboxMessage("Error creating support tier");
                    setErrorSnackboxOpen(true);
                    setSuccessSnackboxOpen(false);
                });
        } else {
            axios.patch('http://localhost:4941/api/v1/petitions/' + petitionId + '/supportTiers/' + supportTier.supportTierId, {
                title: supportTier.title,
                description: supportTier.description,
                cost: supportTier.cost
            }, {headers: {'X-Authorization': userToken}})
                .then((response) => {
                    setSnackboxMessage("Support tier created successfully");
                    setSuccessSnackboxOpen(true);
                    setErrorSnackboxOpen(false);
                    toggleDialog(index);
                    const newSupportTiers = [...supportTiers];
                    newSupportTiers[index] = {...newSupportTiers[index], supportTierId: supportTier.supportTierId};
                    setSupportTiers(newSupportTiers);
                    window.location.reload()
                })
                .catch((error) => {
                    console.log(error);
                    setSnackboxMessage("Error creating support tier");
                    setErrorSnackboxOpen(true);
                    setSuccessSnackboxOpen(false);
                });
        }

    };

    return (<Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Snackbar
            open={successSnackboxOpen || errorSnackboxOpen}
            autoHideDuration={5000}
            onClose={() => {setSuccessSnackboxOpen(false); setErrorSnackboxOpen(false)}}
        >
            <Alert
                severity={successSnackboxOpen ? "success" : "error"}
                variant="filled"
                sx={{width: '100%'}}
            >
                {snackboxMessage}
            </Alert>
        </Snackbar>
        <Box
            sx={{
                marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Edit Petition
            </Typography>
            <Grid component="form" noValidate onSubmit={updatePetition} sx={{mt: 3}}>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box position="relative" display="inline-block">
                            {petitionPictureUrl && (
                                <Box
                                    component="img"
                                    src={petitionPictureUrl}
                                    alt="Petition"
                                    sx={{
                                        width: "100%",
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                            )}
                            <OverlayIconContainer>
                                <label htmlFor="image-upload">
                                    <input
                                        id="image-upload"
                                        name="image-upload"
                                        type="file"
                                        style={{display: 'none'}}
                                        onChange={(event) => chooseImage(event.target.files ? event.target.files[0] : null)}
                                    />
                                    <IconButton component="span">
                                        <EditIcon sx={{color: 'white'}}/>
                                    </IconButton>
                                </label>
                            </OverlayIconContainer>
                        </Box>
                        {imageError && (
                            <><br/><Typography variant="overline"color="error">Image must be a PNG, JPEG, or GIF.</Typography></>
                        )}
                    </Grid>
                    {petition && (<>
                        <Grid item xs={12}>
                            <TextField
                                name="title"
                                variant="outlined"
                                required
                                fullWidth
                                id="title"
                                label="Petition Title"
                                autoFocus
                                error={titleError}
                                defaultValue={petition.title}
                                helperText={titleError ? "Title is required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                defaultValue={petition.description}
                                id="description"
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                error={descriptionError}
                                helperText={descriptionError ? "Description is required" : ""}
                            />
                        </Grid>
                    </>)}

                    <Grid item xs={12}>
                        <FormControl sx={{width: "100%"}}>
                            <InputLabel id="category-filter">Category</InputLabel>
                            <Select
                                labelId="category-filter-label"
                                id="category-filter-select"
                                value={selectedCategory}
                                onChange={selectCategoryChange}
                                input={<OutlinedInput label="Category"/>}
                            >
                                {categories.map((category) => (<MenuItem
                                    key={category.categoryId}
                                    value={category.categoryId}
                                >
                                    {category.name}
                                </MenuItem>))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{display:"ruby"}}>
                        <Typography variant="h6" sx={{mt: 2}}>Support Tiers</Typography>
                        {supportTiers.length < 3 && (<Grid item xs={12}>
                            <IconButton color="primary" sx={{border: "1px solid", marginLeft: "5px"}} onClick={addSupportTier} size="small">
                                <AddIcon fontSize="inherit"/>
                            </IconButton>
                        </Grid>)}
                    </Grid>
                    <Grid container spacing={2} sx={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                    {supportTiers.map((tier, index) => (
                        <Grid item key={index}>
                            <Button onClick={() => toggleDialog(index)} variant="outlined">
                                Edit {tier.title ? tier.title : "Support Tier"}
                            </Button>
                            <Dialog open={openDialogs[index]} onClose={() => toggleDialog(index)} fullWidth={true}
                                    maxWidth={"md"}>
                                {/* Dialog content for each support tier */}
                                <form onSubmit={(e) => e.preventDefault()} style={{margin: "20px"}}>
                                    <Box p={2}>
                                        <TextField
                                            label="Support Tier Title"
                                            variant="outlined"
                                            fullWidth
                                            value={tier.title}
                                            onChange={(e) => handleSupportTierChange(index, 'title', e.target.value)}
                                            sx={{marginBottom: 2}}
                                        />
                                        <TextField
                                            label="Support Tier Description"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={tier.description}
                                            onChange={(e) => handleSupportTierChange(index, 'description', e.target.value)}
                                            sx={{marginBottom: 2}}
                                        />
                                        <TextField
                                            label="Support Tier Cost"
                                            variant="outlined"
                                            fullWidth
                                            type="number"
                                            value={tier.cost}
                                            onChange={(e) => handleSupportTierChange(index, 'cost', Number(e.target.value))}
                                            sx={{marginBottom: 2}}
                                        />
                                    </Box>
                                    <Box sx={{display: "flex"}} p={2}>
                                        <Button
                                            variant="outlined"
                                            color={"error"}
                                            onClick={() => deleteSupporterTier(index)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => createSupportTier(index)}
                                            sx={{marginLeft: "auto"}}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </form>
                            </Dialog>
                        </Grid>
                    ))}
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            type="submit"
                        >
                            Save Petition
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </Container>
);
};

export default EditPetition;
