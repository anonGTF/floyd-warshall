import { LatLng, type LatLngExpression } from "leaflet";

export const latLngToJsonString = (list: LatLngExpression[]) => {
    const adjusted = (list.length > 0 && list[0] instanceof LatLng) ? 
        list.map((data) => [(data as LatLng).lat, (data as LatLng).lng]) :
        list
    return JSON.stringify(adjusted)
}

export const jsonToLatLng = (json: string): LatLngExpression[] => {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.every(subArray => 
        Array.isArray(subArray) && subArray.every(item => typeof item === "number")
    )) {
        return parsed.map((data) => new LatLng(data[0], data[1]))
    }
    throw new Error("Invalid data: Not a nested array of numbers")
}