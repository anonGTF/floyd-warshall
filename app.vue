<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ConfirmationDialog/>
  <Toast/>
</template>

<script setup lang="ts">
  const router = useRouter()
  const route = useRoute()
  const user = useCurrentUser()

  onMounted(() => {
    watch(user, (user, prevUser) => {
      if (prevUser && !user) {
        router.push('/')
      } else if (user && typeof route.query.redirect === 'string') {
        router.push(route.query.redirect)
      }
    })
  })
</script>