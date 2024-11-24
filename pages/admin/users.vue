<template>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Verifikasi Akun Baru</Text>
        <Spacer height="h-8"/>
        <Table
            :headers="newUsersHeader"
            :is-empty="adjustedNewUsers.length == 0"
        >
            <tr v-for="(data, index) in adjustedNewUsers">
                <th>
                    <Text :typography="Typography.Body2" class="font-semibold text-content-primary">{{ index + 1 }}</Text>
                </th>
                <td>
                    <Text :typography="Typography.Body2">{{ data.user.name }}</Text>
                </td>
                <td>
                    <div class="px-4 py-2 rounded-lg mb-2 w-fit" :class="getRoleBackground(data.user.role)">
                        <Text :typography="Typography.Body2" class="font-semibold" color="text-white">{{ data.user.role }}</Text>
                    </div>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.office.nama }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.user.email }}</Text>
                </td>
                <td class="flex justify-end">
                    <Button 
                        :type="ButtonType.Outlined" 
                        dense
                        @click="verify(data.user)"
                    >
                        Verifikasi
                    </Button>
                </td>
            </tr>
        </Table>
    </div>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Semua Akun</Text>
        <Spacer height="h-8"/>
        <Table
            :headers="allUsersHeader"
            :is-empty="adjustedAllUsers.length == 0"
        >
            <tr v-for="(data, index) in adjustedAllUsers">
                <th>
                    <Text :typography="Typography.Body2" class="font-semibold text-content-primary">{{ index + 1 }}</Text>
                </th>
                <td>
                    <Text :typography="Typography.Body2">{{ data.user.name }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.user.role }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.office.nama }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.user.email }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.user.phoneNumber }}</Text>
                </td>
            </tr>
        </Table>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import { ButtonType } from '~/components/attr/ButtonAttr';
import { ToastType } from '~/components/attr/ToastAttr';

    definePageMeta({
        layout: "admin"
    })

    type UserWithOffice = {
        user: User,
        office: Kantor
    }

    const allUsersHeader = ref([
        "",
        "Nama",
        "Tugas",
        "Kantor",
        "Email",
        "Nomor HP"
    ])

    const newUsersHeader = ref([
        "",
        "Nama",
        "Tugas",
        "kantor",
        "Email",
        ""
    ])

    const uiStore = useUiStore()
    const newUsers = useGetAllUsersByStatus(false)
    const allUsers = useGetAllUsersByStatus(true)
    const offices = useGetAllKantor()

    const adjustedAllUsers = computed(() => {
        if (offices.value.length == 0) {
            return []
        }

        const filtered = allUsers.value.filter((user) => user.officeId != "")
        const withOffice = filtered.map((user) => ({
            user,
            office: offices.value.find((office) => office.id == user.officeId) ?? offices.value[0]
        } satisfies UserWithOffice))
        return withOffice
    })

    const adjustedNewUsers = computed(() => {
        if (offices.value.length == 0) {
            return []
        }
        
        const withOffice = newUsers.value.map((user) => ({
            user,
            office: offices.value.find((office) => office.id == user.officeId) ?? offices.value[0]
        } satisfies UserWithOffice))
        return withOffice
    })

    const getRoleBackground = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-info"
            case "officer":
                return "bg-warning"
            default:
                return ""
        }
    }

    const verify = async (user: User) => {
        const result = await useUpdateUser({
            ...user,
            isVerified: true
        })

        if (isLeft(result)) {
            uiStore.showToast(unwrapEither(result), ToastType.ERROR)
        } else {
            uiStore.showToast(`${user.name} berhasil diverifikasi`, ToastType.SUCCESS)
        }
    }
</script>