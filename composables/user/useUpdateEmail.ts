import { getAuth, updateEmail } from "firebase/auth"

export const useUpdateEmail = async (newEmail: string): Promise<Either<string, null>> => {
    const auth = getAuth()

    if (auth.currentUser == null) {
        return makeLeft("User tidak ada")
    }

    return updateEmail(auth.currentUser, newEmail)
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error))
}