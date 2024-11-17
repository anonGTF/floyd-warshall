import type { Package } from "./Package"
import type { Report } from "./Report"

export type ReportDetail = {
    report: Report,
    office: Kantor,
    package: Package,
    reporter: User
}