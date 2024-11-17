import { addDoc, collection } from "firebase/firestore";
import type { TKP } from "~/models/legacy/Tkp";

export const useAddTkp = async (data: TKP): Promise<Either<string, null>> => {
    const db = useFirestore()
    const collectionRef = collection(db, TKP_CONSTANTS.collectionName)
    return addDoc(collectionRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}