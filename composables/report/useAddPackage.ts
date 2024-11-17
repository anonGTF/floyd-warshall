import { addDoc, collection } from "firebase/firestore";
import type { Package } from "~/models/report/Package";

export const useAddPackage = async (data: Package): Promise<Either<string, null>> => {
    const db = useFirestore()
    const collectionRef = collection(db, PACKAGE_CONSTANTS.collectionName)
    return addDoc(collectionRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}