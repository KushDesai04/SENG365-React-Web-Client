import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {Alert, AlertTitle, Paper} from "@mui/material";
import PetitionListObject from "./PetitionListObject"

const PetitionList = () => {
    const [petitions, setPetitions] = React.useState<Array<Petition>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/petitions')
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setPetitions(response.data.petitions)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString() + " defaulting to old users changes app may not work as expected")
                })
        }
        getPetitions()
    }, [])
    const petition_rows = () => petitions.map((petition: Petition) => <PetitionListObject
        key={petition.petitionId + petition.title} petition={petition}
    />)
    const card: CSS.Properties = {
        padding: "10px", margin: "0", display: "block"
    }
    return (
        <Paper elevation={3} style={card}>
            <h1>Petitions</h1>
            <div style={{display: "inline-block", minWidth: "320"}}>
                {errorFlag ? <Alert severity="error">
                    <AlertTitle> Error </AlertTitle>
                    {errorMessage}
                </Alert> : ""}
                {petition_rows()}
            </div>
        </Paper>
    )
}
export default PetitionList