import { collectionGroup, type DocumentData } from "firebase/firestore"
import { firestoreDefaultConverter } from "vuefire"

export const useGetAllCalculations = (): Ref<CalculationResult[]>  => {
    const db = useFirestore()
    const collectionRef = collectionGroup(db, CALCULATION_RESULT_CONSTANTS.collectionName)
    const calculationResultList = useCollection(collectionRef.withConverter<CalculationResult, DocumentData>({
        fromFirestore: (snapshot) => {
            const data = snapshot.data()
            const calculationResult: CalculationResult = {
                id: snapshot.id,
                parentId: snapshot.ref.parent.parent?.id,
                nearestNode: data[CALCULATION_RESULT_CONSTANTS.nearestNodeAttr],
                nearestOffice: data[CALCULATION_RESULT_CONSTANTS.nearestOfficeAttr],
                distance: data[CALCULATION_RESULT_CONSTANTS.distanceAttr],
                coordinates: data[CALCULATION_RESULT_CONSTANTS.coordinatesAttr],
                duration: data[CALCULATION_RESULT_CONSTANTS.durationAttr],
                nodes: data[CALCULATION_RESULT_CONSTANTS.nodesAttr],
                isShortest: data[CALCULATION_RESULT_CONSTANTS.isShortestAttr]
            }
            return calculationResult
        },
        toFirestore: firestoreDefaultConverter.toFirestore
    }))
    return calculationResultList
}