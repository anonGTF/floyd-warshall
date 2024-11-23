export type ToastState = {
    message: string,
    type: ToastType
}

export enum ToastType {
    SUCCESS,
    ERROR,
    DEFAULT
}