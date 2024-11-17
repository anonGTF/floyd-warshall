import type { Report } from '~/models/report/Report'

export const useReportStore = defineStore(
    'report', 
    () => {
      const reportData = ref<Report | null>(null)
  
      const $reset = () => {
        reportData.value = null
      }
  
      return {
        reportData,
        $reset
      }
    }, 
    {
      persist: true
    }
  )