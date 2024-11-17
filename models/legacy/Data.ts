import type { LatLngExpression } from "leaflet"

export type Data = {
    nodeTerdekat: string[]
    kantorTerdekat: Kantor
    distance: number
    coordinates: LatLngExpression[]
    duration: number
    nodes: Edge<String>[]
  }

export type Edge<T> = {
    from: T
    to: T
    weight: number
}

export type GetRouteResponse = {
    coordinates: LatLngExpression[] | null
    nodeTerdekat: string[]
    nodes: Edge<string>[]
    kantorTerdekat: Kantor
    distance: number
    totalDuration: number 
}

export type Waypoint = {
    kota: string
    lat: number
    lon: number
}