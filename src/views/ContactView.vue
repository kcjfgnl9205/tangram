<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon, Input, Textarea, Button } from '@/components/ui'
import type { Contact } from '@/types'

const { t } = useI18n()

// 초기 payload
const payload = ref<Contact>({ email: '', title: '', contents: '' })
const errorMessage = ref<Contact>({ email: '', title: '', contents: '' })

// 폼 제출 핸들러
const handleSubmit = async () => {
  try {
    alert('준비중입니다.')
    // errorMessage.value = { email: '', title: '', contents: '' }

    // if (!payload.value.email) {
    //   errorMessage.value.email = t('contact.errorMessage.email')
    // }

    // if (!payload.value.title) {
    //   errorMessage.value.title = t('contact.errorMessage.title')
    // }

    // if (!payload.value.contents) {
    //   errorMessage.value.contents = t('contact.errorMessage.contents')
    // }

    // const someEmpty = Object.values(payload.value).some((v) => v.trim() === '')
    // if (someEmpty) throw new Error('모든 항목을 입력해주세요.')

    // // TODO: 실제 API 요청 처리
    // console.log('제출 데이터:', payload.value)

    // alert(t('contact.successMessage.success'))
    // payload.value = { email: '', title: '', contents: '' }
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- 상단 헤더 -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 text-white"
        >
          <Icon icon="contact-icon" class="w-8 h-8" />
        </div>
        <h1 class="text-neutral-900 mb-2 text-xl font-bold">
          {{ t('contact.title') }}
        </h1>
        <p class="text-neutral-500">
          {{ t('contact.description') }}
        </p>
      </div>

      <div class="shadow-lg p-12 border border-neutral-200 rounded-xl space-y-6 bg-white">
        <div>
          <div class="text-neutral-900 font-medium">
            {{ t('contact.card.header') }}
          </div>
          <div class="text-neutral-500 text-sm">
            {{ t('contact.card.description') }}
          </div>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <Input
            type="email"
            v-model="payload.email"
            :label="`${t('contact.card.email')}`"
            required
            icon="email-icon"
            placeholder="your@mail.com"
            class="w-full"
            :error="errorMessage.email"
          />

          <Input
            type="text"
            v-model="payload.title"
            :label="`${t('contact.card.title')}`"
            required
            :placeholder="`${t('contact.card.titlePlaceholder')}`"
            class="w-full"
            :error="errorMessage.title"
          />

          <Textarea
            v-model="payload.contents"
            :label="`${t('contact.card.contents')}`"
            :placeholder="`${t('contact.card.contentsPlaceholder')}`"
            required
            :error="errorMessage.contents"
          />

          <div class="w-full flex justify-center pt-2">
            <Button type="submit" variant="btn-blue" icon="email-icon">
              {{ t('contact.card.submit') }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
