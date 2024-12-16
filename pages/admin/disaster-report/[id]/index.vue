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
        <ReadOnlyTextField
            :text="reportDetail?.report.address"
            label="Detail Alamat Kejadian"
        />
        <Spacer height="h-4"/>
        <div class="flex flex-row gap-2">
            <ReadOnlyTextField
                :text="reportDetail?.report.lat.toString()"
                label="Latitude"
                class="flex-1"
            />
            <ReadOnlyTextField
                :text="reportDetail?.report.long.toString()"
                label="Longitude*"
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
        <Spacer height="h-6"/>
        <div class="flex flex-row gap-4">
            <Button
                :type="ButtonType.Secondary"
                :loading="isLoading"
                @click="showDeclineModal = true"
                class="flex-1"
            >
                Tolak Laporan
            </Button>
            <Button
                :loading="isLoading"
                @click="acceptReport"
                class="flex-1"
            >
                Terima Laporan
            </Button>
        </div>
    </div>
    <dialog 
        class="modal modal-bottom sm:modal-middle"
        :class="{ 'modal-open': showDeclineModal }"
    >
        <div class="modal-box">
            <Text :typography="Typography.H2">Masukkan Alasan Penolakan</Text>
            <Spacer height="h-4" />
            <TextField
                v-model="declineReason"
                label="Alasan Penolakan"
                placeholder="Masukkan alasan penolakan di sini"
                :error-message="declineReasonErrorMessage"
            />
            <Spacer height="h-6"/>
            <div class="flex flex-row gap-2 w-full">
                <Button 
                    :type="ButtonType.Secondary"
                    class="flex-1"
                    @click="showDeclineModal = false"
                >
                    Batalkan
                </Button>
                <Button
                    class="flex-1"
                    @click="declineReport"
                >
                    Tolak Laporan
                </Button>
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
    import { ButtonType } from '~/components/attr/ButtonAttr';
    import { Typography } from '~/components/attr/TextAttr';
    import Button from '~/components/Button.vue';
    import { useGetReportAndAssociatedById } from '~/composables/report/useGetReportAndAssociatedById';
    import type { ReportDetail } from '~/models/report/ReportDetail';

    definePageMeta({
        layout: "admin"
    })

    const route = useRoute()

    const reportDetail = ref<ReportDetail | null>(null)
    const alertErrorMessage = ref("")
    const isLoading = ref(false)
    const map = ref()
    const polyline = ref()
    const showDeclineModal = ref(false)
    const declineReason = ref("")
    const declineReasonErrorMessage = ref("")

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

        isLoading.value = true
        const result = await useEditReport({
            ...reportDetail.value.report,
            status: "ACCEPTED"
        })

        if (isLeft(result)) {
            alertErrorMessage.value = unwrapEither(result)
            isLoading.value = false
            return
        } else {
            navigateTo("/admin/disaster-report")
        }
    }

    const declineReport = async () => {
        if (reportDetail.value?.report == null) {
            alertErrorMessage.value = "Detail laporan tidak ada"
            return
        }

        declineReasonErrorMessage.value = ""
        if (declineReason.value == "") {
            declineReasonErrorMessage.value = "Alasan penolakan harus diisi!"
            return
        }

        isLoading.value = true
        const result = await useEditReport({
            ...reportDetail.value.report,
            status: "DECLINED"
        })

        if (isLeft(result)) {
            alertErrorMessage.value = unwrapEither(result)
            isLoading.value = false
            return
        }

        const updateResult = await useAddUpdateReport(reportDetail.value.report.id, {
            id: "",
            declineData: {
                reason: declineReason.value
            }
        } satisfies UpdateReport)

        if (isLeft(updateResult)) {
            alertErrorMessage.value = unwrapEither(updateResult)
            isLoading.value = false
            return
        } else {
            navigateTo("/admin/disaster-report")
        }
    }
</script>