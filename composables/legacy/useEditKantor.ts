import { doc, updateDoc } from "firebase/firestore";
import type { Kantor } from "~/models/legacy/Kantor";

export const useEditKantor = async (data: Kantor): Promise<Either<string, null>> => {
    const db = useFirestore()
    const docRef = doc(db, KANTOR_CONSTANTS.collectionName, data.id)
    return updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}