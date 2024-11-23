<template>
    <div 
        v-if="uiStore.toast != null" 
        :class="constructedClass"
    >
        <Icon :name="icon" :class="textColor" size="1.4rem"/>
        <Text 
            :color="textColor"
            class="flex-1 text-wrap"
        >
            {{ uiStore.toast.message }}
        </Text>
        <Icon 
            name="mdi:close" 
            class="text-black cursor-pointer"
            @click="uiStore.hideToast()"
        />
    </div>
</template>

<script setup lang="ts">
    import { ToastType } from './attr/ToastAttr';

    const uiStore = useUiStore()
    const activeBreakpoint = ref("")

    const backgroundColor = computed(() => {
        switch (uiStore.toast?.type) {
            case ToastType.DEFAULT:
                return 'bg-blue-100'
            
            case ToastType.ERROR:
                return 'bg-red-100'

            case ToastType.SUCCESS:
                return 'bg-green-100'
        
            default:
                return ""
        }
    })

    const icon = computed(() => {
        switch (uiStore.toast?.type) {
            case ToastType.DEFAULT:
                return 'mdi:information-outline'
            
            case ToastType.ERROR:
                return 'mdi:alert-circle-outline'

            case ToastType.SUCCESS:
                return 'mdi:check-circle-outline'
        
            default:
                return ""
        }
    })

    const textColor = computed(() => {
        switch (uiStore.toast?.type) {
            case ToastType.DEFAULT:
                return 'text-blue-700'
            
            case ToastType.ERROR:
                return 'text-red-700'

            case ToastType.SUCCESS:
                return 'text-green-700'
        
            default:
                return ""
        }
    })

    const position = computed(() => isSmall(activeBreakpoint.value) ? 'toast-center ' : 'toast-top toast-end me-4 ')

    const constructedClass = computed(() => {
        let className = `toast min-w-80 rounded-lg my-4 flex flex-row gap-2 items-center `
        className += position.value
        className += backgroundColor.value
        return className
    })

    useEventListener("resize", () => {
        activeBreakpoint.value = getActiveBreakpoint()
    })
</script>