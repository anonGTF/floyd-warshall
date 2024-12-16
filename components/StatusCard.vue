<template>
    <div class="px-4 py-2 rounded-lg mb-2 w-fit" :class="statusBg">
        <Text :typography="Typography.Body2" class="font-semibold" color="text-white">{{ statusMessage }}</Text>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from './attr/TextAttr';

    const props = defineProps({
        status: {
            type: String,
            default: "TODO"
        }
    })

    const statusMessage = computed(() => {
        switch (props.status) {
            case "TODO":
                return "Menunggu Verifikasi Admin"
            case "ACCEPTED":
                return "Menunggu Petugas"
            case "RECEIVED-BY-OFFICER":
                return "Petugas Menuju TKP"
            case "ARRIVED":
                return "Petugas Sampai di TKP"
            case "INPROGRESS":
                return "Proses Penanganan"
            case "DONE":
                return "Laporan Telah Diselesaikan"
            case "DECLINED":
                return "Laporan Ditolak"
        }
    })

    const statusBg = computed(() => {
        switch (props.status) {
            case "TODO":
                return "bg-info"
            case "ACCEPTED":
                return "bg-info"
            case "RECEIVED-BY-OFFICER":
                return "bg-warning"
            case "ARRIVED":
                return "bg-warning"
            case "INPROGRESS":
                return "bg-warning"
            case "DONE":
                return "bg-success"
            case "DECLINED":
                return "bg-error"
        }
    })
</script>