<template>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Buat Laporan Bencana</Text>
        <Spacer height="h-4"/>
        <InlineAlert :alert-message="alertErrorMessage"/>
        <Spacer height="h-8"/>
        <TextField
            v-model="title"
            :error-message="titleErrorMessage"
            placeholder="Masukkan Judul Laporan"
            label="Judul Laporan*"
        />
        <Spacer height="h-4"/>
        <TextArea
            v-model="description"
            placeholder="Masukkan Deskripsi"
            label="Deskripsi Kejadian"
        />
        <Spacer height="h-4"/>
        <DropdownSelector
            v-model="selectedCategoryIndex"
            :options="categoryDropdownOption"
            :error-message="categoryErrorMessage"
            label="Kategori Bencana"
            placeholder="Pilih Kategori Bencana"
        />
        <Spacer height="h-4"/>
        <DropdownSelector
            v-model="selectedPackageIndex"
            :options="packageDropdownOptions"
            :error-message="packageErrorMessage"
            label="Kebutuhan Bantuan*"
            placeholder="Pilih Kebutuhan Bantuan"
        />
        <Spacer height="h-4"/>
        <FileInput
            label="Foto/Video Terkait"
            file-type="image/*, video/*"
            @change="handleFileChanged"
        />
        <Spacer height="h-6"/>
        <Button
            full-width
            :loading="isLoading"
            @click="saveReportData"
        >
            Selanjutnya
        </Button>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import type { DropdownOption } from '~/components/attr/DropdownAttr';
    import type { Package } from '~/models/report/Package';
    import type { Report } from '~/models/report/Report'

    definePageMeta({
        layout: "reporter"
    })

    const title = ref("")
    const description = ref("")
    const category = computed(() => categoryOptions[selectedCategoryIndex.value])
    const packageId = computed(() => packageOptions.value[selectedPackageIndex.value].id)

    const titleErrorMessage = ref("")
    const categoryErrorMessage = ref("")
    const packageErrorMessage = ref("")
    const alertErrorMessage = ref("")

    const categoryOptions = [
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
    const categoryDropdownOption = computed(() => categoryOptions.map((category) => ({
        label: category,
        data: category
    } satisfies DropdownOption<string>)))
    const selectedCategoryIndex = ref(-1)

    const packageOptions = useGetAllPackages()
    const packageDropdownOptions = computed(() => packageOptions.value.map((p) => ({
        label: p.title,
        data: p
    } satisfies DropdownOption<Package>)))
    const selectedPackageIndex = ref(-1)

    const selectedFile = ref<File | null | undefined>()

    const handleFileChanged = (file: File | null | undefined) => {
        selectedFile.value = file
    }

    const isLoading = ref(false)
    const userStore = useUserStore()
    const reportStore = useReportStore()

    const saveReportData = async () => {
        isLoading.value = true
        titleErrorMessage.value = ""
        categoryErrorMessage.value = ""
        packageErrorMessage.value = ""
        alertErrorMessage.value = ""

        let isValid = true
        if (title.value.trim() == "") {
            titleErrorMessage.value = "Judul laporan wajib diisi"
            isValid = false
        }
        if (selectedCategoryIndex.value == -1) {
            categoryErrorMessage.value = "Kategori bencana harus diisi"
            isValid = false
        }
        if (selectedPackageIndex.value == -1) {
            packageErrorMessage.value = "Kebutuhan bantuan harus diisi"
            isValid = false
        }
        if (!isValid) {
            isLoading.value = false
            return
        }

        let tempReportData: Report = {
            ...defaultReport,
            title: title.value,
            packageId: packageId.value,
            reporterId: userStore.user?.id ?? "",
            status: "TODO",
            category: category.value,
            description: description.value,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        if (selectedFile instanceof File) {
            const evidenceResult = await useUploadEvidence(selectedFile.value)
            if (isLeft(evidenceResult)) {
                alertErrorMessage.value = unwrapEither(evidenceResult)
                isLoading.value = false
                return
            } else {
                const evidenceLink = unwrapEither(evidenceResult)
                tempReportData = {
                    ...tempReportData,
                    evidence: evidenceLink
                }
            }
        }

        isLoading.value = false
        reportStore.reportData = tempReportData
        navigateTo("/reporter/disaster-report/create/location")
    }
</script>