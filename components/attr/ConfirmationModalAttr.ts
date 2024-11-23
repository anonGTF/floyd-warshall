export type ConfirmationModalState = {
    title: string,
    message: string,
    type: ConfirmationType,
    onConfirm: () => void
    onCancel: () => void
}

export enum ConfirmationType { DANGER, INFO }