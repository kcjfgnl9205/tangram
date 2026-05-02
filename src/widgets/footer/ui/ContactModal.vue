<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { createContact } from '@/entities/contact/api/contacts'
import { ButtonIcon, Button, Input, Textarea } from '@/shared/ui'
import type { ContactUpdate } from '@/shared/types'

const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()

const payload = ref<ContactUpdate>({ email: '', title: '', contents: '' })
const errorMessage = ref<ContactUpdate>({ email: '', title: '', contents: '' })
const submitting = ref(false)

const handleSubmit = async () => {
  errorMessage.value = { email: '', title: '', contents: '' }

  if (!payload.value.email) errorMessage.value.email = t('contact.errorMessage.email')
  if (!payload.value.title) errorMessage.value.title = t('contact.errorMessage.title')
  if (!payload.value.contents) errorMessage.value.contents = t('contact.errorMessage.contents')

  const someEmpty = Object.values(payload.value).some((v) => v.trim() === '')
  if (someEmpty) return

  try {
    submitting.value = true
    const response = await createContact(payload.value)
    if (!response) throw new Error('Error')

    alert(t('contact.successMessage.success'))
    payload.value = { email: '', title: '', contents: '' }
    emit('close')
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div
    class="bg-white shadow-2xl flex flex-col overflow-hidden w-full h-full md:w-[min(92vw,560px)] md:h-auto md:max-h-[90vh] md:rounded-2xl"
    role="dialog"
    :aria-label="t('contact.title')"
  >
    <!-- 헤더 -->
    <div class="flex items-center justify-between px-5 h-14 border-b border-neutral-200">
      <h2 class="text-base font-semibold">{{ t('contact.title') }}</h2>
      <ButtonIcon
        icon="close-icon"
        size="md"
        :aria-label="t('contact.close')"
        @click="emit('close')"
      />
    </div>

    <!-- 본문 -->
    <div class="flex-1 overflow-y-auto px-6 py-6 space-y-5">
      <p class="text-sm text-neutral-500">{{ t('contact.description') }}</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <Input
          v-model="payload.email"
          type="email"
          :label="t('contact.card.email')"
          required
          placeholder="your@mail.com"
          class="w-full"
          :error="errorMessage.email"
        />
        <Input
          v-model="payload.title"
          type="text"
          :label="t('contact.card.title')"
          required
          :placeholder="t('contact.card.titlePlaceholder')"
          class="w-full"
          :error="errorMessage.title"
        />
        <Textarea
          v-model="payload.contents"
          :label="t('contact.card.contents')"
          :placeholder="t('contact.card.contentsPlaceholder')"
          required
          :error="errorMessage.contents"
        />

        <div class="w-full flex justify-center pt-2">
          <Button type="submit" variant="btn-blue" icon="email-icon" :is-loading="submitting">
            {{ t('contact.card.submit') }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
