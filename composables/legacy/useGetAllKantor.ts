import { collection, type DocumentData } from "firebase/firestore"
import { firestoreDefaultConverter } from "vuefire"
import type { Kantor } from "~/models/legacy/Kantor"

export const useGetAllKantor = (): Ref<Kantor[]> => {
    const db = useFirestore()
    const collectionRef = collection(db, KANTOR_CONSTANTS.collectionName)
    const kantorList = useCollection(collectionRef.withConverter<Kantor, DocumentData>({
        fromFirestore: (snapshot) => {
            const data = snapshot.data()
            const kantor: Kantor = {
                id: snapshot.id,
                nama: data[KANTOR_CONSTANTS.namaAttr],
                alamat: data[KANTOR_CONSTANTS.alamatAttr],
                lat: data[KANTOR_CONSTANTS.latAttr],
                long: data[KANTOR_CONSTANTS.longAttr],
                jumlahPersonel: data[KANTOR_CONSTANTS.jumlahPersonelAttr],
                jumlahPeralatan: data[KANTOR_CONSTANTS.jumlahPeralatanAttr],
                createdAt: data[KANTOR_CONSTANTS.createdAtAttr],
                updatedAt: data[KANTOR_CONSTANTS.updatedAtAttr]
            }
            return kantor
        },
        toFirestore: firestoreDefaultConverter.toFirestore
    }))
    return kantorList
}