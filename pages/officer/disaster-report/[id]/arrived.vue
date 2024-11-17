<template>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Update Laporan Bencana {{ reportDetail?.report.title }}</Text>
        <Spacer height="h-4"/>
        <InlineAlert :alert-message="alertErrorMessage"/>
        <Spacer height="h-8"/>
        <TextField
            v-model="arrivalTime"
            :error-message="arrivalTimeErrorMessage"
            placeholder="Format 09:00"
            label="Waktu Kedatangan*"
        />
        <Spacer height="h-4"/>
        <TextArea
            v-model="accidentDetail"
            label="Detail Kejadian*"
            :error-message="accidentDetailErrorMessage"
            placeholder="Deskripsikan Kejadian Ex : Tim melakukan pencarian dengan rentang jarak 5km dari lokasi kejadian"
        />
        <Spacer height="h-4"/>
        <TextField
            v-model="packageUsed"
            :error-message="packageUsedErrorMessage"
            :placeholder="reportDetail?.package.title"
            label="Alat yang Digunakan*"
        />
        <Spacer height="h-6"/>
        <Button
            full-width
            :loading="isLoading"
            @click="updateReport"
        >
            Update
        </Button>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import { useGetReportAndAssociatedById } from '~/composables/report/useGetReportAndAssociatedById';
    import type { ReportDetail } from '~/models/report/ReportDetail';
    import type { UpdateReport } from '~/models/report/UpdateReport';
    
    definePageMeta({
        layout: "officer"
    })

    const route = useRoute()

    const reportDetail = ref<ReportDetail | null>(null)
    const arrivalTime = ref("")
    const accidentDetail = ref("")
    const packageUsed = ref("")
    const isLoading = ref(false)
    const alertErrorMessage = ref("")
    const arrivalTimeErrorMessage = ref("")
    const accidentDetailErrorMessage = ref("")
    const packageUsedErrorMessage = ref("")

    onMounted(async () => {
        const result = await useGetReportAndAssociatedById(route.params.id as string)
        if (isLeft(result)) {
            alertErrorMessage.value = unwrapEither(result)
        } else {
            reportDetail.value = unwrapEither(result)
        }
    })

    const updateReport = async () => {
        if (reportDetail.value?.report == null) {
            alertErrorMessage.value = "Detail laporan tidak ada"
            return
        }

        let isValid = true
        if (arrivalTime.value == "") {
            arrivalTimeErrorMessage.value = "Waktu kedatangan tidak boleh kosong"
            isValid = false
        }
        if (accidentDetail.value == "") {
            accidentDetailErrorMessage.value = "Detail kejadian tidak boleh kosong"
            isValid = false
        }
        if (packageUsed.value == "") {
            packageUsedErrorMessage.value = "Alat yang digunakan tidak boleh kosong"
            isValid = false
        }
        if (!isValid) return

        isLoading.value = true
        const result = await useEditReport({
            ...reportDetail.value.report,
            status: "INPROGRESS"
        })

        if (isLeft(result)) {
            alertErrorMessage.value = unwrapEither(result)
            isLoading.value = false
            return
        }

        const updateResult = await useAddUpdateReport(reportDetail.value.report.id, {
            id: "",
            arrivalData: {
                arrivedAt: arrivalTime.value,
                accidentDetail: accidentDetail.value,
                packageUsed: packageUsed.value
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