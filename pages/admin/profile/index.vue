<template>
    <div class="bg-white rounded-2xl m-4 lg:m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Profil Pengguna</Text>
        <Spacer height="h-8"/>
        <div class="flex flex-row gap-8">
            <div class="h-80 w-80 bg-background-gray rounded-3xl"></div>
            <div>
                <Text :typography="Typography.Body1">Nama</Text>
                <Text :typography="Typography.Label" class="font-semibold">{{ userStore.user?.name }}</Text>
                <Spacer height="h-6"/>
                <Text :typography="Typography.Body1">Email</Text>
                <Text :typography="Typography.Label" class="font-semibold">{{ userStore.user?.email }}</Text>
                <Spacer height="h-6"/>
                <Text :typography="Typography.Body1">No Telpon</Text>
                <Text :typography="Typography.Label" class="font-semibold">{{ userStore.user?.phoneNumber }}</Text>
                <Spacer height="h-6"/>
                <Button to="/admin/profile/edit">Edit Profil</Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';

    definePageMeta({
        layout: "admin"
    })

    const userStore = useUserStore()
</script>