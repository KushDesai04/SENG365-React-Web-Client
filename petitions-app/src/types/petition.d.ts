type Petition = {

    petitionId: number,
    title: string,
    categoryId: number,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    creationDate: Date,
    description: string,
    moneyRaised: number,
    supportTiers: SupportTier[]
}