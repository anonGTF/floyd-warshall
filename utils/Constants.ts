import type { Report } from "~/models/report/Report"

export const defaultKantor: Kantor = {
    id: "",
    lat: 0,
    long: 0,
    nama: "",
    alamat: "",
    jumlahPersonel: 0,
    jumlahPeralatan: 0
}

export const defaultTkp: TKP = {
    id: "",
    judul: "",
    deskripsi: "",
    alamat: "",
    lat: 0,
    long: 0
}

export const defaultReport: Report = {
  id: "",
  title: "",
  lat: 0,
  long: 0,
  coordinates: [],
  status: "TODO",
  packageId: "",
  reporterId: "",
  officeId: ""
}

export const Kota = {
    surabaya: 'SURABAYA',
    trenggalek: 'TRENGGALEK',
    jember: 'JEMBER',
  
    malang: 'MALANG',
    madiun: 'MADIUN',
    kediri: 'KEDIRI',
  
    tanggul: 'TANGGUL',
    balung: 'BALUNG',
    karangsono: 'KARANGSONO',
  
    nganjuk: 'NGANJUK',
    semboro: 'SEMBORO',
    sumberbatu: 'SUMBERBATU',
    mojokerto: 'MOJOKERTO',
    rambipoedji: 'RAMBIPOEDJI',
  
    panggak: 'PANGGAK',
    sidorejo: 'SIDOREJO',
    jatiroro: 'JATIRORO',
    kasremau: 'KASREMAU',
    watualang: 'WATUALANG',
    pandem_mangunharjo: 'PANDEM MANGUHARJO',
    krajan_utara: 'KRAJAN UTARA',
    klojen: 'KLOJEN',
    kendal_payak: 'KENDAL_PAYAK',
    wonorejo: 'WONOJERO',
    bumiayu: 'BUMIAYU',
    jatiroto: 'JATIROTO',
    sarimulyo: 'SARIMULYO',
    keting: 'KETING',
    yosowilangun: 'YOSOWILANGUN',
    sumberbaru: 'SUMBERBARU'
}

export const KotaNodes: Waypoint[] = [
    { kota: Kota.malang, lat: -7.968762, lon: 112.632625 },
    { kota: Kota.madiun, lat: -7.630046, lon: 111.51669 },
    { kota: Kota.kediri, lat: -7.826935, lon: 112.010464 },
    { kota: Kota.tanggul, lat: -8.163198, lon: 113.45239 },
    { kota: Kota.balung, lat: -8.275024, lon: 113.536316 },
    { kota: Kota.karangsono, lat: -8.218729, lon: 113.517022 },
    { kota: Kota.nganjuk, lat: -7.589845, lon: 111.940528 },
    { kota: Kota.semboro, lat: -8.183529, lon: 113.449022 },
    { kota: Kota.mojokerto, lat: -7.423869, lon: 112.451923 },
    { kota: Kota.rambipoedji, lat: -8.200983, lon: 113.621774 }
]

export const dummyWaypoints: Waypoint[] = [
  // lokasi kantor
  {
    kota: Kota.surabaya,
    lat: -7.370944,
    lon: 112.77825
  },
  { kota: Kota.trenggalek, lat: -8.0875, lon: 111.710806 },

  { kota: Kota.jember, lat: -8.127806, lon: 113.743972 },

  // lokasi pusat kota
  { kota: Kota.malang, lat: -7.968762, lon: 112.632625 },
  { kota: Kota.madiun, lat: -7.630046, lon: 111.51669 },
  { kota: Kota.kediri, lat: -7.826935, lon: 112.010464 },
  { kota: Kota.tanggul, lat: -8.163198, lon: 113.45239 },
  { kota: Kota.balung, lat: -8.275024, lon: 113.536316 },
  { kota: Kota.karangsono, lat: -8.218729, lon: 113.517022 },
  { kota: Kota.nganjuk, lat: -7.589845, lon: 111.940528 },
  { kota: Kota.semboro, lat: -8.183529, lon: 113.449022 },
  { kota: Kota.mojokerto, lat: -7.423869, lon: 112.451923 },
  { kota: Kota.rambipoedji, lat: -8.200983, lon: 113.621774 },

  // lokasi tkp
  { kota: Kota.panggak, lat: -8.194667, lon: 112.5591 },
  { kota: Kota.sidorejo, lat: -7.543233, lon: 111.306364 },
  { kota: Kota.jatiroro, lat: -8.127361, lon: 113.325333 },
  { kota: Kota.kasremau, lat: -7.411556, lon: 111.497972 },
  { kota: Kota.watualang, lat: -7.38865, lon: 111.408967 },
  { kota: Kota.pandem_mangunharjo, lat: -7.468103, lon: 111.469331 },
  { kota: Kota.krajan_utara, lat: -7.386611, lon: 111.413528 },
  { kota: Kota.klojen, lat: -7.972803, lon: 112.630556 },
  { kota: Kota.kendal_payak, lat: -8.034044, lon: 112.629289 },
  { kota: Kota.wonorejo, lat: -8.215583, lon: 112.647028 },
  { kota: Kota.bumiayu, lat: -8.030194, lon: 112.629444 },
  { kota: Kota.sarimulyo, lat: -8.198584, lon: 113.353941 },
  { kota: Kota.keting, lat: -8.246048, lon: 113.31562 },
  { kota: Kota.yosowilangun, lat: -8.303461, lon: 113.302644 },
  { kota: Kota.sumberbaru, lat: -8.156406, lon: 113.379669 }
]