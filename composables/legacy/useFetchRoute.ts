import type { LatLngExpression } from "leaflet"

export const useFetchRoute = async (
    waypoints: [number, number][]
): Promise<{
    coordinates: LatLngExpression[] | null
    distance: number | null
} | null> => {
    try {
        // Constructing the waypoints for the OSRM API call
        const waypointsStr = waypoints
        .map(([lat, lng]) => `${lng},${lat}`)
        .join(';')
  
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${waypointsStr}?overview=full&geometries=geojson`
        )
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const data = await response.json()
  
        if (data.routes && data.routes.length > 0) {
            // Extracting the route geometry (array of coordinates)
            const route = data.routes[0].geometry.coordinates
    
            // Transforming route coordinates to Leaflet's [lat, lng] format
            const coordinates: LatLngExpression[] = route.map(
            (coord: [number, number]) => [coord[1], coord[0]]
            )
    
            // Extracting the distance of the route in meters
            const distance = data.routes[0].distance // distance is returned in meters
    
            return { coordinates, distance }
        }
    } catch (error) {
        console.error('Error fetching route:', error)
    }

    return null
}