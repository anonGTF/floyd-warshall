<template>
    <div class="bg-white rounded-2xl m-4 lg:m-16 p-8">
        <div class="flex flex-row justify-between">
            <Text :typography="Typography.H1" class="text-primary">Laporan Bencana</Text>
            <Button to="/reporter/disaster-report/create">
                Buat Laporan
            </Button>
        </div>
        <Spacer height="h-8"/>
        <Table
            :headers="reportTableHeaders"
            :is-empty="reports.length == 0"
        >
            <tr v-for="(data, index) in reports">
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
                        :to="`/reporter/disaster-report/${data.id}`"
                    >
                        Lacak
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
        layout: "reporter"
    })

    const reportTableHeaders = ref([
        "",
        "Judul",
        "Deskripsi",
        "Alamat",
        "Status",
        ""
    ])

    const reports = useGetAllReports()
</script>