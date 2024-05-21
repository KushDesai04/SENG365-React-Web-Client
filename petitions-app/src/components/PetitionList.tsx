import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {
    Alert,
    AlertTitle,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Checkbox
} from "@mui/material";
import PetitionCard from "./PetitionCard"
import SearchIcon from '@mui/icons-material/Search';
import {Category} from "@mui/icons-material";

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
    value: 'ALPHABETICAL_DESC', label: 'A-Z Descending'
}]
const PetitionList = () => {
    const [petitions, setPetitions] = React.useState<Array<Petitions>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [infoFlag, setInfoFlag] = React.useState(false)
    const [infoMessage, setInfoMessage] = React.useState("")
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
                        setInfoMessage("No petitions found")
                    } else {
                        setInfoFlag(false)
                        setInfoMessage("")
                    }
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
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
        const { target: {value}, } = event;
        setPetitionCategory(typeof value === 'string' ? value.split(',') : value,);
    }

    const changeSort = (event: SelectChangeEvent<typeof petitionSort>) => {
        const { target: {value}, } = event;
        setPetitionSort(value)
    }

    const petition_rows = () => petitions.map((petition: Petitions) => <PetitionCard
        key={petition.petitionId + petition.title} petition={petition}
    />)
    const card: CSS.Properties = {
        padding: "10px", margin: "0", display: "block"
    }
    return (<>
            <Paper elevation={3} style={card}>
                <h1>Petitions</h1>
                <div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <TextField id="outlined-basic" label="Search" variant="outlined" size="small"
                                   onChange={(event) => editQuery(event.target.value)}/>
                        <Button variant="outlined" size="large" onClick={() => updateQuery()} style={{height: "40px"}}>
                            <SearchIcon color="primary" fontSize="medium"/>
                        </Button>
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 10,
                        width: "100%"
                    }}>
                        <TextField id="outlined-basic" label="Max Supporting Cost" variant="outlined" size="small"
                                   onChange={(event) => changeSupportingCost(event.target.value)}/>
                    </div>
                    <div>
                        <FormControl sx={{m: 1, width: 300}}>
                            <InputLabel id="category-filter">Categories</InputLabel>
                            <Select
                                labelId="category-filter-label"
                                id="category-filter-select"
                                multiple
                                value={petitionCategory}
                                onChange={changeCategory}
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
                    </div>
                    <div>
                        <FormControl sx={{m: 1, width: 300}}>
                            <InputLabel id="sort-by">Sort By</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                id="sort-by-select"
                                value={petitionSort}
                                onChange={changeSort}
                                input={<OutlinedInput label="Sort By"/>}
                            >
                                {SortOptions.map((option) => (<MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{display: "inline-block", width: "100%"}}>
                        {errorFlag ? <Alert severity="error" style={{display: "flex", justifyContent: "center"}}>
                            <AlertTitle> Error </AlertTitle>
                            {errorMessage}
                        </Alert> : ""}
                        {infoFlag ? <Alert severity="info" style={{display: "flex", justifyContent: "center"}}>
                            {infoMessage}
                        </Alert> : ""}
                        {petition_rows()}
                    </div>
                    <div>
                        <Pagination showFirstButton showLastButton count={Math.ceil(petitionCount / 10)}
                                    style={{display: "inline-block"}} size="large"
                                    onChange={(event, page) => setPetitionStartIndex((page - 1) * 10)}/>
                    </div>
                </div>
            </Paper>
        </>

    )
}
export default PetitionList