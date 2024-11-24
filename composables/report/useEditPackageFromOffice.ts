import { doc, updateDoc } from "firebase/firestore";
import type { Package } from "~/models/report/Package";

export const useEditPackageFromOffice = async (data: Package, officeId: string): Promise<Either<string, null>> => {
    const db = useFirestore()
    const collectionRef = doc(db, KANTOR_CONSTANTS.collectionName, officeId, PACKAGE_CONSTANTS.collectionName, data.id)
    return updateDoc(collectionRef, {
        ...data,
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}