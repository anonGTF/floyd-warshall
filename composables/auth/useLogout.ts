import { getAuth, signOut } from "firebase/auth"

export const useLogout = async (): Promise<Either<string, null>> => {
  const app = useFirebaseApp()
  const userStore = useUserStore()
  return signOut(getAuth(app))
    .then(() => {
      userStore.$reset()
      return makeRight(null)
    })
    .catch((error) => makeLeft(error.message))
}