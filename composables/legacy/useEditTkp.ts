import { doc, updateDoc } from "firebase/firestore";
import type { TKP } from "~/models/legacy/Tkp";

export const useEditTkp = async (data: TKP): Promise<Either<string, null>> => {
    const db = useFirestore()
    const docRef = doc(db, TKP_CONSTANTS.collectionName, data.id)
    return updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}