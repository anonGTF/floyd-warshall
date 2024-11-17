import { getAuth, signInWithEmailAndPassword, type UserCredential } from "firebase/auth"

export const useLoginWithEmailAndPassword = async (email: string, password: string): Promise<Either<string, UserCredential>> => {
  const auth = getAuth()
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCred) => makeRight(userCred))
    .catch((error) => {
      if (error.code === 'auth/invalid-credential') {
        return makeLeft('Email atau password yang Anda masukkan salah')
      } else {
        return makeLeft(error.message)
      }
    })
}