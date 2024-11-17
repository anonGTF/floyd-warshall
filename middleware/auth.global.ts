export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser()
  const role = useUserStore().$state.user?.role

  if (!user && !CONFIG.whitelistedPages.some(page => to.path == page)) {
    return navigateTo({
      path: '/',
      query: {
        redirect: to.fullPath,
      },
    })
  }

  if (user && to.path == "/") {
    switch (role) {
      case "reporter":
        return navigateTo("/reporter/home")
      
      case "officer":
        return navigateTo("/officer/home")

      case "admin":
        return navigateTo("/admin/home")
      
      default:
        break
    }
  }

  if (
    (role == "reporter" && !to.path.startsWith("/reporter/")) ||
    (role == "officer" && !to.path.startsWith("/officer/")) ||
    (role == "admin" && !to.path.startsWith("/admin/"))
  ) {
    abortNavigation("Halaman tidak bisa diakses")
  }
})