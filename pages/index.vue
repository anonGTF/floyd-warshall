<template>
    <div class="h-full w-full flex flex-row">
        <div class="flex-1 flex justify-center items-center bg-primary lg:bg-white">
            <div class="lg:w-96 sm:w-[60%] w-full lg:mx-0 mx-2 px-6 py-12 bg-white border border-border-primary rounded-2xl">
                <Text :typography="Typography.H1">Selamat Datang</Text>
                <Spacer height="h-2"/>
                <Text :typography="Typography.Body1">Login menggunakan akun yang telah terdaftar.</Text>
                <Spacer height="h-6"/>
                <div v-if="alertMessage != ''" class="bg-red-500 p-2 rounded-xl flex flex-row items-center text-white gap-2">
                    <Icon name="mdi:alert-circle-outline" size="24px" class="flex-none"/>
                    <Text :typography="Typography.Label" class="text-white">{{ alertMessage }}</Text>
                </div>
                <Spacer height="h-4"/>
                <TextField
                    v-model="email"
                    placeholder="Masukkan email Anda"
                    label="Email"
                    :error-message="emailErrorMessage"
                    @enter="login"
                />
                <Spacer height="h-4" />
                <TextField
                    v-model="password"
                    :type="passwordVisible ? 'text' : 'password'"
                    placeholder="Password"
                    label="Masukkan Password Anda"
                    :error-message="passwordErrorMessage"
                    :trailing-icon="passwordVisible ? 'mdi:eye' : 'mdi:eye-off'"
                    @trailing-icon-click="togglePasswordVisibility"
                    @enter="login"
                />
                <Spacer height="h-12" />
                <Button 
                    :loading="isLoading"
                    full-width
                    @click="login"
                >
                    Login
                </Button>
                <Spacer height="h-10" />
                <div class="flex flex-row justify-center items-center">
                    <Text :typography="Typography.Body1" class="text-center">Belum punya akun?</Text>
                    <Spacer height="h-1" />
                    <div class="-ms-4">
                        <Button 
                            :type="ButtonType.Ghost"
                            class="mx-auto flex hover:bg-transparent py-0"
                            underlined
                            @click="navigateTo('/register')"
                        >
                            Buat akun
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-primary items-stretch w-0 lg:w-[60%]">
            <img 
                src="/images/auth-illustration.png" 
                alt="Basarnas Illustration"
                class="w-full h-full object-cover object-center"
            >
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ButtonType } from '~/components/attr/ButtonAttr';
    import { Typography } from '~/components/attr/TextAttr'
    import type { UserCredential } from 'firebase/auth';

    const email = ref('')
    const password = ref('')
    const isLoading = ref(false)
    const emailErrorMessage = ref('')
    const passwordErrorMessage = ref('')
    const passwordVisible = ref(false)
    const alertMessage = ref('')

    const userStore = useUserStore()

    const login = async () => {
        emailErrorMessage.value = ''
        passwordErrorMessage.value = ''  
        alertMessage.value = ''

        // validate
        let isValid = true
        if (email.value.length === 0) {
            emailErrorMessage.value = 'Email tidak boleh kosong'
            isValid = false
        }
        if (password.value.length === 0) {
            passwordErrorMessage.value = 'Password tidak boleh kosong'
            isValid = false
        }

        if (!isValid) return

        // logging in
        isLoading.value = true
        const loginResult = await useLoginWithEmailAndPassword(email.value, password.value)
        if (isLeft(loginResult)) {
            const error = unwrapEither(loginResult) as string
            alertMessage.value = error
            isLoading.value = false
            return
        }
            
        const userCred = unwrapEither(loginResult) as UserCredential
        const userResult = await useGetUserById(userCred.user.uid)
        if (isLeft(userResult)) {
            const error = unwrapEither(userResult) as string
            alertMessage.value = error
            isLoading.value = false
            return
        }

        const user = unwrapEither(userResult) as User
        if (!user.isVerified) {
            isLoading.value = false
            alertMessage.value = "Pengguna belum terverifikasi"
            return
        } else {
            userStore.user = user
            const redirection = (user.role == "admin") ? "/admin/home" : (user.role == "officer") ? "/officer/home" : "/reporter/home"
            navigateTo(redirection)  
        }

    }

    const togglePasswordVisibility = () => { passwordVisible.value = !passwordVisible.value }
</script>