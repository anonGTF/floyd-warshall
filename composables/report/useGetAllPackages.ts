import { collection, type DocumentData } from "firebase/firestore"
import { firestoreDefaultConverter } from "vuefire"
import type { Package } from "~/models/report/Package"

export const useGetAllPackages = (): Ref<Package[]>  => {
    const db = useFirestore()
    const collectionRef = collection(db, PACKAGE_CONSTANTS.collectionName)
    const packages = useCollection(collectionRef.withConverter<Package, DocumentData>({
        fromFirestore: (snapshot) => {
            const data = snapshot.data()
            const packagedata: Package = {
                id: snapshot.id,
                title: data[REPORT_CONSTANTS.titleAttr],
                stock: data[PACKAGE_CONSTANTS.stockAttr],
                createdAt: data[REPORT_CONSTANTS.createdAtAttr],
                updatedAt: data[REPORT_CONSTANTS.updatedAtAttr]
            }
            return packagedata
        },
        toFirestore: firestoreDefaultConverter.toFirestore
    }))
    return packages
}