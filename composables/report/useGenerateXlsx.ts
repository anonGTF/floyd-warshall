import writeXlsxFile from "write-excel-file";

export const useGenerateXlsx = async (data: ReportDetail[], startDate: Date, endDate: Date) => {
    const schema = [
        {
            column: 'Judul Laporan',
            type: String,
            value: (item: ReportDetail) => item.report.title,
            width: 30,
        },
        {
            column: 'Kategori',
            type: String,
            value: (item: ReportDetail) => item.report.category,
            width: 20,
        },
        {
            column: 'Status',
            type: String,
            value: (item: ReportDetail) => item.report.status,
            width: 15,
        },
        {
            column: 'Alamat TKP',
            type: String,
            value: (item: ReportDetail) => item.report.address,
            width: 25,
        },
        {
            column: 'Koordinat TKP (lat, long)',
            type: String,
            value: (item: ReportDetail) => (`${item.report.lat}, ${item.report.long}`),
            width: 25,
        },
        {
            column: 'Kantor',
            type: String,
            value: (item: ReportDetail) => item.office.nama,
            width: 20,
        },
        {
            column: 'Koordinat Kantor (lat, long)',
            type: String,
            value: (item: ReportDetail) => (`${item.office.lat}, ${item.office.long}`),
            width: 20,
        },
        {
            column: 'Nama Pelapor',
            type: String,
            value: (item: ReportDetail) => item.reporter.name,
            width: 20,
        },
        {
            column: 'Email Pelapor',
            type: String,
            value: (item: ReportDetail) => item.reporter.email,
            width: 30,
        },
        {
            column: 'Paket Bantuan',
            type: String,
            value: (item: ReportDetail) => item.package.title,
            width: 50,
        },
        {
            column: 'Dibuat',
            type: Date,
            format: 'dd/MM/yyyy hh:mm',
            value: (item: ReportDetail) => item.report.createdAt,
            width: 15,
        },
        {
            column: 'Terakhir Diupdate',
            type: Date,
            format: 'dd/MM/yyyy hh:mm',
            value: (item: ReportDetail) => item.report.updatedAt,
            width: 15,
        },
    ]
    
    await writeXlsxFile(data, {
        schema,
        fileName: `${getFileName(startDate, endDate)}.xlsx`,
    });
}