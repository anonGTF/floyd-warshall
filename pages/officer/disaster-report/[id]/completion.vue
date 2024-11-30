<template>
    <div class="bg-white rounded-2xl m-4 lg:m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Update Penyelesaian Laporan Bencana {{ reportDetail?.report.title }}</Text>
        <Spacer height="h-4"/>
        <InlineAlert :alert-message="alertErrorMessage"/>
        <Spacer height="h-8"/>
        <TextField
            v-model="victimStatus"
            :error-message="victimStatusErrorMessage"
            placeholder="Jumlah meninggal dunia atau korban selamat"
            label="Status Korban*"
        />
        <Spacer height="h-4"/>
        <TextArea
            v-model="blocker"
            :error-message="blockerErrorMessage"
            placeholder="Deskripsikan Kendala Ex : Banyaknya warga sekitar yang melihat proses evakuasi menyulitkan tim"
            label="Kendala*"
        />
        <Spacer height="h-4"/>
        <TextArea
            v-model="accidentDetail"
            label="Detail Kejadian*"
            :error-message="accidentDetailErrorMessage"
            placeholder="Deskripsikan Kejadian Ex : Tim melakukan pencarian dengan rentang jarak 5km dari lokasi kejadian"
        />
        <Spacer height="h-4"/>
        <FileInput
            label="Foto/Video Terkait"
            file-type="image/*, video/*"
            @change="handleFileChanged"
        />
        <Spacer height="h-6"/>
        <Button
            full-width
            :loading="isLoading"
            @click="completeReport"
        >
            Selesaikan
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
    const victimStatus = ref("")
    const blocker = ref("")
    const accidentDetail = ref("")
    const isLoading = ref(false)
    const alertErrorMessage = ref("")
    const victimStatusErrorMessage = ref("")
    const blockerErrorMessage = ref("")
    const accidentDetailErrorMessage = ref("")
    const selectedFile = ref<File | null | undefined>(null)

    onMounted(async () => {
        const result = await useGetReportAndAssociatedById(route.params.id as string)
        if (isLeft(result)) {
            alertErrorMessage.value = unwrapEither(result)
        } else {
            reportDetail.value = unwrapEither(result)
        }
    })

    const handleFileChanged = (file: File | null | undefined) => {
        selectedFile.value = file
    }

    const completeReport = async () => {
        if (reportDetail.value?.report == null) {
            alertErrorMessage.value = "Detail laporan tidak ada"
            return
        }

        let isValid = true
        if (victimStatus.value == "") {
            victimStatusErrorMessage.value = "Status korban tidak boleh kosong, bila tidak ada isi 'Tidak ada'"
            isValid = false
        }
        if (accidentDetail.value == "") {
            accidentDetailErrorMessage.value = "Detail kejadian tidak boleh kosong"
            isValid = false
        }
        if (blocker.value == "") {
            blockerErrorMessage.value = "Kendala tidak boleh kosong, bila tidak ada isi 'Tidak ada'"
            isValid = false
        }
        if (!isValid) return

        isLoading.value = true
        const result = await useEditReport({
            ...reportDetail.value.report,
            status: "DONE"
        })

        if (isLeft(result)) {
            alertErrorMessage.value = unwrapEither(result)
            isLoading.value = false
            return
        }

        let completionData = {
            victimStatus: victimStatus.value,
            blocker: blocker.value,
            accidentDetail: accidentDetail.value,
            evidence: ""
        }

        if (selectedFile instanceof File) {
            const evidenceResult = await useUploadEvidence(selectedFile.value)
            if (isLeft(evidenceResult)) {
                alertErrorMessage.value = unwrapEither(evidenceResult)
                isLoading.value = false
                return
            } else {
                const evidenceLink = unwrapEither(evidenceResult)
                completionData = {
                    ...completionData,
                    evidence: evidenceLink
                }
            }
        }

        const updateResult = await useAddUpdateReport(reportDetail.value.report.id, {
            id: "",
            completionData
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