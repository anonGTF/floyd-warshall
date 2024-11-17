import type { LatLngExpression } from "leaflet"
import type { Report } from "./Report"

export type CalculationResult = {
    id: string,
    nearestNode: string[]
    nearestOffice: Kantor
    distance: number
    coordinates: LatLngExpression[]
    duration: number
    nodes: Edge<string>[],
    isShortest: boolean,
    parentId?: string
}

export type Edge<T> = {
    from: T
    to: T
    weight: number
}

export type Waypoint = {
    kota: string
    lat: number
    lon: number
}

export type ReportWithCalculation = {
    report: Report,
    results: CalculationResult[]
}