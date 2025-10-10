<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/router/router-name'
import { signUp } from '@/api/auth'
import { Button } from '@/components/ui'

const { t } = useI18n()
const email = ref('')
const password = ref('')
const router = useRouter()

const handleSubmit = async () => {
  try {
    const { data, error } = await signUp(email.value, password.value)
    if (error) throw error

    if (data) {
      alert('회원가입에 성공하였습니다.')
      router.push({ name: RouteNames.LOGIN })
    }
  } catch (e: any) {
    alert('회원가입 실패: ' + e.message)
    console.error(e)
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        {{ t('signUp.title') }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              type="email"
              name="email"
              required
              autocomplete="email"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              type="password"
              name="password"
              required
              autocomplete="current-password"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <Button type="submit" variant="btn-blue" class="w-full">
          {{ t('signUp.button.submit') }}
        </Button>
      </form>
    </div>
  </div>
</template>
