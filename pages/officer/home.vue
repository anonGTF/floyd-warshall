<template>
    <div class="flex flex-col">
        <TextField
            v-model="search"
            placeholder="Cari Lokasi"
            trailing-icon="mdi:magnify"
            class="mx-4 lg:mx-16 my-8"
        />
        <div class="flex items-center justify-center mx-4 lg:mx-16">
            <img src="/images/indonesia-map.png" class="object-cover"/>
        </div>
        <div class="flex-none mt-16 mb-4 mx-4 lg:mx-16 bg-white border border-primary rounded-2xl p-8">
            <div class="flex flex-col xl:flex-row gap-4 items-center">
                <Text :typography="Typography.H1" class="font-semibold flex-1">Rekap Data Laporan</Text>
                <div class="flex flex-row gap-4 items-center">
                    <DatePicker v-model="startDate"/>
                    <Text class=" text-3xl">-</Text>
                    <DatePicker v-model="endDate"/>
                </div>
            </div>
            <Spacer height="h-10"/>
            <div class="flex flex-row flex-wrap gap-12">
                <div class="flex-1 lg:flex-none flex flex-col lg:flex-row">
                    <div class="flex flex-col">
                        <Text :typography="Typography.H2">Total Laporan Masuk</Text>
                        <div class="w-full rounded-lg bg-gray-100 p-4 mt-2 flex justify-center items-center grow">
                            <Text  class=" text-5xl font-bold text-primary">{{ reports.length }}</Text>
                        </div>
                    </div>
                    <Spacer width="w-6"/>
                    <div class="flex flex-col">
                        <Text :typography="Typography.H2">Total Laporan Selesai</Text>
                        <div class="w-full rounded-lg bg-gray-100 p-4 mt-2 flex justify-center items-center grow">
                            <Text class=" text-5xl font-bold text-success">{{ doneReports.length }}</Text>
                        </div>
                    </div>
                </div>
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
        layout: "officer"
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
    const now = new Date()
    const startDate = ref<Date>(now)
    const endDate = ref<Date>(now)

    watch([startDate, endDate], async () => {
        const result = await useGetReportsAndAssociatedByDate(startDate.value, endDate.value)
        if (isLeft(result)) {
            uiStore.showToast(unwrapEither(result), ToastType.ERROR)
        } else {
            reports.value = unwrapEither(result)
        }
    })

    onMounted(async () => {
        startDate.value = new Date(now.getFullYear(), now.getMonth(), 1)
    })

    const generateXlsx = async () => { await useGenerateXlsx(reports.value, startDate.value, endDate.value) }
    const generatePdf = () => { useGeneratePdf(reports.value, startDate.value, endDate.value) }
</script>