<template>
    <div class="drawer lg:drawer-open">
        <input v-model="isDrawerOpen" id="admin-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content bg-background-gray flex flex-col h-svh lg:h-auto">
            <label for="admin-drawer" class="drawer-button btn btn-square lg:hidden m-4">
                <Icon name="mdi:menu" size="24px"/>
            </label>
            <div class="flex-1">
                <slot />
            </div>
            <div class="flex flex-row items-center my-4 justify-center">
                <Text :typography="Typography.Label" class="self-center">
                    © 2024 Proyek Akhir Penentuan Rute Terpendek Logistik Basarnas
                </Text>
            </div>
        </div>
        <div class="drawer-side border-e border-border-divider bg-transparent lg:bg-primary">
            <label for="admin-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="flex justify-center w-80 lg:w-full min-h-[5dvh] p-6">
                <img src="/images/basarnas-logo.png"/>
            </div>
            <ul class="menu h-svh lg:h-auto w-80 pt-4 gap-4 px-4 bg-primary">
                <li class="menu-title -ms-4 text-white">MENU</li>
                <li v-for="menu in adminMenuItems" :key="menu.label">
                    <MenuItem
                        :menu="menu"
                        @click="toggleDrawer"
                    />
                </li>
                <li class="menu-title -ms-4 text-white">LOGOUT</li>
                <li>
                    <MenuItem
                        :menu="logoutMenuItem"
                        @click="logout"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import type { MenuItemArgs } from '~/components/attr/MenuItemAttr';
    import { useUiStore } from '~/stores/uiStore';
    import { ToastType } from '~/components/attr/ToastAttr';

    const uiStore = useUiStore()

    const adminMenuItems: Ref<Array<MenuItemArgs>> = ref([
        {
            label: "Dashboard",
            route: "/admin/home",
            icon: "mdi:view-dashboard-outline",
            selectedIcon: "mdi:view-dashboard"
        },
        {
            label: "Profile",
            route: "/admin/profile",
            icon: "mdi:account-circle-outline",
            selectedIcon: "mdi:account-circle"
        },
        {
            label: "Laporan Bencana",
            route: "/admin/disaster-report",
            icon: "mdi:file-chart-outline"
        },
        {
            label: "Update Persediaan",
            route: "/admin/stock",
            icon: "mdi:update"
        },
        {
            label: "Hitung Manual",
            route: "/admin/calculate-manual",
            icon: "mdi:calculator-variant-outline",
            selectedIcon: "mdi:calculator-variant"
        },
        {
            label: "Riwayat Performa",
            route: "/admin/performance",
            icon: "mdi:chart-box-multiple-outline",
            selectedIcon: "mdi:chart-box-multiple"
        }
    ])

    const logoutMenuItem = ref(
        {
            label: "Logout",
            route: "",
            icon: "mdi:logout"
        }
    )

    const isDrawerOpen = ref(false)

    const toggleDrawer = () => { isDrawerOpen.value = !isDrawerOpen.value }

    const logout = async () => {
        const result = await useLogout()
        if (isLeft(result)) {
            uiStore.showToast(unwrapEither(result), ToastType.ERROR)
        }
    }
</script>

<style>
.menu :where(li ul):before {
    position: absolute;
    bottom: 0;
    inset-inline-start: 0px;
    top: 0;
    background-color: #D9D9D9;
    width: 2px;
    opacity: 1;
}

.menu :where(li:not(.menu-title) > *:not(ul, details, .menu-title, .btn)), .menu :where(li:not(.menu-title) > details > summary:not(.menu-title)) {
    padding: 0;
}

.menu :where(li ul) {
    position: relative;
    white-space: nowrap;
    margin-inline-start: 0;
    padding-inline-start: 0;
}
</style>