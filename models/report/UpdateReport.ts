export type UpdateReport = {
    id: string,
    assignmentReceivedData?: AssignmentReceivedData,
    arrivalData?: ArrivalData,
    completionData?: CompletionData,
    declineData?: DeclineData,
    createdAt?: Date
}

export type AssignmentReceivedData = {
    personil: string,
    packageBrought: string
}

export type ArrivalData = {
    arrivedAt: string,
    accidentDetail: string,
    packageUsed: string
}

export type CompletionData = {
    victimStatus: string,
    blocker: string,
    accidentDetail: string,
    evidence: string
}

export type DeclineData = {
    reason: string
}