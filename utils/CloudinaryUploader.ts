import crypto from "crypto-js"

export const uploadMedia = async (file: File, subfolder: string, mediaType: string): Promise<Either<string, string>> => {
    const timestamp = Math.floor(Date.now() / 1000);
    const cloudName = "anongtf";
    const apiKey = "128822713224922";
    const apiSecret = "0bXMMMr82cHAl27I_giaXwnhUog";
    const folder = `floyd-warshall/${subfolder}`
    const publicId = timestamp.toString()

    const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.SHA256(paramsToSign).toString();

    const formData = new FormData()
    formData.append("file", file)
    formData.append("timestamp", timestamp.toString())
    formData.append("api_key", apiKey)
    formData.append("signature", signature)
    if (folder) formData.append("folder", folder)
    if (publicId) formData.append("public_id", publicId)
    
    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        const result = await response.json()
        return Promise.resolve(makeRight(result.url as string))
    } catch (error) {
        let errorMessage = ""
        if (error instanceof Error) {
            errorMessage = error.message
        } else if (typeof error === "string") {
            errorMessage = error
        } else {
            errorMessage = "Unknown error"
        }

        return Promise.reject(makeLeft(errorMessage))
    }
}