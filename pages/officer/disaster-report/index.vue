<template>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Laporan Masuk</Text>
        <Spacer height="h-8"/>
        <Table
            :headers="reportTableHeaders"
            :is-empty="newReports.length == 0"
        >
            <tr v-for="(data, index) in newReports">
                <th>
                    <Text :typography="Typography.Body2" class="font-semibold text-content-primary">{{ index + 1 }}</Text>
                </th>
                <td>
                    <Text :typography="Typography.Body2">{{ data.title }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.description }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.address }}</Text>
                </td>
                <td>
                    <StatusCard :status="data.status"/>
                </td>
                <td class="flex justify-end">
                    <Button 
                        :type="ButtonType.Outlined" 
                        dense
                        :to="`/officer/disaster-report/${data.id}`"
                    >
                        Lihat Detail
                    </Button>
                </td>
            </tr>
        </Table>
    </div>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Laporan Dalam Proses</Text>
        <Spacer height="h-8"/>
        <Table
            :headers="reportTableHeaders"
            :is-empty="existingReports.length == 0"
        >
            <tr v-for="(data, index) in existingReports">
                <th>
                    <Text :typography="Typography.Body2" class="font-semibold text-content-primary">{{ index + 1 }}</Text>
                </th>
                <td>
                    <Text :typography="Typography.Body2">{{ data.title }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.description }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.address }}</Text>
                </td>
                <td>
                    <StatusCard :status="data.status"/>
                </td>
                <td class="flex justify-end">
                    <Button 
                        :type="ButtonType.Outlined" 
                        dense
                        :to="getUpdateLink(data.status, data.id)"
                    >
                        Update
                    </Button>
                </td>
            </tr>
        </Table>
    </div>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Laporan Selesai</Text>
        <Spacer height="h-8"/>
        <Table
            :headers="reportTableHeaders"
            :is-empty="completedReports.length == 0"
        >
            <tr v-for="(data, index) in completedReports">
                <th>
                    <Text :typography="Typography.Body2" class="font-semibold text-content-primary">{{ index + 1 }}</Text>
                </th>
                <td>
                    <Text :typography="Typography.Body2">{{ data.title }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.description }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.address }}</Text>
                </td>
                <td>
                    <StatusCard :status="data.status"/>
                </td>
                <td class="flex justify-end">
                    <Button 
                        :type="ButtonType.Outlined" 
                        dense
                        :to="`/officer/disaster-report/${data.id}/detail`"
                    >
                        Detail
                    </Button>
                </td>
            </tr>
        </Table>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr'
    import { ButtonType } from '~/components/attr/ButtonAttr'

    definePageMeta({
        layout: "officer"
    })

    const reportTableHeaders = ref([
        "",
        "Judul",
        "Deskripsi",
        "Alamat",
        "Status",
        ""
    ])

    const newReports = useGetAllReportsByStatus("in", ["ACCEPTED"])
    const existingReports = useGetAllReportsByStatus("not-in", ["ACCEPTED", "TODO", "DONE"])
    const completedReports = useGetAllReportsByStatus("in", ["DONE"])

    const getUpdateLink = (status: string, id: string) => (status == "RECEIVED-BY-OFFICER") ? 
        `/officer/disaster-report/${id}/arrived` : 
        `/officer/disaster-report/${id}/completion`
</script>