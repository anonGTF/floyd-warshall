<template>
    <div class="bg-white rounded-2xl m-4 lg:m-16 p-8">
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
                        :to="`/admin/disaster-report/${data.id}`"
                    >
                        Cek
                    </Button>
                </td>
            </tr>
        </Table>
    </div>
    <div class="bg-white rounded-2xl m-4 lg:m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Semua Laporan</Text>
        <Spacer height="h-8"/>
        <Table
            :headers="reportTableHeaders"
            :is-empty="otherReports.length == 0"
        >
            <tr v-for="(data, index) in otherReports">
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
                        :to="`/admin/disaster-report/${data.id}/track`"
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
        layout: "admin"
    })

    const reportTableHeaders = ref([
        "",
        "Judul",
        "Deskripsi",
        "Alamat",
        "Status",
        ""
    ])

    const newReports = useGetAllReportsByStatus("in", ["TODO"])
    const otherReports = useGetAllReportsByStatus("not-in", ["TODO"])
</script>