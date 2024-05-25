import axios from 'axios';
import React from "react";
import Container from "@mui/material/Container";
import {
    Box,
    Button,
    CssBaseline,
    FormControl,
    Grid, IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select, styled,
    TextField,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Category} from "@mui/icons-material";
import {useUserStore} from "../store";
import EditIcon from "@mui/icons-material/Edit";

const CreatePetition = () => {
    const userToken = useUserStore(state => state.userToken);
    const [titleError, setTitleError] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [categoryIdError, setCategoryIdError] = React.useState(false);
    const [supportTiersError, setSupportTiersError] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const [supportTiers, setSupportTiers] = React.useState<PostSupportTier[]>([{title: '', description: '', cost: 0}]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<string>("1");
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [image, setImage] = React.useState<File | null>(null);
    const [contentType, setContentType] = React.useState<string>("")
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = React.useState<File>()
    const [preview, setPreview] = React.useState<string>("")



    React.useEffect(() => {
        if (!userToken) {
            navigate('/petitions');
        }
        const getCategories = () => {
            axios.get('http://localhost:4941/api/v1/petitions/categories')
                .then((response) => {
                    setCategories(response.data)
                    setSelectedCategory(response.data[0].categoryId)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getCategories()
        if (!selectedFile) {
            setPreview("")
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const selectCategoryChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedCategory(event.target.value);
    }

    const handleSupportTierChange = (index: number, field: keyof SupportTier, value: string | number) => {
        const newSupportTiers = [...supportTiers];
        newSupportTiers[index] = {...newSupportTiers[index], [field]: value};
        setSupportTiers(newSupportTiers);
    };

    const addSupportTier = () => {
        if (supportTiers.length < 3) {
            setSupportTiers([...supportTiers, {title: '', description: '', cost: 0}]);
        }
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const title = data.get('title') as string;
        const description = data.get('description') as string;
        const categoryId = selectedCategory;
        const tiers = supportTiers;

        if (!title || !description || categoryId === "" || tiers.length === 0 || !image) {
            setTitleError(!title);
            setDescriptionError(!description);
            setCategoryIdError(!categoryId);
            setSupportTiersError(tiers.length === 0);
            setImageError(!image);
            return;
        }

        axios.post('http://localhost:4941/api/v1/petitions', {
            title,
            description,
            categoryId,
            supportTiers: tiers
        }, {headers: {'X-Authorization': userToken}})
            .then((response) => {
                const petitionId = response.data.petitionId;
                uploadImage(petitionId)
                navigate('/mypetitions');
            })
            .catch((error) => {
                console.error(error);
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

            setContentType(contentType)
            setImage(file)
            setSelectedFile(file)
        } else {
            setImageError(!file);
        }
    }

    const uploadImage = (petitionId: number) => {
        const config = {
            headers: {
                'Content-Type': contentType,
                'X-Authorization': userToken
            }
        };

        axios.put(`http://localhost:4941/api/v1/petitions/${petitionId}/image`, image, config)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    const OverlayIconContainer = styled(Box)({
        position: 'absolute',
        bottom: 10,
        right: 0,
        backgroundColor: 'rgba(25, 118, 210, 1)',
        padding: '4px',
        borderRadius: '50%',
        cursor: 'pointer',
    });

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Create Petition
                </Typography>
                <Grid component="form" noValidate onSubmit={submit} sx={{mt: 3}}>
                    <Grid item xs={12}>
                        <Box position="relative" display="inline-block">
                            {preview ? (<>
                                <Box
                                    component="img"
                                    src={preview}
                                    alt="Petition"
                                    sx={{
                                        width: "100%",
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
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
                                </>
                            ) : <Grid item xs={12} sx={{margin:1}}>
                                <Box>
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/gif"
                                            hidden
                                            onChange={e => chooseImage(e.target.files?.[0] || null)}
                                        />
                                    </Button>
                                    <br/>
                                    <Typography variant="overline" color="error" align="left">
                                        {imageError ? "Image must be of type .jpg/.png/.gif" : ""}
                                    </Typography>
                                </Box>
                            </Grid>}

                        </Box>
                        {imageError && (
                            <><br/><Typography variant="overline"color="error">Only PNG, JPEG, and GIF files are allowed</Typography></>
                        )}
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="title"
                                name="title"
                                required
                                fullWidth
                                id="title"
                                label="Petition Title"
                                autoFocus
                                error={titleError}
                                helperText={titleError ? "Title is required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                error={descriptionError}
                                helperText={descriptionError ? "Description is required" : ""}
                            />
                        </Grid>
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
                        {supportTiers.map((tier, index) => (
                            <Grid item key={index} xs={12}>
                                <TextField
                                    label="Support Tier Title"
                                    variant="outlined"
                                    fullWidth
                                    value={tier.title}
                                    onChange={e => handleSupportTierChange(index, 'title', e.target.value)}
                                    sx={{marginBottom: 1}}
                                />
                                <TextField
                                    label="Support Tier Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={tier.description}
                                    onChange={e => handleSupportTierChange(index, 'description', e.target.value)}
                                    sx={{marginBottom: 1}}
                                />
                                <TextField
                                    label="Support Tier Cost"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    value={tier.cost}
                                    onChange={e => handleSupportTierChange(index, 'cost', Number(e.target.value))}
                                    sx={{marginBottom: 1}}
                                />
                            </Grid>
                        ))}
                        {supportTiers.length < 3 && (
                            <Grid item xs={12}>
                                <Button variant="outlined" onClick={addSupportTier}>
                                    Add Support Tier
                                </Button>
                            </Grid>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            type="submit"
                        >
                            Create Petition
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to={"/petitions"}>
                                    Back to Petitions
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}


export default CreatePetition;
