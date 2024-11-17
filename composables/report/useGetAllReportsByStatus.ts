import { collection, query, where, type DocumentData, type WhereFilterOp } from "firebase/firestore"
import { firestoreDefaultConverter } from "vuefire"
import type { Report } from "~/models/report/Report"

export const useGetAllReportsByStatus = (ops: WhereFilterOp, status: string[]): Ref<Report[]> => {
    const db = useFirestore()
    const collectionRef = collection(db, REPORT_CONSTANTS.collectionName)
    const queryRef = query(collectionRef, where(REPORT_CONSTANTS.statusAttr, ops, status))
    const reportList = useCollection(queryRef.withConverter<Report, DocumentData>({
        fromFirestore: (snapshot) => {
            const data = snapshot.data()
            const report: Report = {
                id: snapshot.id,
                title: data[REPORT_CONSTANTS.titleAttr],
                lat: data[REPORT_CONSTANTS.latAttr],
                long: data[REPORT_CONSTANTS.longAttr],
                status: data[REPORT_CONSTANTS.statusAttr],
                packageId: data[REPORT_CONSTANTS.packageIdAttr],
                reporterId: data[REPORT_CONSTANTS.reporterIdAttr],
                officeId: data[REPORT_CONSTANTS.officeIdAttr],
                address: data[REPORT_CONSTANTS.addressAttr],
                category: data[REPORT_CONSTANTS.categoryAttr],
                description: data[REPORT_CONSTANTS.descriptionAttr],
                evidence: data[REPORT_CONSTANTS.evidenceAttr],
                coordinates: jsonToLatLng(data[REPORT_CONSTANTS.coordinatesAttr]),
                createdAt: data[REPORT_CONSTANTS.createdAtAttr],
                updatedAt: data[REPORT_CONSTANTS.updatedAtAttr]
            }
            return report
        },
        toFirestore: firestoreDefaultConverter.toFirestore
    }))
    return reportList
}