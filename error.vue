<script setup lang="ts">
import { Typography } from './components/attr/TextAttr';
import type { NuxtError } from '#app'
import { Vue3Lottie } from 'vue3-lottie'

defineProps({
  error: Object as () => NuxtError
})

const role = useUserStore().$state.user?.role

const handleError = async () => {
  switch (role) {
    case "admin":
      clearError({ redirect: '/admin/home' })
      break

    case "officer":
      clearError({ redirect: '/officer/home' })
      break

    case "reporter":
      clearError({ redirect: '/reporter/home' })
      break
    
    default:
      clearError({ redirect: '/' })
      break
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="w-full h-full flex flex-col bg-background-blue-light justify-center items-center">
      <client-only>
        <Vue3Lottie
          animationLink="https://lottie.host/8f69d0e7-ef42-44f3-a5c7-0d15671b66e1/EVA8iwNCfj.json"
          :height="200"
          :width="400"
        />
      </client-only>
      <Text :typography="Typography.H1">Terjadi Kesalahan!</Text>
      <Spacer height="h-2"/>
      <Text :typography="Typography.Body1">{{ error?.statusCode }} - {{ error?.message }}</Text>
      <Spacer height="h-10"/>
      <Button 
        class=" w-48"
        @click="handleError"
      >
        Kembali ke Beranda
      </Button>
    </div>
  </NuxtLayout>
</template>