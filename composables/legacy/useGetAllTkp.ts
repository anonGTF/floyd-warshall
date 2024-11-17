import { collection, type DocumentData } from "firebase/firestore"
import { firestoreDefaultConverter } from "vuefire"
import type { TKP } from "~/models/legacy/Tkp"

export const useGetAllTkp = (): Ref<TKP[]> => {
    const db = useFirestore()
    const collectionRef = collection(db, TKP_CONSTANTS.collectionName)
    const tkpList = useCollection(collectionRef.withConverter<TKP, DocumentData>({
        fromFirestore: (snapshot) => {
            const data = snapshot.data()
            const tkp: TKP = {
                id: snapshot.id,
                judul: data[TKP_CONSTANTS.judulAttr],
                deskripsi: data[TKP_CONSTANTS.deskripsiAttr],
                alamat: data[TKP_CONSTANTS.alamatAttr],
                lat: data[TKP_CONSTANTS.latAttr],
                long: data[TKP_CONSTANTS.longAttr],
                createdAt: data[TKP_CONSTANTS.createdAtAttr],
                updatedAt: data[TKP_CONSTANTS.updatedAtAttr]
            }
            return tkp
        },
        toFirestore: firestoreDefaultConverter.toFirestore
    }))
    return tkpList
}