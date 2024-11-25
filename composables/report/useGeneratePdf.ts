import jsPDF from 'jspdf'
import autoTable, { type RowInput } from 'jspdf-autotable'

export const useGeneratePdf = (data: ReportDetail[]) => {
    const doc = new jsPDF('landscape')
    const tableData: RowInput[] = data.map((item) => {
        return [
            item.report.title,
            item.report.category,
            item.report.status,
            item.report.address,
            `${item.report.lat}, ${item.report.long}`,
            item.office.nama,
            `${item.office.lat}, ${item.office.long}`,
            item.reporter.name,
            item.reporter.email,
            item.package.title,
            item.report.createdAt,
            item.report.updatedAt
        ] as RowInput
    })

    autoTable(doc, {
        head: [[
            "Judul Laporan", 
            "Kategori", 
            "Status", 
            "Alamat TKP", 
            "Koordinat TKP (lat, long)",
            "Kantor", 
            "Koordinat Kantor (lat, long)", 
            "Nama Pelapor", 
            "Email Pelapor", 
            "Paket Bantuan", 
            "Dibuat", 
            "Terakhir Diupdate"
        ]],
        body: tableData,
      })
    
    doc.save(`${getFileName(useNow().value)}.pdf`)
}