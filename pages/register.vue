<template>
    <div class="h-full w-full flex flex-row">
        <div class="bg-primary items-stretch w-0 lg:w-[60%]">
            <img 
                src="/images/auth-illustration.png" 
                alt="Basarnas Illustration"
                class="w-full h-full object-cover object-center"
            >
        </div>
        <div class="flex-1 flex justify-center items-center bg-primary lg:bg-white">
            <div class="lg:w-96 sm:w-[60%] w-full lg:mx-0 mx-2 px-6 py-12 bg-white border border-border-primary rounded-2xl">
                <Text :typography="Typography.H1">Registrasi Akun</Text>
                <Spacer height="h-2"/>
                <Text :typography="Typography.Body1">Masukkan data Anda pada website kami.</Text>
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
                    v-model="name"
                    placeholder="Masukkan nama Anda"
                    label="Nama"
                    :error-message="nameErrorMessage"
                    @enter="login"
                />
                <Spacer height="h-4" />
                <SelectGroup
                    v-model="role"
                    title="Pilih role"
                    :options="roleOptions"
                    :error-message="roleErrorMessage"
                />
                <template v-if="role == 'Admin' || role == 'Petugas'">
                    <Spacer height="h-4" />
                    <DropdownSelector
                        v-model="selectedOfficeIndex"
                        label="Kantor"
                        placeholder="Pilih kantor Anda"
                        :options="officeDropdownOptions"
                        :error-message="officeErrorMessage"
                    />
                </template>
                <Spacer height="h-4" />
                <TextField
                    v-model="password"
                    :type="passwordVisible ? 'text' : 'password'"
                    placeholder="Masukkan password Anda"
                    label="Password"
                    :error-message="passwordErrorMessage"
                    :trailing-icon="passwordVisible ? 'mdi:eye' : 'mdi:eye-off'"
                    @trailing-icon-click="togglePasswordVisibility"
                    @enter="login"
                />
                <Spacer height="h-4" />
                <TextField
                    v-model="confirmPassword"
                    :type="passwordVisible ? 'text' : 'password'"
                    placeholder="Konfirmasi password Anda"
                    label="Konfirmasi Password"
                    :error-message="confirmPasswordErrorMessage"
                    :trailing-icon="passwordVisible ? 'mdi:eye' : 'mdi:eye-off'"
                    @trailing-icon-click="togglePasswordVisibility"
                    @enter="login"
                />
                <Spacer height="h-12" />
                <Button 
                    :loading="isLoading"
                    full-width
                    @click="wrapWithConfirm"
                >
                    Register
                </Button>
                <Spacer height="h-10" />
                <div class="flex flex-row justify-center items-center">
                    <Text :typography="Typography.Body1" class="text-center">Sudah punya akun?</Text>
                    <Spacer height="h-1" />
                    <div class="-ms-4">
                        <Button 
                            :type="ButtonType.Ghost"
                            class="mx-auto flex hover:bg-transparent py-0"
                            underlined
                            @click="navigateTo('/')"
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ButtonType } from '~/components/attr/ButtonAttr';
    import { Typography } from '~/components/attr/TextAttr'
    import type { UserCredential } from 'firebase/auth';
    import { ToastType } from '~/components/attr/ToastAttr';
    import { ConfirmationType } from '~/components/attr/ConfirmationModalAttr'

    const email = ref('')
    const name = ref('')
    const role = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const isLoading = ref(false)
    const emailErrorMessage = ref('')
    const nameErrorMessage = ref('')
    const roleErrorMessage = ref('')
    const passwordErrorMessage = ref('')
    const confirmPasswordErrorMessage = ref('')
    const alertMessage = ref('')
    const passwordVisible = ref(false)
    const roleOptions = ["Reporter", "Petugas", "Admin"]
    const offices = useGetAllKantor()
    const officeDropdownOptions = computed(() => offices.value.map((office) => ({
        label: office.nama,
        data: office
    })))
    const selectedOfficeIndex = ref(-1)
    const officeErrorMessage = ref("")

    const userStore = useUserStore()
    const uiStore = useUiStore()

    const wrapWithConfirm = () => {
        uiStore.confirm(
            "Konfirmasi Pembuatan Akun",
            "Apakah Anda yakin data akun sudah sesuai?",
            ConfirmationType.INFO,
            async () => {
                uiStore.hideConfirmationModal()
                await register()
            },
            () => { uiStore.hideConfirmationModal() }
        )
    }

    const register = async () => {
        emailErrorMessage.value = ''
        nameErrorMessage.value = ''
        roleErrorMessage.value = ''
        passwordErrorMessage.value = ''  
        confirmPasswordErrorMessage.value = ''  
        alertMessage.value = ''

        // validate
        let isValid = true
        if (email.value.length === 0) {
            emailErrorMessage.value = 'Email tidak boleh kosong'
            isValid = false
        }
        if (!CONFIG.emailRegex.test(email.value)) {
            emailErrorMessage.value = 'Email harus valid (contoh: nama@gmail.com)'
            isValid = false
        }
        if (name.value.length === 0) {
            nameErrorMessage.value = 'Nama tidak boleh kosong'
            isValid = false
        }
        if (role.value.length === 0) {
            roleErrorMessage.value = 'Role tidak boleh kosong'
            isValid = false
        }
        if (password.value.length === 0) {
            passwordErrorMessage.value = 'Password tidak boleh kosong'
            isValid = false
        }
        if (confirmPassword.value != password.value) {
            confirmPassword.value = 'Konfirmasi password tidak sama dengan password di atas'
            isValid = false
        }
        if ((role.value == "Admin" || role.value == "Petugas") && selectedOfficeIndex.value == -1) {
            officeErrorMessage.value = 'Kantor harus diisi'
            isValid = false
        }

        if (!isValid) return

        isLoading.value = true
        const registrationResult = await useRegisterWithEmailAndPassword(email.value, password.value)
        if (isLeft(registrationResult)) {
            const error = unwrapEither(registrationResult) as string
            alertMessage.value = error
            isLoading.value = false
            return
        }
            
        const userCred = unwrapEither(registrationResult) as UserCredential
        const userRole = getRole()
        const userCreationResult = await useAddUser(
            userCred.user.uid,
            name.value,
            userRole,
            email.value,
            getOfficeId(),
            userRole == "reporter"
        )
        if (isLeft(userCreationResult)) {
            const error = unwrapEither(userCreationResult) as string
            alertMessage.value = error
            isLoading.value = false
            await useLogout()
            return
        }
        
        const userResult = await useGetUserById(userCred.user.uid)
        if (isLeft(userResult)) {
            const error = unwrapEither(userCreationResult) as string
            alertMessage.value = error
            isLoading.value = false
            await useLogout()
            return
        }

        const user = unwrapEither(userResult) as User
        if (!user.isVerified) {
            uiStore.showToast("Akun berhasil dibuat! tunggu sampai admin memverifikasi akun Anda.", ToastType.SUCCESS)
            isLoading.value = false
            await useLogout()
            return
        } else {
            userStore.user = user
            navigateTo("/reporter/home")
        }
    }

    const getRole = (): string => (role.value == "Admin") ? "admin" : (role.value == "Petugas") ? "officer" : "reporter"

    const getOfficeId = () => (role.value == "Admin" || role.value == "Petugas") ? offices.value[selectedOfficeIndex.value].id : ""

    const togglePasswordVisibility = () => { passwordVisible.value = !passwordVisible.value }
</script>