import { collection, query, where, type DocumentData } from "firebase/firestore"
import { firestoreDefaultConverter } from "vuefire"

export const useGetAllUsersByStatus = (isVerified: boolean): Ref<User[]> => {
    const db = useFirestore()
    const collectionRef = collection(db, USER_CONSTANTS.collectionName)
    const queryRef = query(collectionRef, where(USER_CONSTANTS.isVerifiedAttr, "==", isVerified))
    const users = useCollection(queryRef.withConverter<User, DocumentData>({
        fromFirestore: (snapshot) => {
            const data = snapshot.data()
            const role = data[USER_CONSTANTS.roleAttr]
            const name = data[USER_CONSTANTS.nameAttr]
            const phoneNumber = data[USER_CONSTANTS.phoneNumberAttr]
            const profilePicture = data[USER_CONSTANTS.profilePictureAttr]
            const officeId = data[USER_CONSTANTS.officeIdAttr]
            const email = data[USER_CONSTANTS.emailAttr]
            const isVerified = data[USER_CONSTANTS.isVerifiedAttr]
            const user: User = {
                id: snapshot.id,
                role,
                name,
                email,
                phoneNumber,
                profilePicture,
                officeId,
                isVerified
              }
            return user
        },
        toFirestore: firestoreDefaultConverter.toFirestore
    }))
    return users
}