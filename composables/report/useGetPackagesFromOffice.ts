import { collection, type DocumentData } from "firebase/firestore"
import { firestoreDefaultConverter } from "vuefire"

export const useGetPackagesFromOffice = (officeId: string): Ref<Package[]> => {
    const db = useFirestore()
    const collectionRef = collection(db, KANTOR_CONSTANTS.collectionName, officeId, PACKAGE_CONSTANTS.collectionName)
    const packages = useCollection(collectionRef.withConverter<Package, DocumentData>({
        fromFirestore: (snapshot) => {
            const data = snapshot.data()
            const packageData: Package = {
                id: snapshot.id,
                title: data[REPORT_CONSTANTS.titleAttr],
                stock: data[PACKAGE_CONSTANTS.stockAttr],
                createdAt: data[REPORT_CONSTANTS.createdAtAttr],
                updatedAt: data[REPORT_CONSTANTS.updatedAtAttr]
            }
            return packageData
        },
        toFirestore: firestoreDefaultConverter.toFirestore
    }))
    return packages
}