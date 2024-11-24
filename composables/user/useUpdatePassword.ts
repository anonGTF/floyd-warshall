import { getAuth, updatePassword } from "firebase/auth"

export const useUpdatePassword = async (newPassword: string): Promise<Either<string, null>> => {
    const auth = getAuth()

    if (auth.currentUser == null) {
        return makeLeft("User tidak ada")
    }

    return updatePassword(auth.currentUser, newPassword)
    .then(() => makeRight(null))
    .catch((error) => makeLeft(error))
}