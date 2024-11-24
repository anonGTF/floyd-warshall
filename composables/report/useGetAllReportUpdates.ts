import { collection, getDocs } from "firebase/firestore"

export const useGetAllReportUpdates = async (reportId: string): Promise<Either<string, UpdateReport[]>> => {
    const db = useFirestore()
    const collectionRef = collection(db, REPORT_CONSTANTS.collectionName, reportId, UPDATE_REPORT_CONSTANTS.collectionName)
    return getDocs(collectionRef)
    .then((snapshot) => {
        const results = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                id: doc.id,
                assignmentReceivedData: data[UPDATE_REPORT_CONSTANTS.assignmentReceivedDataAttr],
                arrivalData: data[UPDATE_REPORT_CONSTANTS.arrivalDataAttr],
                completionData: data[UPDATE_REPORT_CONSTANTS.completionDataAttr],
                createdAt: parseToDate(data[UPDATE_REPORT_CONSTANTS.createdAtAttr])
            } satisfies UpdateReport
        })
        return makeRight(results)
    })
    .catch((error) => makeLeft(error))
}