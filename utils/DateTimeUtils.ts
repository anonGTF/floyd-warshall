export const parseToDate = ({ seconds, nanoseconds }: { seconds: number, nanoseconds: number}) => {
    if (typeof seconds !== 'number' || typeof nanoseconds !== 'number') {
        throw new Error("Invalid input: both 'seconds' and 'nanoseconds' must be numbers.");
    }
    
    const milliseconds = seconds * 1000 + nanoseconds / 1_000_000
    return new Date(milliseconds)
}

export const getFileName = (startDate: Date, endDate: Date) => {
  const formatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  return `Data Semua Laporan Tanggal ${formatter.format(startDate)} - ${formatter.format(endDate)}`
}