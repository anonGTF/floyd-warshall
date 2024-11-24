<template>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Lacak Laporan</Text>
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
        <template v-if="updates.length > 0">
            <Spacer height="h-8"/>
            <div class="w-full border border-border-divider border-dashed"/>
            <Spacer height="h-6"/>
            <Text :typography="Typography.H2" class="text-primary">Update Laporan</Text>
            <Spacer height="h-6"/>
            <ReportUpdateItem
                v-for="(update, index) in updates"
                :order-no="index + 1"
                :update-data="update"
                :show-decoration="index != updates.length - 1"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import { ToastType } from '~/components/attr/ToastAttr';
    
    definePageMeta({
        layout: "reporter"
    })

    const route = useRoute()
    const uiStore = useUiStore()
    const reportDetail = ref<ReportDetail | null>(null)
    const updates = ref<UpdateReport[]>([])
    const map = ref()
    const polyline = ref()

    const onPolygonReady = () => {
        map.value.leafletObject.fitBounds(polyline.value.leafletObject.getBounds())
    }

    onMounted(async () => {
        const dataResult = await useGetReportAndAssociatedById(route.params.id as string)
        if (isLeft(dataResult)) {
            uiStore.showToast(unwrapEither(dataResult), ToastType.ERROR)
        } else {
            reportDetail.value = unwrapEither(dataResult)
        }

        if (reportDetail.value?.report.id != null) {
            const updateResult = await useGetAllReportUpdates(reportDetail.value?.report.id)
            if (isLeft(updateResult)) {
                uiStore.showToast(unwrapEither(updateResult), ToastType.ERROR)
            } else {
                updates.value = unwrapEither(updateResult)
                updates.value.sort((curr, next) => {
                    if (curr.createdAt === undefined && next.createdAt === undefined) return 0
                    if (curr.createdAt === undefined) return -1
                    if (next.createdAt === undefined) return 1

                    return curr.createdAt.getTime() - next.createdAt.getTime()
                })
            }
        }
    })
</script>