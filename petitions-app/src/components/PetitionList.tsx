import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import PetitionsCard from "./PetitionsCard"
import SearchIcon from '@mui/icons-material/Search';

const SortOptions = [{
    value: 'CREATED_ASC', label: 'Creation Date'
}, {
    value: 'CREATED_DESC', label: 'Creation Date Descending'
}, {
    value: 'COST_ASC', label: 'Cost (Low to High)'
}, {
    value: 'COST_DESC', label: 'Cost (High to Low)'
}, {
    value: 'ALPHABETICAL_ASC', label: 'A-Z'
}, {
    value: 'ALPHABETICAL_DESC', label: 'Z-A'
}]


const PetitionList = () => {
    const [petitions, setPetitions] = React.useState<Array<Petitions>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [infoFlag, setInfoFlag] = React.useState(false)
    const [petitionStartIndex, setPetitionStartIndex] = React.useState(0)
    const [petitionCount, setPetitionCount] = React.useState<number>(0)
    const [petitionQuery, setPetitionQuery] = React.useState("")
    const [editPetitionQuery, setEditPetitionQuery] = React.useState("")
    const [petitionSupportingCost, setPetitionSupportingCost] = React.useState<string>("")
    const [petitionSort, setPetitionSort] = React.useState<string>("CREATED_ASC")
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [petitionCategory, setPetitionCategory] = React.useState<string[]>([]);
    const [filter, setFilter] = React.useState<string>("")

    React.useEffect(() => {
        let newFilter = 'startIndex=' + petitionStartIndex + '&count=10'

        if (petitionQuery !== "") {
            newFilter += "&q=" + petitionQuery
        }

        if (petitionSupportingCost !== "") {
            newFilter += "&supportingCost=" + petitionSupportingCost
        }

        petitionCategory.forEach((cat) => {
            newFilter += "&categoryIds=" + cat
        })

        newFilter += "&sortBy=" + petitionSort

        setFilter(newFilter)

    }, [petitionStartIndex, petitionQuery, petitionCategory, petitionSupportingCost, petitionSort])

    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions?' + filter)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setPetitions(response.data.petitions)
                    setPetitionCount(response.data.count)
                    if (response.data.count === 0) {
                        setInfoFlag(true)
                        setErrorMessage("No petitions found")
                    } else {
                        setInfoFlag(false)
                    }
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                })
        }

        const getCategories = () => {
            axios.get('http://localhost:4941/api/v1/petitions/categories')
                .then((response) => {
                    setCategories(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getCategories()
        getPetitions()
    }, [filter])

    const editQuery = (query: string) => {
        setEditPetitionQuery(query)
    }

    const updateQuery = () => {
        if (editPetitionQuery === "") {
            setPetitionQuery("")
        } else {
            setPetitionQuery(editPetitionQuery)
        }
    }

    const changeSupportingCost = (value: string) => {
        setPetitionSupportingCost(value)
    }

    const changeCategory = (event: SelectChangeEvent<typeof petitionCategory>) => {
        const {target: {value},} = event;
        setPetitionCategory(typeof value === 'string' ? value.split(',') : value,);
    }

    const changeSort = (event: SelectChangeEvent<typeof petitionSort>) => {
        const {target: {value},} = event;
        setPetitionSort(value)
    }

    const clearFilters = () => {
        setPetitionQuery("")
        setEditPetitionQuery("")
        setPetitionSupportingCost("")
        setPetitionCategory([])
        setPetitionSort("CREATED_ASC")
        // reset search field

    }

    const petition_rows = () => petitions.map((petition: Petitions) => <PetitionsCard
        key={petition.petitionId + petition.title} petition={petition}
    />)
    const card: CSS.Properties = {
        padding: "10px", margin: "0", display: "block"
    }
    return (<>
        <Snackbar open={errorFlag || infoFlag} autoHideDuration={6000} onClose={()=>{setErrorFlag(false); setInfoFlag(false)}}>
            <Alert severity={errorFlag ? "error" : "info"} variant="filled" sx={{width: '100%'}}>
                {errorMessage}
            </Alert>
        </Snackbar>
        <Paper elevation={3} style={card}>
            <h1>Petitions</h1>
            <Box m={2}>
                <TextField
                    id="outlined-basic"
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={editPetitionQuery}
                    onChange={(event) => editQuery(event.target.value)}
                />
                <Button variant="outlined" size="large" onClick={() => updateQuery()} style={{height: "40px"}}>
                    <SearchIcon color="primary" fontSize="medium"/>
                </Button>

            </Box>
            <Box style={{display: 'flex', justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: '10px'}}>

                <TextField
                    id="outlined-basic"
                    label="Max Supporting Cost"
                    variant="outlined"
                    type="number"
                    value={petitionSupportingCost}
                    onChange={(e) => changeSupportingCost(e.target.value)}
                    sx={{marginBottom: 2}}
                />
                <FormControl sx={{width: 300}}>
                    <InputLabel id="category-filter">Categories</InputLabel>
                    <Select
                        labelId="category-filter-label"
                        id="category-filter-select"
                        multiple
                        value={petitionCategory}
                        onChange={changeCategory}
                        input={<OutlinedInput label="Category"/>}
                    >
                        {categories.map((category) => (<MenuItem key={category.categoryId} value={category.categoryId}>
                            {category.name}
                        </MenuItem>))}
                    </Select>
                </FormControl>
                <FormControl sx={{width: 300}}>
                    <InputLabel id="sort-by">Sort By</InputLabel>
                    <Select
                        labelId="sort-by-label"
                        id="sort-by-select"
                        value={petitionSort}
                        onChange={changeSort}
                        input={<OutlinedInput label="Sort By"/>}
                    >
                        {SortOptions.map((option) => (<MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>))}
                    </Select>
                </FormControl>
            </Box>
            <Button variant="outlined" color="error" size="medium" onClick={() => clearFilters()}
                    style={{height: "40px", marginLeft: 2}}>
                <Typography fontSize="medium">Clear Filters</Typography>
            </Button>
            <div style={{display: 'inline-block', width: '100%'}}>
                {petition_rows()}
            </div>
            <div>
                <Pagination
                    showFirstButton
                    showLastButton
                    count={Math.ceil(petitionCount / 10)}
                    style={{display: "inline-block"}}
                    size="large"
                    onChange={(event, page) => setPetitionStartIndex((page - 1) * 10)}
                />
            </div>
        </Paper>
    </>)
}
export default PetitionList