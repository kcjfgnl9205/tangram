<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type Contact, CONTACT_STATUS_LABEL } from '@/types'
import { fetchContactList } from '@/api/contacts'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/router-name'

const { t } = useI18n()
const router = useRouter()
const contacts = ref<Contact[]>([])

onMounted(async () => {
  try {
    const response = await fetchContactList()
    if (!response) throw new Error('목록 조회 실패')
    contacts.value = response
  } catch (e) {
    console.error(e)
  }
})

const handleClick = (id: number) => {
  router.push({ name: RouteNames.ADMIN_CONTACTS_DETAIL, params: { id } })
}
</script>

<template>
  <div class="mx-auto py-8">
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold leading-tight">{{ t('admin.contact.title') }}</h2>
    </div>

    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <div class="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full leading-normal">
          <thead>
            <tr
              class="border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              <th class="p-2">id</th>
              <th class="p-2">email</th>
              <th class="p-2">title</th>
              <th class="p-2">status</th>
              <th class="p-2">created_at</th>

              <th class="p-2"></th>
            </tr>
          </thead>
          <tbody class="bg-white text-sm text-center border-b border-gray-200">
            <template v-for="contact of contacts" :key="contact.id">
              <tr
                @click="() => handleClick(contact.id)"
                class="hover:bg-neutral-100 cursor-pointer"
              >
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ contact.id }}
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ contact.email }}
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ contact.title }}
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ CONTACT_STATUS_LABEL[contact.status] }}
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ contact.created_at }}
                  </p>
                </td>

                <td class="p-2 flex gap-1">답변완료</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
