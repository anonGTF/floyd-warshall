import { doc, getDoc } from "firebase/firestore";
import type { ReportDetail } from "~/models/report/ReportDetail";
import type { Report } from "~/models/report/Report";

export const useGetReportAndAssociatedById = async (id: string): Promise<Either<string, ReportDetail>> => {
    try {
        const db = useFirestore()
        const reportRef = doc(db, REPORT_CONSTANTS.collectionName, id)
        const reportDoc = await getDoc(reportRef)

        if (!reportDoc.exists() || reportDoc.data() == undefined) {
            throw Error('Laporan tidak ditemukan')
        }

        const reportData = reportDoc.data()
        const report = {
            id: reportDoc.id,
            title: reportData[REPORT_CONSTANTS.titleAttr],
            lat: reportData[REPORT_CONSTANTS.latAttr],
            long: reportData[REPORT_CONSTANTS.longAttr],
            coordinates: jsonToLatLng(reportData[REPORT_CONSTANTS.coordinatesAttr]),
            status: reportData[REPORT_CONSTANTS.statusAttr],
            packageId: reportData[REPORT_CONSTANTS.packageIdAttr],
            reporterId: reportData[REPORT_CONSTANTS.reporterIdAttr],
            officeId: reportData[REPORT_CONSTANTS.officeIdAttr],
            address: reportData[REPORT_CONSTANTS.addressAttr],
            category:reportData[REPORT_CONSTANTS.categoryAttr],
            description: reportData[REPORT_CONSTANTS.descriptionAttr],
            evidence: reportData[REPORT_CONSTANTS.evidenceAttr] ?? null,
            createdAt: reportData[REPORT_CONSTANTS.createdAtAttr],
            updatedAt: reportData[REPORT_CONSTANTS.updatedAtAttr]
        } satisfies Report

        const packageRef = doc(db, PACKAGE_CONSTANTS.collectionName, report.packageId)
        const officeRef = doc(db, KANTOR_CONSTANTS.collectionName, report.officeId)
        const reporterRef = doc(db, USER_CONSTANTS.collectionName, report.reporterId)

        const results = await Promise.all([
            getDoc(packageRef), 
            getDoc(officeRef), 
            getDoc(reporterRef)]
        )

        if (results.some((result) => !result.exists() || result.data() === undefined)) {
            throw Error("Detail laporan tidak ditemukan")
        }

        const [packageDoc, officeDoc, reporterDoc] = results

        const packageData = packageDoc.data()!
        const packageDetail = {
            id: packageDoc.id,
            title: packageData[PACKAGE_CONSTANTS.titleAttr],
            stock: packageData[PACKAGE_CONSTANTS.stockAttr]
        } satisfies Package

        const officeData = officeDoc.data()!
        const office = {
            id: officeDoc.id,
            nama: officeData[KANTOR_CONSTANTS.namaAttr],
            alamat: officeData[KANTOR_CONSTANTS.alamatAttr],
            lat: officeData[KANTOR_CONSTANTS.latAttr],
            long: officeData[KANTOR_CONSTANTS.longAttr],
            jumlahPersonel: officeData[KANTOR_CONSTANTS.jumlahPersonelAttr],
            jumlahPeralatan: officeData[KANTOR_CONSTANTS.jumlahPeralatanAttr],
            createdAt: officeData[KANTOR_CONSTANTS.createdAtAttr],
            updatedAt: officeData[KANTOR_CONSTANTS.updatedAtAttr]
        } satisfies Kantor

        const reporterData = reporterDoc.data()!
        const reporter = {
            id,
            role: reporterData[USER_CONSTANTS.roleAttr],
            name: reporterData[USER_CONSTANTS.nameAttr],
            email: reporterData[USER_CONSTANTS.emailAttr],
            phoneNumber: reporterData[USER_CONSTANTS.phoneNumberAttr],
            profilePicture: reportData[USER_CONSTANTS.profilePictureAttr],
            officeId: reportData[USER_CONSTANTS.officeIdAttr],
            isVerified: reporterData[USER_CONSTANTS.isVerifiedAttr]
        } satisfies User

        return Promise.resolve(makeRight({
            report,
            office,
            reporter,
            package: packageDetail
        } satisfies ReportDetail))
    } catch (error) {
        return Promise.reject(makeLeft(error))
    }
}