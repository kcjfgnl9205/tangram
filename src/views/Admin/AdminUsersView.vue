<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Profile } from '@/types'
import { getAllProfiles } from '@/api/auth'

const { t } = useI18n()
const users = ref<Profile[]>([])

onMounted(async () => {
  try {
    const response = await getAllProfiles()
    if (!response) throw new Error('유저 조회 실패')
    users.value = response
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="mx-auto py-8">
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold leading-tight">{{ t('admin.users.title') }}</h2>
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
              <th class="p-2">status</th>
              <th class="p-2">created_at</th>

              <th class="p-2"></th>
            </tr>
          </thead>
          <tbody class="bg-white text-sm text-center border-b border-gray-200">
            <template v-for="user of users" :key="user.id">
              <tr>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.id }}
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.email }}
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.status }}
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.created_at }}
                  </p>
                </td>

                <td class="p-2 flex gap-1"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
