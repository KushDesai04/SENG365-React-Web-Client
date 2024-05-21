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
    Card,
    CardContent, CardHeader, CardActionArea,
    CardMedia,
    Typography,
} from "@mui/material";
import PetitionListObject from "./PetitionCard"
import { request } from 'http';
import { useParams } from 'react-router-dom';
import SupportTierCard from './SupportTierCard';

const PetitionObject = () => {
    const {id} = useParams<{id: string}>()
    const [petition, setPetition] = React.useState<Petition>()
    const [petitionToDisplay, setPetitionToDisplay] = React.useState<JSX.Element>()
    const [supporters, setSupporters] = React.useState<Supporter[]>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [infoFlag, setInfoFlag] = React.useState(false)
    const [infoMessage, setInfoMessage] = React.useState("")

    
    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions/' + id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setPetition(response.data)
                    setPetitionToDisplay(<PetitionListObject key={response.data.petitionId + response.data.title} petition={response.data}/>)
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
        const getSupporters = () => {
            axios.get('http://localhost:4941/api/v1/petitions/' + id + '/supporters')
                .then((response) => {
                    console.log("here")
                    console.log(response.data)
                    setSupporters(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getSupporters()
        getPetitions()
    }, [id])

    // const petition_support = () => petition && petition.supportTiers.map((supportTier: SupportTier) => <SupportTierCard
    //     key={supportTier.supportTierId} supportTier={supportTier} supporter={supporters.filter((supporter: Supporter) => supporter.supportTierId === supportTier.supportTierId)[0]}
    // />)
    const petition_support = () => {
        if (!petition) return null

        return petition.supportTiers.map((supportTier: SupportTier) => {
            const supporter = supporters.filter((supporter: Supporter) => supporter.supportTierId === supportTier.supportTierId)
            if (supporters.length <= 0) return null
            return <SupportTierCard key={supportTier.supportTierId} supportTier={supportTier} supporters={supporter} />
        })
    }

    const card: CSS.Properties = {
        padding: "10px", margin: "0", display: "block"
    }
    return (<>

            <Paper elevation={2} style={card}>
                <Button variant="contained" color="primary" href="/petitions">Back</Button>
            </Paper>

            <Paper elevation={3} style={card}>
                <h1>Petition</h1>
                    <div style={{display: "inline-block", width: "100%"}}>
                        {errorFlag ? <Alert severity="error" style={{display: "flex", justifyContent: "center"}}>
                            <AlertTitle> Error </AlertTitle>
                            {errorMessage}
                        </Alert> : ""}
                        {infoFlag ? <Alert severity="info" style={{display: "flex", justifyContent: "center"}}>
                            {infoMessage}
                        </Alert> : ""}
                        {petitionToDisplay}
                    </div>
            </Paper>
            <Paper elevation={4} style={card}>
                <h1>Supporters</h1>
                {petition_support()}
            </Paper>


        </>

    )
}
export default PetitionObject