import type { ConfirmationModalState, ConfirmationType } from "~/components/attr/ConfirmationModalAttr"
import { ToastType, type ToastState } from "~/components/attr/ToastAttr"

export const useUiStore = defineStore(
    'ui', 
    () => {
        const toast = ref<ToastState | null>(null)
        const confirmationModal = ref<ConfirmationModalState | null>(null)

        const $reset = () => {
            toast.value = null
            confirmationModal.value = null
        }

        const showToast = (message: string, type: ToastType) => {
            toast.value = {
                message,
                type
            }

            setTimeout(() => {
                toast.value =null
            }, 5000)
        }

        const hideToast = () => {
            toast.value = null
        }

        const confirm = (
            title: string,
            message: string,
            type: ConfirmationType,
            onConfirm: () => void,
            onCancel: () => void
        ) => {
            confirmationModal.value = {
                title,
                message,
                type,
                onConfirm,
                onCancel
            }
        }

        const hideConfirmationModal = () => {
            confirmationModal.value = null
        }

        return {
            toast,
            confirmationModal,
            confirm,
            hideConfirmationModal,
            showToast,
            hideToast,
            $reset
        }
  }, 
  {
    persist: true
  }
)