<template>
    <VDatePicker 
        v-model="model" 
        locale="id-ID"
        mode="date"
    >
        <template #default="{ togglePopover }">
            <ReadOnlyTextField
                :label="label"
                :text="formatedDate.value"
                leading-icon="mdi:calendar"
                clickable
                @click="togglePopover"
            />
        </template>
    </VDatePicker>
</template>

<script setup lang="ts">
    const props = defineProps({
        label: {
            type: String,
            default: ""
        },
        dateFormat: {
            type: String,
            default: "D MMMM YYYY"
        }
    })
    const model = defineModel({
        type: Date,
        default: new Date()
    })
    const formatedDate = computed(() => useDateFormat(model.value, props.dateFormat, { locales: "id-ID" }) ?? "")
</script>