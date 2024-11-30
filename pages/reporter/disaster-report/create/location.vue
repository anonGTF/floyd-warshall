<template>
    <div class="bg-white rounded-2xl m-4 lg:m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Koordinat Bencana</Text>
        <Spacer height="h-4"/>
        <InlineAlert :alert-message="alertErrorMessage"/>
        <Spacer height="h-8"/>
        <TextField
            v-model="address"
            :error-message="addressErrorMessage"
            placeholder="Masukkan Alamat Kejadian"
            label="Alamat Kejadian*"
        />
        <Spacer height="h-4"/>
        <div class="flex flex-row gap-2">
            <TextField
                v-model:number="lat"
                type="number"
                :error-message="latErrorMessage"
                placeholder="Masukkan Latitude Koordinat TKP"
                label="Latitude*"
                class="flex-1"
            />
            <TextField
                v-model:number="long"
                type="number"
                :error-message="longErrorMessage"
                placeholder="Masukkan Longitude Koordinat TKP"
                label="Longitude*"
                class="flex-1"
            />
        </div>
        <Spacer height="h-4"/>
        <div class="min-h-[50vh] flex">
            <div v-if="lat == 0 || long == 0" class="grow flex justify-center items-center rounded-lg bg-gray-100">
                <Text :typography="Typography.Body1" color="text-error">Isi Latitude dan Longitude terlebih dahulu</Text>
            </div>
            <div v-else class="grow">
                <LMap
                    :zoom="13"
                    :center="[lat, long]"
                    :use-global-leaflet="false"
                >
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                        layer-type="base"
                        name="OpenStreetMap"
                    />

                    <LMarker
                        :lat-lng="[lat, long]"
                    >
                        <LPopup>TKP Kejadian</LPopup>
                    </LMarker>
                </LMap>
            </div>
        </div>
        <Spacer height="h-6"/>
        <Button
            full-width
            :loading="isLoading"
            @click="wrapWithConfirmation"
        >
            Buat Laporan
        </Button>
    </div>
</template>

<script setup lang="ts">
    import type { Report } from '~/models/report/Report'
    import { Typography } from '~/components/attr/TextAttr';
    import { ConfirmationType } from '~/components/attr/ConfirmationModalAttr';

    definePageMeta({
        layout: "reporter"
    })

    const office = useGetAllKantor()
    const address = ref("")
    const lat = ref(0)
    const long = ref(0)

    const alertErrorMessage = ref("")
    const addressErrorMessage = ref("")
    const latErrorMessage = ref("")
    const longErrorMessage = ref("")
    const isLoading = ref(false)

    const reportStore = useReportStore()
    const uiStore = useUiStore()

    const wrapWithConfirmation = () => {
        uiStore.confirm(
            "Buat Laporan",
            "Anda yakin ingin mengirim laporan?",
            ConfirmationType.INFO,
            async () => {
                uiStore.hideConfirmationModal()
                await createReport()
            },
            () => {
                uiStore.hideConfirmationModal()
            }
        )
    }

    const createReport = async () => {
        isLoading.value = true
        alertErrorMessage.value = ""
        addressErrorMessage.value = ""
        latErrorMessage.value = ""
        longErrorMessage.value = ""

        let isValid = true
        if (address.value.trim() == "") {
            addressErrorMessage.value = "Alamat harus diisi"
            isValid = false
        }
        if (lat.value == 0) {
            latErrorMessage.value = "Latitude harus diisi"
            isValid = false
        }
        if (long.value == 0) {
            longErrorMessage.value = "Longitude harus diisi"
            isValid = false
        }
        if (!isValid) {
            isLoading.value = false
            return
        }

        let reportData = {
            ...reportStore.reportData,
            lat: lat.value,
            long: long.value,
            address: address.value
        }

        if (reportData == null) {
            alertErrorMessage.value = "Terjadi kesalahan pada pembuatan data laporan"
            isLoading.value = false
            return
        }
        
        try {
            const tkp = {
                id: "",
                judul: reportData.title ?? "",
                lat: reportData.lat,
                long: reportData.long
            } satisfies TKP
            const nodeOptions = [2, 3, 4, 5]
    
            const resultsEither = await Promise.all(
                nodeOptions.map((node) => useGetRoute(office.value, tkp, node))
            )
    
            if (resultsEither.some((result) => isLeft(result))) {
                throw Error()
            }

            const results = resultsEither.map((either) => (unwrapEither(either) as GetRouteResponse))
            const shortestPath = results.reduce((min, current) => {
                return current.distance < min.distance ? current : min;
            }, results[0])

            reportData = {
                ...reportData,
                coordinates: shortestPath.coordinates ?? [],
                officeId: shortestPath.kantorTerdekat.id
            }

            const reportResult = await useAddReport(reportData as Report)
            if (isLeft(reportResult)) {
                throw Error()
            }
            const reportId = unwrapEither(reportResult)
            await Promise.all(
                results.map((result) => 
                    useAddCalculationResult(reportId, {
                        id: "",
                        nearestNode: result.nodeTerdekat,
                        nearestOffice: result.kantorTerdekat,
                        distance: result.distance,
                        coordinates: result.coordinates ?? [],
                        duration: result.totalDuration,
                        nodes: result.nodes,
                        isShortest: result.distance == shortestPath.distance
                    } satisfies CalculationResult)
                )
            )
            reportStore.$reset()
            navigateTo("/reporter/disaster-report")
        } catch(e) {
            alertErrorMessage.value = "Terjadi kesalahan pada pembuatan data laporan"
            console.error(e)
            isLoading.value = false
            return
        }
    }
</script>