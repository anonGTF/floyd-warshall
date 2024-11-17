import { deleteDoc, doc } from "firebase/firestore";

export const useDeleteKantor = async (id: string): Promise<Either<string, null>> => {
    const db = useFirestore()
    const docRef = doc(db, TKP_CONSTANTS.collectionName, id)
    return deleteDoc(docRef)
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}