<template>
    <div class="flex flex-col">
        <TextField
            v-model="search"
            placeholder="Cari Lokasi"
            trailing-icon="mdi:magnify"
            class="mx-16 my-8"
        />
        <div class="flex items-center justify-center w-full mx-16">
            <img src="/images/indonesia-map.png" class="object-cover"/>
        </div>
        <div class="flex-none mt-16 mb-4 mx-16 bg-white border border-primary rounded-2xl p-8">
            <Text :typography="Typography.H1" class="font-semibold text-center">{{ getTitleName(new Date()) }}</Text>
            <Spacer height="h-10"/>
            <div class="flex flex-row">
                <div class="flex-none flex flex-col">
                    <Text :typography="Typography.H2">Total Laporan Masuk</Text>
                    <div class="w-full rounded-lg bg-gray-100 p-4 mt-2 flex justify-center items-center grow">
                        <Text  class=" text-5xl font-bold text-primary">{{ reports.length }}</Text>
                    </div>
                </div>
                <Spacer width="w-6"/>
                <div class="flex-none flex flex-col">
                    <Text :typography="Typography.H2">Total Laporan Selesai</Text>
                    <div class="w-full rounded-lg bg-gray-100 p-4 mt-2 flex justify-center items-center grow">
                        <Text class=" text-5xl font-bold text-success">{{ doneReports.length }}</Text>
                    </div>
                </div>
                <Spacer width="w-12"/>
                <div class="flex-1 grid grid-rows-3 grid-flow-col gap-4">
                    <div v-for="[category, total] in totalReportByCategory" class="flex flex-row gap-2 items-center">
                        <Text class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-border-primary" :typography="Typography.H2">{{ total }}</Text>
                        <Text :typography="Typography.Label" class="font-semibold" color="text-black">{{ category }}</Text>
                    </div>
                </div>
            </div>
            <Spacer height="h-6"/>
            <div class="flex flex-row gap-4">
                <Button
                    class="flex-1"
                    @click="generatePdf"
                >
                    <Icon name="mdi:file-pdf-box" size="1.8rem"/> Download PDF
                </Button>
                <Button
                    class="flex-1"
                    @click="generateXlsx"
                >
                    <Icon name="mdi:file-excel" size="1.8rem"/> Download Excel
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import { ToastType } from '~/components/attr/ToastAttr';

    definePageMeta({
        layout: "reporter"
    })

    const categories = [
        "Banjir",
        "Tsunami",
        "Gempa Bumi",
        "Gunung Meletus",
        "Angin Tornado",
        "Tanah Longsor",
        "Orang Tenggelam",
        "Kecelakaan",
        "Lainnya"
    ]

    const uiStore = useUiStore()
    const search = ref("")
    const reports = ref<ReportDetail[]>([])
    const doneReports = computed(() => reports.value.filter((report) => report.report.status == "DONE"))
    const totalReportByCategory = computed(() => {
        const categoryToTotalMap = new Map<string, number>()
        categories.forEach((category) => {
            const total = reports.value.reduce((acc, curr) => curr.report.category == category ? acc + 1 : acc, 0)
            categoryToTotalMap.set(category, total)
        })
        return categoryToTotalMap
    })

    onMounted(async () => {
        const result = await useGetReportsAndAssociatedByDate()
        if (isLeft(result)) {
            uiStore.showToast(unwrapEither(result), ToastType.ERROR)
        } else {
            reports.value = unwrapEither(result)
        }
    })

    const generateXlsx = async () => { await useGenerateXlsx(reports.value) }
    const generatePdf = () => { useGeneratePdf(reports.value) }
</script>