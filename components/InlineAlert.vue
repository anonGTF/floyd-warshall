<template>
    <div v-if="alertMessage != ''" class="bg-red-500 p-2 rounded-xl flex flex-row items-center text-white gap-2">
        <Icon name="mdi:alert-circle-outline" size="24px" class="flex-none"/>
        <Text :typography="Typography.Label" class="text-white">{{ alertMessage }}</Text>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from './attr/TextAttr';

    defineProps({
        alertMessage: {
            type: String,
            default: ''
        }
    })
</script>