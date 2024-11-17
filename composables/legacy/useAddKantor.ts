import { addDoc, collection } from "firebase/firestore";
import type { Kantor } from "~/models/legacy/Kantor";

export const useAddKantor = async (data: Kantor): Promise<Either<string, null>> => {
    const db = useFirestore()
    const collectionRef = collection(db, KANTOR_CONSTANTS.collectionName)
    return addDoc(collectionRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}