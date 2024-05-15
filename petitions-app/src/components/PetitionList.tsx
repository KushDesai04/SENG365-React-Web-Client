import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {Alert, AlertTitle, Button, Pagination, Paper, TextField} from "@mui/material";
import PetitionListObject from "./PetitionListObject"
import SearchIcon from '@mui/icons-material/Search';

const PetitionList = () => {
    const [petitions, setPetitions] = React.useState<Array<Petition>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [infoFlag, setInfoFlag] = React.useState(false)
    const [infoMessage, setInfoMessage] = React.useState("")
    const [petitionStartIndex, setPetitionStartIndex] = React.useState(0)
    const [petitionCount, setPetitionCount] = React.useState<number>(0)
    const [petitionQuery, setPetitionQuery] = React.useState("")
    const [editPetitionQuery, setEditPetitionQuery] = React.useState("")
    const [petitionCategoryIds, setPetitionCategoryIds] = React.useState<Array<number>>([])
    const [petitionSupportingCost, setPetitionSupportingCost] = React.useState<number>(0)
    const [petitionOwnerId, setPetitionOwnerId] = React.useState<number>(0)
    const [petitionSupporterId, setPetitionSupporterId] = React.useState<number>(0)
    const [petitionSort, setPetitionSort] = React.useState<string>("")
    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/petitions?startIndex=' + petitionStartIndex + '&count=10' + petitionQuery)
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
        getPetitions()
    }, [petitionStartIndex, petitionQuery])

    const editQuery = (query: string) => {
        setEditPetitionQuery(query)
    }

    const updateQuery = () => {
        if (editPetitionQuery === "") {
            setPetitionQuery("")
        } else {
            setPetitionQuery("&q=" + editPetitionQuery)
        }
    }

    const petition_rows = () => petitions.map((petition: Petition) => <PetitionListObject
        key={petition.petitionId + petition.title} petition={petition}
    />)
    const card: CSS.Properties = {
        padding: "10px", margin: "0", display: "block"
    }
    return (<>
            <Paper elevation={3} style={card}>
                <h1>Petitions</h1>
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <TextField id="outlined-basic" label="Search" variant="outlined" size="small" onChange={(event) => editQuery(event.target.value)}/>
                    <Button variant="outlined" size="large" onClick={() => updateQuery()} style={{height: "40px"}}>
                        <SearchIcon color="primary" fontSize="medium" />
                    </Button>
                    </div>
                <div style={{display: "inline-block", width: "100%"}}>
                    {errorFlag ? <Alert severity="error" style={{display:"flex", justifyContent:"center"}}>
                        <AlertTitle> Error </AlertTitle>
                        {errorMessage}
                    </Alert> : ""}
                    {infoFlag ? <Alert severity="info" style={{display:"flex", justifyContent:"center"}}>
                        {infoMessage}
                    </Alert> : ""}
                    {petition_rows()}
                </div>
                <div>
                    <Pagination count={Math.ceil(petitionCount/10)} style={{display: "inline-block"}} size="large" onChange={(event, page) => setPetitionStartIndex((page-1)*10)}/>
                </div>
            </Paper>
        </>

    )
}
export default PetitionList