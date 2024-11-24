import { getDownloadURL, getStorage, uploadBytes, ref, type UploadResult } from "firebase/storage"

/**
 * @deprecated The method use Firebase Storage which not working right now. needs to migrate to Cloudinary
 */
export const useUploadProfilePicture = async (file: File | undefined | null): Promise<Either<string, string>> => {
    if (file == null || file == undefined) {
        return Promise.reject(makeLeft("File tidak terdeteksi"))
    }

    const storage = getStorage()
    const fileRef = ref(storage, file.name)
    return uploadBytes(fileRef, file)
    .then(async (result: UploadResult) => {
        const downloadUrl = await getDownloadURL(result.ref)
        return makeRight(downloadUrl)
    })
    .catch((error) => makeLeft(error))
}