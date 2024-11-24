<template>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Riwayat Performa Algoritma</Text>
        <Spacer height="h-8"/>
        <template v-for="data in reportsWithCalculations">
            <div class="rounded-2xl border border-border-primary px-6 py-4">
                <div class="flex flex-row justify-between items-center">
                    <div>
                        <Text :typography="Typography.H2" class="font-semibold">{{ data.report.title }}</Text>
                        <Spacer height="h-2"/>
                        <div class="flex flex-row gap-2 items-center">
                            <Text>{{ data.report.address }} ({{ data.report.lat }}, {{ data.report.long }})</Text>
                            <Icon name="mdi:swap-horizontal"/>
                            <Text>Kantor {{ data.results[0]?.nearestOffice.nama }} ({{ data.results[0]?.nearestOffice.lat }}, {{ data.results[0]?.nearestOffice.long }})</Text>
                        </div>
                    </div>
                    <div class="rounded-xl bg-gray-100 p-4">
                        <Text :typography="Typography.H3" class="font-bold">{{ reportsWithCalculations[0].results[0]?.distance }} m</Text>
                    </div>
                </div>
                <Spacer height="h-4"/>
                <div class="flex flex-row gap-2">
                    <div v-for="(result, index) in data.results.sort((a, b) => a.duration - b.duration)" class="rounded-xl flex-1 bg-gray-100 p-2">
                        <Text :typography="Typography.Body1" class="font-semibold" color="text-black">
                            {{ calculationPlaceholder[index] }}: {{ Math.round(result.duration) }} ms
                        </Text>
                    </div>
                </div>
            </div>
            <Spacer height="h-6"/>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import type { ReportWithCalculation } from '~/models/report/CalculationResult';

    definePageMeta({
        layout: "admin"
    })

    const calculations = useGetAllCalculations()
    const reports = useGetAllReports()
    const reportsWithCalculations = computed(() => reports.value.map((report) => ({
        report,
        results: calculations.value.filter((calc) => (calc.parentId == report.id))
    } satisfies ReportWithCalculation)))
    const calculationPlaceholder = [
        "2 node",
        "3 node",
        "4 node",
        "5 node"
    ]
</script>