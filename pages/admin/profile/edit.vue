<template>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Edit Profil Pengguna</Text>
        <Spacer height="h-8"/>
        <div class="flex justify-center items-center">
            <label for="profile-picture" class="relative group cursor-pointer">
                <div class="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <Icon v-if="profilePictureSource == ''" name="mdi:account" class="text-gray-500" size="4rem"/>
                    <img v-else :src="profilePictureSource" alt="Foto Profil Pengguna">
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white text-sm font-medium">Ganti Foto Profil</span>
                </div>
                <div class="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <Icon name="mdi:pencil" class="text-white"/>
                </div>
            </label>
            <input 
                id="profile-picture" 
                type="file" 
                class="hidden" 
                accept="image/*"
                @change="setProfilePicture"
            />
        </div>
        <Spacer height="h-4"/>
        <TextField
            v-model="name"
            :error-message="nameErrorMessage"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap Anda"
        />
        <Spacer height="h-4"/>
        <TextField
            v-model="phoneNumber"
            :error-message="phoneNumberErrorMessage"
            label="Nomor Telepon"
            placeholder="Masukkan nomor telepon Anda"
        />
        <Spacer height="h-4"/>
        <TextField
            v-model="email"
            :error-message="emailErrorMessage"
            label="Email"
            placeholder="Masukkan email Anda"
        />
        <Spacer height="h-4"/>
        <TextField
            v-model="password"
            label="Ganti Password"
            placeholder="Masukkan apabila ingin ganti password Anda"
            :type="passwordVisible ? 'text' : 'password'"
            :trailing-icon="passwordVisible ? 'mdi:eye' : 'mdi:eye-off'"
            @trailing-icon-click="togglePasswordVisibility"
        />
        <Spacer height="h-6"/>
        <Button 
            full-width
            :loading="isLoading"
            @click="wrapWithConfirmation"
        >
            Simpan
        </Button>
    </div>
</template>

<script setup lang="ts">
    import { ConfirmationType } from '~/components/attr/ConfirmationModalAttr';
    import { Typography } from '~/components/attr/TextAttr';
    import { ToastType } from '~/components/attr/ToastAttr';

    definePageMeta({
        layout: "admin"
    })

    const router = useRouter()
    const uiStore = useUiStore()
    const userStore = useUserStore()
    const profilePicture = ref<File | undefined | null>(null)
    const profilePictureSource = ref("")
    const name = ref("")
    const nameErrorMessage = ref("")
    const phoneNumber = ref("")
    const phoneNumberErrorMessage = ref("")
    const email = ref("")
    const emailErrorMessage = ref("")
    const password = ref("")
    const passwordVisible = ref(false)
    const isLoading = ref(false)
    const alertErrorMessage = ref("")

    const togglePasswordVisibility = () => { passwordVisible.value = !passwordVisible.value }

    const wrapWithConfirmation = () => {
        uiStore.confirm(
            "Simpan Perubahan Data Akun",
            "Apakah Anda yakin ingin mengubah data akun?",
            ConfirmationType.INFO,
            async () => {
                uiStore.hideConfirmationModal()
                await save()
            },
            () => { uiStore.hideConfirmationModal() }
        )
    }

    const save = async () => {
        isLoading.value = true
        nameErrorMessage.value = ""
        phoneNumberErrorMessage.value = ""
        emailErrorMessage.value = ""
        alertErrorMessage.value = ""

        try {
            let isValid = true
            if (name.value == "") {
                nameErrorMessage.value = "Nama tidak boleh kosong"
                isValid = false
            }

            if (email.value == "" || !CONFIG.emailRegex.test(email.value)) {
                emailErrorMessage.value = "Email tidak boleh kosong dan harus valid"
                isValid = false
            }

            if (phoneNumber.value == "") {
                phoneNumberErrorMessage.value = "Nomor hp tidak boleh kosong"
                isValid = false
            }

            if (!isValid) return

            if (userStore.user == null) return
            let updatedUser = userStore.user

            if (profilePicture.value != null) {
                const profileResult = await useUploadProfilePicture(profilePicture.value)
                if (isLeft(profileResult)) {
                    alertErrorMessage.value = unwrapEither(profileResult)
                    return
                } else {
                    updatedUser = {
                        ...updatedUser,
                        profilePicture: unwrapEither(profileResult)
                    }
                }
            }

            if (email.value != userStore.user.email) {
                const emailResult = await useUpdateEmail(email.value)
                if (isLeft(emailResult)) {
                    alertErrorMessage.value = unwrapEither(emailResult)
                    return
                } else {
                    updatedUser = {
                        ...updatedUser,
                        email: email.value
                    }
                }
            }

            if (password.value != "") {
                const passwordResult = await useUpdatePassword(password.value)
                if (isLeft(passwordResult)) {
                    alertErrorMessage.value = unwrapEither(passwordResult)
                    return
                }
            }

            updatedUser = {
                ...updatedUser,
                name: name.value,
                phoneNumber: phoneNumber.value
            }

            const userResult = await useUpdateUser(updatedUser)
            if (isLeft(userResult)) {
                alertErrorMessage.value = unwrapEither(userResult)
                return
            } else {
                userStore.user = updatedUser
                uiStore.showToast("Profil berhasil diperbarui", ToastType.SUCCESS)
                router.back()
            }
        } catch (error) {
            alertErrorMessage.value = error as string   
        } finally {
            isLoading.value = false
        }
    }

    const setProfilePicture = (event: Event) => {
        const payload = event.target as HTMLInputElement
        const file = payload.files?.item(0)

        if (file && file instanceof File) {
            profilePicture.value = file
    
            const reader = new FileReader()
            reader.onload = (e) => {
                profilePictureSource.value = e.target?.result as string
            }
            reader.readAsDataURL(file as Blob)
        }
    }

    onMounted(() => {
        name.value = userStore.user?.name ?? ""
        phoneNumber.value = userStore.user?.phoneNumber ?? ""
        email.value = userStore.user?.email ?? ""
        profilePictureSource.value = userStore.user?.profilePicture ?? ""
    })
</script>