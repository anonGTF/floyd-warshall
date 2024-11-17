import haversine from 'haversine-distance'
import type { GetRouteResponse } from '~/models/legacy/Data'
import { FloydWarshall } from '~/models/legacy/FloydWarshall'

export const useGetRoute = async (
    kantorList: Kantor[],
    destinationTKP: TKP,
    node: number
): Promise<Either<string, GetRouteResponse | null>> => {
    const startTime = performance.now()

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))
  
    const processEdges = async (node: number) => {
      for (let i = 0; i < node; i++) {
        console.log('Delay', i)
        await delay(400)
      }
    }
  
    await processEdges(node)
    console.log('RUN NODE => ', node)
    let kantorTerdekat: Kantor | null = null
    let pathTerdekat: string[] = []
    let shortestDistance = Infinity
    let totalDuration = 0 // Initialize total duration
    let selectedNodes: Edge<string>[] = []
  
    for (const kantor of kantorList) {
      const nodes = generateNodesForFloydWarshall(kantor, destinationTKP, node)
  
      console.log('NODE => ', nodes)
  
      const { path, distance } = calculateFloydWarshall({
        from: kantor?.id ?? '',
        to: destinationTKP?.id ?? '',
        node: nodes
      })
  
      console.log(`${kantor.nama} => Distance: ${distance}`)
  
      if (distance < shortestDistance) {
        shortestDistance = distance
        kantorTerdekat = kantor
        pathTerdekat = path
        selectedNodes = nodes
      }
    }
    console.log('KANTOR TERDEKAT => ', kantorTerdekat)
    console.log('NODE => ', pathTerdekat)
  
    if (!kantorTerdekat) {
      throw new Error(`Kantor terdekat tidak ditemukan`)
    }
  
    // Collect waypoints only for the nearest office's path
    const waypoints: Waypoint[] = []
  
    let newPathTerdekat: string[] = []

    pathTerdekat.forEach((city) => {
        if (city == kantorTerdekat.id) {
            waypoints.push({
                kota: kantorTerdekat.nama,
                lat: kantorTerdekat.lat,
                lon: kantorTerdekat.long
            })
            newPathTerdekat = [...newPathTerdekat, kantorTerdekat.nama]

        } else if (city == destinationTKP.id) {
            waypoints.push({
                kota: destinationTKP.judul,
                lat: destinationTKP.lat,
                lon: destinationTKP.long
            })
            newPathTerdekat = [...newPathTerdekat, destinationTKP.judul]

        } else {
            const location = dummyWaypoints.find((e) => e.kota === city)
            if (location) {
                newPathTerdekat = [...newPathTerdekat, city]
                waypoints.push(location)
            }
        }
    })
  
    selectedNodes.forEach((city, i) => {
        if (city.from == kantorTerdekat.id) {
            selectedNodes[i].from = kantorTerdekat.nama
        } else if (city.to == destinationTKP.id) {
            selectedNodes[i].from = destinationTKP.judul
        }
    })
  
    try {
        const response = await useFetchRoute(waypoints.map((e) => [e.lat, e.lon]))
    
        const endTime = performance.now()
        totalDuration = endTime - startTime
    
        const result = {
            kantorTerdekat: kantorTerdekat,
            nodeTerdekat: newPathTerdekat,
            coordinates: response?.coordinates ?? [],
            distance: response?.distance ?? 0,
            totalDuration: totalDuration,
            nodes: selectedNodes
        } satisfies GetRouteResponse

        return makeRight(result)
    } catch (e) {
        return makeLeft('Rute terdekat tidak ditemukan')
    }
}

const generateNodesForFloydWarshall = (
    startKantor: Kantor,
    destinationTKP: TKP,
    node: number
): Edge<string>[] => {
    const nearestCitiesEdges = getNearestKantorToTKP(
        startKantor,
        destinationTKP,
        node
    )
  
    const allEdges: Edge<string>[] = []
  
    nearestCitiesEdges.forEach(({ to }) => {
        const distance = haversine(
            { 
                latitude: startKantor.lat, 
                longitude: startKantor.long 
            },
            {
                latitude: KotaNodes.find((city) => city.kota === to)?.lat ?? 0,
                longitude: KotaNodes.find((city) => city.kota === to)?.lon ?? 0
            }
        )
        allEdges.push({ from: startKantor.id ?? '', to, weight: distance })
    })
  
    // Include edges to destinationTKP from nearest cities
    nearestCitiesEdges.forEach(({ to }) => {
        const distance = haversine(
            {
                latitude: KotaNodes.find((city) => city.kota === to)?.lat ?? 0,
                longitude: KotaNodes.find((city) => city.kota === to)?.lon ?? 0
            },
            { 
                latitude: destinationTKP.lat,
                longitude: destinationTKP.long 
            }
        )
        allEdges.push({ from: to, to: destinationTKP.id ?? '', weight: distance })
    })
  
    // Include edges between nearest cities
    for (let i = 0; i < nearestCitiesEdges.length; i++) {
        for (let j = i + 1; j < nearestCitiesEdges.length; j++) {
            const fromCity = nearestCitiesEdges[i].to
            const toCity = nearestCitiesEdges[j].to
    
            const distance = haversine(
                {
                    latitude: KotaNodes.find((city) => city.kota === fromCity)?.lat ?? 0,
                    longitude: KotaNodes.find((city) => city.kota === fromCity)?.lon ?? 0
                },
                {
                    latitude: KotaNodes.find((city) => city.kota === toCity)?.lat ?? 0,
                    longitude: KotaNodes.find((city) => city.kota === toCity)?.lon ?? 0
                }
            )
    
            allEdges.push({ from: fromCity, to: toCity, weight: distance })
        }
    }
  
    return allEdges
}

const getNearestKantorToTKP = (
    startKantor: Kantor,
    destinationTKP: TKP,
    maxCity: number
): Edge<string>[] => {
    const distances: { city: string; distance: number; source: string }[] = []
  
    KotaNodes.forEach((city) => {
        const distanceFromKantor = haversine(
            { latitude: startKantor.lat, longitude: startKantor.long },
            { latitude: city.lat, longitude: city.lon }
        )
    
        const distanceFromTKP = haversine(
            { latitude: destinationTKP.lat, longitude: destinationTKP.long },
            { latitude: city.lat, longitude: city.lon }
        )
    
        distances.push({
            city: city.kota,
            distance: distanceFromKantor,
            source: 'kantor'
        })
        distances.push({
            city: city.kota,
            distance: distanceFromTKP,
            source: 'tkp'
        })
    })
  
    const sortedDistances = distances.sort((a, b) => a.distance - b.distance)
  
    const nearestCities: Edge<string>[] = []
    const citySet = new Set<string>()
  
    for (const { city, distance, source } of sortedDistances) {
        if (nearestCities.length >= maxCity) break
        if (!citySet.has(city)) {
            citySet.add(city)
            nearestCities.push({
            from: source === 'kantor' ? startKantor.nama : destinationTKP.judul,
            to: city,
            weight: distance
            })
        }
    }
  
    return nearestCities
}

const calculateFloydWarshall = ({
    node,
    from,
    to,
}: {
    node: Edge<string>[];
    from: string;
    to: string;
}) => {
    const graph = new FloydWarshall(node); // undirected edges!!!
  
    const path = graph.getShortestPath(from, to);
    const distance = graph.getShortestDistance(from, to);
  
    console.log(`${from} => ${to}`);
    console.log(`Jalur Tercepat => ${path}`);
    console.log(`Dengan Jarak => ${distance}`);
    console.log("================");
  
    return {
        path,
        distance,
    };
};