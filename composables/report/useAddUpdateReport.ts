import { addDoc, collection } from "firebase/firestore"

export const useAddUpdateReport = (reportId: string, data: UpdateReport): Promise<Either<string, null>> => {
    const db = useFirestore()
    const collectionRef = collection(db, REPORT_CONSTANTS.collectionName, reportId, UPDATE_REPORT_CONSTANTS.collectionName)
    return addDoc(collectionRef, {
        ...data,
        createdAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error))
}