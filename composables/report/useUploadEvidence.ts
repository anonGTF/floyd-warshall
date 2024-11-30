export const useUploadEvidence = async (file: File | null | undefined): Promise<Either<string, string>> => {
    if (file == null || file == undefined) {
        return Promise.reject(makeLeft("File tidak terdeteksi"))
    }

    const mediaType = (file.type.startsWith("video/")) ? "video" : "image"

    return uploadMedia(file, "evidence", mediaType)
}