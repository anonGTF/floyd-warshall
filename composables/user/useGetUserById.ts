import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";

export const useGetUserById = async (id: string): Promise<Either<string, User>> => {
  const db = useFirestore()
  const user = doc(db, USER_CONSTANTS.collectionName, id)
  return getDoc(user)
  .then((document) => {
    if (!document.exists() || document.data() == undefined) {
      return makeLeft('User tidak ditemukan')
    }
    const data = document.data()
    const role = data[USER_CONSTANTS.roleAttr]
    const name = data[USER_CONSTANTS.nameAttr]
    const phoneNumber = data[USER_CONSTANTS.phoneNumberAttr]
    const profilePicture = data[USER_CONSTANTS.profilePictureAttr]
    const officeId = data[USER_CONSTANTS.officeIdAttr]
    const email = data[USER_CONSTANTS.emailAttr]
    const isVerified = data[USER_CONSTANTS.isVerifiedAttr]
    const user: User = {
      id,
      role,
      name,
      email,
      phoneNumber,
      profilePicture,
      officeId,
      isVerified
    }
    return makeRight(user)
  })
  .catch((error) => makeLeft(error.message))
}