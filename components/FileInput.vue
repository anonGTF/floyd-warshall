<template>
    <Text :typography="Typography.Body2">{{ label }}</Text>
    <Spacer height="h-1" />
    <div class="flex flex-row gap-2 items-center">
        <Button 
            :type="ButtonType.Secondary"
            @click="selectFile"
        >
            {{ buttonText }}
        </Button>
        <Text :typography="Typography.Body1">{{ selectedFileName }}</Text>
    </div>
    <input 
        ref="file-input"
        type="file" 
        class="hidden" 
        :accept="fileType"
        @change="handleChanged"
    />
</template>

<script setup lang="ts">
    import { ButtonType } from './attr/ButtonAttr';
    import { Typography } from './attr/TextAttr';

    defineProps({
        label: {
            type: String,
            default: "Pilih file"
        },
        buttonText: {
            type: String,
            default: "Pilih file"
        },
        fileType: {
            type: String,
            default: ".pdf"
        }
    })

    const emit = defineEmits<{
        change: [file: File | null | undefined]
    }>()

    const fileInput = useTemplateRef("file-input")

    const selectedFileName = ref("")

    const selectFile = () => { fileInput.value?.click() }

    const handleChanged = async (e: Event) => {
        const payload = e.target as HTMLInputElement
        const file = payload.files?.item(0)
        selectedFileName.value = file?.name ?? ""
        emit("change", file)
    }
</script>