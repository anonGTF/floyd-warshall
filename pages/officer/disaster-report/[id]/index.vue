<template>
    <div class="bg-white rounded-2xl m-4 lg:m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Detail Laporan Bencana</Text>
        <Spacer height="h-4"/>
        <InlineAlert :alert-message="alertErrorMessage"/>
        <Spacer height="h-8"/>
        <ReadOnlyTextField
            :text="reportDetail?.reporter.name"
            label="Nama Pelapor"
        />
        <Spacer height="h-4"/>
        <ReadOnlyTextField
            :text="reportDetail?.reporter.phoneNumber"
            label="No HP Pelapor"
        />
        <Spacer height="h-4"/>
        <ReadOnlyTextField
            :text="reportDetail?.report.title"
            label="Judul Laporan"
        />
        <Spacer height="h-4"/>
        <ReadOnlyTextArea
            :text="reportDetail?.report.description"
            label="Deskripsi Kejadian"
        />
        <Spacer height="h-4"/>
        <ReadOnlyTextField
            :text="reportDetail?.report.category"
            label="Kategori Bencana"
        />
        <Spacer height="h-4"/>
        <ReadOnlyTextField
            :text="reportDetail?.package.title"
            label="Kebutuhan Bantuan"
        />
        <template v-if="reportDetail?.report.evidence != null">
            <Spacer height="h-4"/>
            <Text>Foto/Video Terkait</Text>
            <Spacer height="h-2"/>
            <a :href="reportDetail?.report.evidence">Link media</a>
        </template>
        <Spacer height="h-4"/>
        <div class="flex flex-row gap-2 items-center">
            <ReadOnlyTextField
                :text="reportDetail?.office.alamat"
                label="Kantor"
                class="flex-1"
            />
            <Icon 
                name="mdi:swap-horizontal"
                size="2.5rem"
                class="mt-3 flex-none"
            />
            <ReadOnlyTextField
                :text="reportDetail?.report.address"
                label="TKP"
                class="flex-1"
            />
        </div>
        <Spacer height="h-4"/>
        <div v-if="reportDetail != null" class="min-h-[50vh] flex">
            <div class="grow">
                <LMap
                    ref="map"
                    :zoom="13"
                    :center="[reportDetail.report.lat, reportDetail.report.long]"
                    :use-global-leaflet="false"
                >
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                        layer-type="base"
                        name="OpenStreetMap"
                    />

                    <LPolyline
                        ref="polyline"
                        :lat-lngs="reportDetail.report.coordinates"
                        @ready="onPolygonReady"
                    />

                    <LMarker
                        :lat-lng="[reportDetail.report.lat, reportDetail.report.long]"
                    >
                        <LPopup>TKP Kejadian</LPopup>
                    </LMarker>
                    <LMarker
                        :lat-lng="[reportDetail.office.lat, reportDetail.office.long]"
                    >
                        <LPopup>Kantor Terdekat : {{ reportDetail.office.nama }}</LPopup>
                    </LMarker>
                </LMap>
            </div>
        </div>
        <Spacer height="h-4"/>
        <DropdownSelector
            v-model="selectedPersonilIndex"
            label="Pilih Personil*"
            :error-message="personilErrorMessage"
            :options="personilDropdownOptions"
        />
        <Spacer height="h-6"/>
        <Button
            full-width
            :loading="isLoading"
            @click="acceptReport"
        >
            Kerjakan Laporan
        </Button>
    </div>
</template>

<script setup lang="ts">
    import type { DropdownOption } from '~/components/attr/DropdownAttr';
    import { Typography } from '~/components/attr/TextAttr';
    import { useGetReportAndAssociatedById } from '~/composables/report/useGetReportAndAssociatedById';
    import type { ReportDetail } from '~/models/report/ReportDetail';
    import type { UpdateReport } from '~/models/report/UpdateReport';
    
    definePageMeta({
        layout: "officer"
    })

    const route = useRoute()

    const reportDetail = ref<ReportDetail | null>(null)
    const alertErrorMessage = ref("")
    const isLoading = ref(false)
    const map = ref()
    const polyline = ref()
    const personilOptions = [
        "Tim Eagle (Naruto, Sasuke, Sakura, Kakashi)",
        "Tim Tiger (Shikamaru, Chouji, Ino, Asuma)",
        "Tim Shark (Neji, Rock Lee, Tenten, Maito Guy)",
        "Tim Turtle (Kiba, Shino, Hinata, Kurenai)",
        "Tim Cobra (Jiraiya, Orochimaru, Tsunade, Hiruzen)"
    ]
    const personilDropdownOptions = computed(() => personilOptions.map((personil) => ({
        label: personil,
        data: personil
    } satisfies DropdownOption<string>)))
    const personilErrorMessage = ref("")
    const selectedPersonilIndex = ref(-1)
    const selectedPersonil = computed(() => personilOptions[selectedPersonilIndex.value])

    onMounted(async () => {
        const result = await useGetReportAndAssociatedById(route.params.id as string)
        if (isLeft(result)) {
            alertErrorMessage.value = unwrapEither(result)
        } else {
            reportDetail.value = unwrapEither(result)
        }
    })

    const onPolygonReady = () => {
        map.value.leafletObject.fitBounds(polyline.value.leafletObject.getBounds())
    }

    const acceptReport = async () => {
        if (reportDetail.value?.report == null) {
            alertErrorMessage.value = "Detail laporan tidak ada"
            return
        }

        if (selectedPersonilIndex.value == -1) {
            personilErrorMessage.value = "Harus pilih personil yang akan mengerjakan laporan"
            return
        }

        isLoading.value = true
        const result = await useEditReport({
            ...reportDetail.value.report,
            status: "RECEIVED-BY-OFFICER"
        })

        if (isLeft(result)) {
            alertErrorMessage.value = unwrapEither(result)
            isLoading.value = false
            return
        }

        const updateResult = await useAddUpdateReport(reportDetail.value.report.id, {
            id: "",
            assignmentReceivedData: {
                personil: selectedPersonil.value,
                packageBrought: reportDetail.value.package.title
            }
        } satisfies UpdateReport)

        if (isLeft(updateResult)) {
            alertErrorMessage.value = unwrapEither(updateResult)
            isLoading.value = false
            return
        } else {
            navigateTo("/officer/disaster-report")
        }
    }
</script>