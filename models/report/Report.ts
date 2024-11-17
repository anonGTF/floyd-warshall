import type { LatLngExpression } from "leaflet"

export type Report = {
    id: string,
    title: string,
    lat: number,
    long: number,
    coordinates: LatLngExpression[],
    status: string,
    packageId: string,
    reporterId: string,
    officeId: string,
    address?: string,
    category?: string,
    description?: string,
    evidence?: string,
    createdAt?: Date,
    updatedAt?: Date
}