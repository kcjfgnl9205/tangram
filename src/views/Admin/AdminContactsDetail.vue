<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { type Contact, CONTACT_STATUS_LABEL } from '@/types'
import { fetchContactDetail } from '@/api/contacts'

const { t } = useI18n()
const route = useRoute()
const contact = ref<Contact | null>(null)

onMounted(async () => {
  try {
    const id = route.params.id

    const response = await fetchContactDetail(Number(id))
    if (!response) throw new Error('상세 조회 실패')
    contact.value = response
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="mx-auto py-8">
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-semibold leading-tight">{{ t('admin.contact.detail.title') }}</h2>
    </div>

    <div
      v-if="contact"
      class="shadow-lg p-12 border border-neutral-200 rounded-xl space-y-6 bg-white"
    >
      <div class="flex gap-2 items-center">
        <div class="w-24 font-semibold">id</div>
        <div>{{ contact.id }}</div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="w-24 font-semibold">상태</div>
        <div>{{ CONTACT_STATUS_LABEL[contact.status] }}</div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="w-24 font-semibold">이메일</div>
        <div>{{ contact.email }}</div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="w-24 font-semibold">제목</div>
        <div>{{ contact.title }}</div>
      </div>
      <div class="flex gap-2 items-center justify-start">
        <div class="w-24 font-semibold">내용</div>
        <div class="whitespace-pre">{{ contact.contents }}</div>
      </div>
    </div>
  </div>
</template>
