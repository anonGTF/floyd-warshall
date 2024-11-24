import { doc, setDoc } from "firebase/firestore"

export const useAddUser = async (
    id: string, 
    name: string, 
    role: string, 
    email: string,
    isVerified: boolean
): Promise<Either<string, null>> => {
    const db = useFirestore()
    const docRef = doc(db, USER_CONSTANTS.collectionName, id)
    return setDoc(docRef, {
        name,
        role,
        email,
        isVerified,
        phoneNumber: "",
        profilePicture: ""
    })
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error))
}