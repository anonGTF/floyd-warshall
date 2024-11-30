<template>
    <div class="bg-white rounded-2xl m-4 lg:m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Stok Alat Bantu</Text>
        <Spacer height="h-8"/>
        <Table
            :headers="packageTableHeaders"
            :is-empty="packagesStock.length == 0"
        >
            <tr v-for="(data, index) in packagesStock">
                <th>
                    <Text :typography="Typography.Body2" class="font-semibold text-content-primary">{{ index + 1 }}</Text>
                </th>
                <td>
                    <Text :typography="Typography.Body2">{{ data.title }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.stock }}</Text>
                </td>
                <td class="flex justify-end">
                    <Button 
                        :type="ButtonType.Outlined" 
                        dense
                        @click="selectPackage(data)"
                    >
                        Update
                    </Button>
                </td>
            </tr>
        </Table>
    </div>
    <dialog
        class="modal modal-bottom sm:modal-middle"
        :class="{ 'modal-open': selectedPackage != null }"
    >
        <template v-if="selectedPackage != null">
            <div class="modal-box">
                <Text :typography="Typography.H2">Update Stok Alat Bantu</Text>
                <Spacer height="h-6" />
                <ReadOnlyTextField
                    :text="selectedPackage.title"
                    label="Jenis Paket Bantuan"
                />
                <Spacer height="h-4" />
                <TextField
                    v-model:number="selectedPackage.stock"
                    type="number"
                    placeholder="Masukkan banyak stok"
                    label="Jumlah stok"
                />
                <Spacer height="h-6" />
                <div class="flex flex-row gap-2 w-full">
                    <Button 
                        :type="ButtonType.Secondary"
                        class="flex-1"
                        @click="closeModal"
                    >
                        Batal
                    </Button>
                    <Button
                        :loading="isLoading"
                        class="flex-1"
                        @click="updatePackage"
                    >
                        Update
                    </Button>
                </div>
            </div>
        </template>
    </dialog>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import { ButtonType } from '~/components/attr/ButtonAttr';
import { ToastType } from '~/components/attr/ToastAttr';
    
    definePageMeta({
        layout: "admin"
    })

    const uiStore = useUiStore()
    const userStore = useUserStore()
    const packagesStock = useGetPackagesFromOffice(userStore.user?.officeId as string)

    const packageTableHeaders = ref([
        "",
        "Nama",
        "Stok",
        ""
    ])

    const selectedPackage = ref<Package | null>(null)
    const isLoading = ref(false)

    const selectPackage = (data: Package) => {
        selectedPackage.value = data
    }

    const closeModal = () => {
        selectedPackage.value = null
    }

    const updatePackage = async () => {
        if (selectedPackage.value == null) {
            return
        }

        isLoading.value = true
        const result = await useEditPackageFromOffice(selectedPackage.value, userStore.user?.officeId as string)
        if (isLeft(result)) {
            uiStore.showToast(unwrapEither(result), ToastType.ERROR)
        } else {
            uiStore.showToast("Stok berhasil diupdate", ToastType.SUCCESS)
            closeModal()
        }
        isLoading.value = false
    }
</script>