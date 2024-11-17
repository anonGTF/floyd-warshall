<template>
    <NuxtLink :to="menu.route" @click="$emit('click')" :class="{'bg-[#FFFFFF33]': isActive}">
        <div class="flex flex-row gap-2 items-center h-9">
            <Icon 
                :name="(isActive && menu.selectedIcon != null ? menu.selectedIcon : menu.icon) ?? ''" 
                class="text-white h-9 ms-2"
            />
            <Text 
                :typography="Typography.Body1" 
                :color="isActive ? 'text-white' : 'text-white'"
                :class="isActive ? 'font-semibold' : ''"
                class="flex-1"
            >
                {{ menu.label }}
            </Text>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';
    import type { MenuItemArgs } from './attr/MenuItemAttr';
    import { Typography } from '~/components/attr/TextAttr'

    const props = defineProps({
        menu: {
            type: Object as PropType<MenuItemArgs>,
            default: null
        }
    })

    defineEmits(['click'])

    const route = useRoute()
    const isActive = computed(() => props.menu.route != "" && route.path.startsWith(props.menu.route ?? ''))
</script>