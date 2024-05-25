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
import PetitionCard from "./PetitionCard"
import { request } from 'http';
import { useParams } from 'react-router-dom';
import SupportTierCard from './SupportTierCard';
import PetitionsCard from "./PetitionsCard"

const ViewPetition = () => {
    const {id} = useParams<{id: string}>()
    const [petition, setPetition] = React.useState<Petition>()
    const [petitionToDisplay, setPetitionToDisplay] = React.useState<JSX.Element>()
    const [supporters, setSupporters] = React.useState<Supporter[]>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [infoFlag, setInfoFlag] = React.useState(false)
    const [infoMessage, setInfoMessage] = React.useState("")
    const [similarPetitions, setSimilarPetitions] = React.useState<Petitions[]>([])
    const [noSimilarPetitionsFlag, setNoSimilarPetitionsFlag] = React.useState(false)


    React.useEffect(() => {
        const getPetition = () => {
            axios.get('http://localhost:4941/api/v1/petitions/' + id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setPetition(response.data)
                    setPetitionToDisplay(<PetitionCard key={response.data.petitionId + response.data.title} petition={response.data} />)
                    if (response.data.count === 0) {
                        setInfoFlag(true)
                        setInfoMessage("No petitions found")
                    } else {
                        setInfoFlag(false)
                        setInfoMessage("")
                    }
                    // Call getSimilarPetitions after setting the petition data
                    getSimilarPetitions(response.data);
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        const getSupporters = () => {
            axios.get('http://localhost:4941/api/v1/petitions/' + id + '/supporters')
                .then((response) => {
                    console.log(response.data)
                    setSupporters(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        const getSimilarPetitions = (petition: Petition) => {
            const ownerIdRequest = axios.get(`http://localhost:4941/api/v1/petitions?ownerId=${petition.ownerId}`);
            const categoryIdsRequest = axios.get(`http://localhost:4941/api/v1/petitions?categoryIds=${petition.categoryId}`);

            Promise.all([ownerIdRequest, categoryIdsRequest])
                .then(([ownerIdResponse, categoryIdsResponse]) => {
                    setErrorFlag(false);
                    setErrorMessage("");

                    const ownerIdPetitions = ownerIdResponse.data.petitions;
                    const categoryIdsPetitions = categoryIdsResponse.data.petitions;

                    // Combine the results from both API calls
                    const allPetitions = [...ownerIdPetitions, ...categoryIdsPetitions];

                    // Remove duplicates and the current petition
                    const filteredSimilarPetitions = Array.from(new Set(allPetitions.filter((p: Petitions) => p.petitionId !== petition.petitionId)));

                    setSimilarPetitions(filteredSimilarPetitions);

                    if (filteredSimilarPetitions.length === 0) {
                        setNoSimilarPetitionsFlag(true);
                    } else {
                        setNoSimilarPetitionsFlag(false);
                    }
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getSupporters()
        getPetition()
    }, [id])

    const petition_support = () => {
        if (!petition) return null

        return petition.supportTiers.map((supportTier: SupportTier) => {
            const supporter = supporters.filter((supporter: Supporter) => supporter.supportTierId === supportTier.supportTierId)
            return <SupportTierCard key={supportTier.supportTierId} supportTier={supportTier} supporters={supporter} petitionId={petition.petitionId}/>
        })
    }



    const petition_rows = () => similarPetitions.map((similarPet: Petitions) => <PetitionsCard
        key={similarPet.petitionId + similarPet.title} petition={similarPet}
    />)

    const card: CSS.Properties = {
        padding: "10px", margin: "0", display: "block"
    }

    return (<>
            <Paper elevation={1} style={card}>
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
            <Paper elevation={3} style={card}>
                <h1>Support Tiers</h1>
                {petition_support()}
            </Paper>
            {noSimilarPetitionsFlag ? "" : (
                <Paper elevation={5} style={card}>
                    <h1>Similar Petitions</h1>
                    {petition_rows()}
                </Paper>
            )}



        </>

    )
}
export default ViewPetition