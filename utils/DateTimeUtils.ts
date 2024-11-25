export const parseToDate = ({ seconds, nanoseconds }: { seconds: number, nanoseconds: number}) => {
    if (typeof seconds !== 'number' || typeof nanoseconds !== 'number') {
        throw new Error("Invalid input: both 'seconds' and 'nanoseconds' must be numbers.");
    }
    
    const milliseconds = seconds * 1000 + nanoseconds / 1_000_000
    return new Date(milliseconds)
}

export const getFileName = (currentDate: Date) => {
  const year = currentDate.getFullYear()
  const month = currentDate.toLocaleString('id-ID', { month: 'long' })
  const startDate = `1 ${month} ${year}`
  const endDate = `${new Date(year, currentDate.getMonth() + 1, 0).getDate()} ${month} ${year}`
  return `Data Semua Laporan Tanggal ${startDate} - ${endDate}`
}

export const getTitleName = (currentDate: Date) => {
  const year = currentDate.getFullYear()
  const month = currentDate.toLocaleString('id-ID', { month: 'long' })
  const endDate = `${new Date(year, currentDate.getMonth() + 1, 0).getDate()} ${month} ${year}`
  const endDateFormatted = useDateFormat(endDate, "DD MMMM YYYY", { locales: 'id-ID' })
  return `Data Laporan 1 Bulan Terakhir 1 - ${endDateFormatted.value}`
}