import { useI18n } from 'vue-i18n'
import { copyToClipboard } from '@/shared/lib/utils/utils'
import { useToastStore } from '@/shared/stores'

export function useCopyLink() {
  const { t } = useI18n()
  const toastStore = useToastStore()

  const handleCopy = async (link: string, message?: string) => {
    try {
      await copyToClipboard(link)
      const msg = message || t('common.copy.success')
      toastStore.add(msg, 'success', { position: 'bottom' })
    } catch (e) {
      console.error(e)
      toastStore.add(t('common.copy.error'), 'error')
    }
  }

  return { handleCopy }
}
