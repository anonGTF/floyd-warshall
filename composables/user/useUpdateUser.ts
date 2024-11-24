import { doc, updateDoc } from "firebase/firestore"

export const useUpdateUser = async (user: User): Promise<Either<string, null>> => {
    const db = useFirestore()
    const docRef = doc(db, USER_CONSTANTS.collectionName, user.id)
    return updateDoc(docRef, {
        ...user,
        updatedAt: new Date()
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error.message))
}