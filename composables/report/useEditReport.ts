import { doc, updateDoc } from "firebase/firestore";
import type { Report } from "~/models/report/Report";

export const useEditReport = async (data: Report): Promise<Either<string, null>> => {
    const db = useFirestore()
    const docRef = doc(db, REPORT_CONSTANTS.collectionName, data.id)
    return updateDoc(docRef, {
        ...data,
        coordinates: latLngToJsonString(data.coordinates),
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}