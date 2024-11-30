export const useUploadProfilePicture = async (file: File | undefined | null): Promise<Either<string, string>> => {
    if (file == null || file == undefined) {
        return Promise.reject(makeLeft("File tidak terdeteksi"))
    }
    return uploadMedia(file, "profile", "image")
}