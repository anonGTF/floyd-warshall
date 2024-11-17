import { addDoc, collection } from "firebase/firestore";

export const useAddCalculationResult = async (
    reportId: string,
    data: CalculationResult
): Promise<Either<string, null>> => {
    const db = useFirestore()
    const collectionRef = collection(db, REPORT_CONSTANTS.collectionName, reportId, CALCULATION_RESULT_CONSTANTS.collectionName)
    return addDoc(collectionRef, {
        ...data,
        coordinates: latLngToJsonString(data.coordinates),
        createdAt: new Date(),
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}