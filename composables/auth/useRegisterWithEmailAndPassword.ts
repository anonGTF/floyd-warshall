import { createUserWithEmailAndPassword, getAuth, type UserCredential } from "firebase/auth";

export const useRegisterWithEmailAndPassword = async (email: string, password: string): Promise<Either<string, UserCredential>> => {
    const auth = getAuth()
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCred) => makeRight(userCred))
        .catch((error) => {
            if (error.code === 'auth/email-already-exists') {
                return makeLeft('Email sudah memiliki akun')
            } else {
                return makeLeft(error.message)
            }
        })
}