<template>
    <dialog 
        class="modal modal-bottom sm:modal-middle"
        :class="{ 'modal-open': uiStore.confirmationModal != null }"
    >
        <div class="modal-box">
            <div class="flex flex-row items-center gap-2">
                <Icon 
                    :name="uiStore.confirmationModal?.type == ConfirmationType.DANGER ? 'mdi:alert-decagram' : 'mdi:information'" 
                    size="2rem" 
                    :class="uiStore.confirmationModal?.type == ConfirmationType.DANGER ? 'text-error' : 'text-primary'"
                />
                <Text :typography="Typography.H2">{{ uiStore.confirmationModal?.title }}</Text>
            </div>
            <Spacer height="h-4"/>
            <Text :typography="Typography.Label">{{ uiStore.confirmationModal?.message }}</Text>
            <Spacer height="h-6"/>
            <div class="flex flex-row gap-2 w-full">
                <Button 
                    :type="ButtonType.Secondary"
                    class="flex-1"
                    @click="uiStore.confirmationModal?.onCancel"
                >
                    Batalkan
                </Button>
                <Button
                    class="flex-1"
                    @click="uiStore.confirmationModal?.onConfirm"
                    :error="uiStore.confirmationModal?.type == ConfirmationType.DANGER"
                >
                    Ya
                </Button>
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
    import { Typography } from './attr/TextAttr';
    import { ButtonType } from './attr/ButtonAttr';
    import { ConfirmationType } from './attr/ConfirmationModalAttr';
    
    const uiStore = useUiStore()
</script>