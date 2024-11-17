import { addDoc, collection } from "firebase/firestore";
import type { Report } from "~/models/report/Report";

export const useAddReport = async (data: Report): Promise<Either<string, string>> => {
    const db = useFirestore()
    const collectionRef = collection(db, REPORT_CONSTANTS.collectionName)
    return addDoc(collectionRef, {
        ...data,
        coordinates: latLngToJsonString(data.coordinates),
        createdAt: new Date(),
        updatedAt: new Date()
    })
    .then((result) => makeRight(result.id))
    .catch((error) => makeLeft(error.message))
}