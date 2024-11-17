import { deleteDoc, doc } from "firebase/firestore";

export const useDeleteReport = async (id: string): Promise<Either<string, null>> => {
    const db = useFirestore()
    const docRef = doc(db, REPORT_CONSTANTS.collectionName, id)
    return deleteDoc(docRef)
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}