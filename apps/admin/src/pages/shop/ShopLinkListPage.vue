<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useModalStore } from '@/shared/stores/modal.store'
import { fetchShopLinks, deleteShopLink, updateShopLink } from '@/entities/shop/api/shop.api'
import { getResourceUrl } from '@/shared/lib/storage'
import type { ShopLink } from '@/shared/types/types'
import ShopLinkEditModal from './ShopLinkEditModal.vue'

const modalStore = useModalStore()

/** 업로드된 로고는 R2 상대 경로라 CDN 주소로 풀어야 보인다 */
const logoSrc = (link: ShopLink) => {
  const raw = link.logo_url?.trim()
  if (!raw) return ''
  return /^https?:\/\//i.test(raw) ? raw : getResourceUrl(raw)
}

const links = ref<ShopLink[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

async function load() {
  isLoading.value = true
  error.value = null
  const result = await fetchShopLinks()
  if (result.error) error.value = result.error
  else links.value = result.links
  isLoading.value = false
}

onMounted(load)

const openEdit = (link?: ShopLink) => {
  modalStore.onOpen(ShopLinkEditModal, { link, onSuccess: load })
}

const handleDelete = async (link: ShopLink) => {
  if (!confirm(`'${link.name}' 을(를) 삭제하시겠습니까?`)) return
  const result = await deleteShopLink(link.id)
  if (result.error) {
    alert(`삭제 실패: ${result.error}`)
    return
  }
  load()
}

// 목록에서 바로 켜고 끈다 — 편집 모달까지 열 일이 아니다
const toggleActive = async (link: ShopLink) => {
  const next = !link.is_active
  const result = await updateShopLink(link.id, { is_active: next })
  if (result.error) {
    alert(`변경 실패: ${result.error}`)
    return
  }
  link.is_active = next
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-start justify-between gap-4 flex-wrap mb-6">
      <div>
        <h1 class="text-heading-lg text-gray-900">구매처 관리</h1>
        <p class="mt-1 text-sm text-gray-500">
          사용자 페이지의 '칠교 사러 가기' 에 노출되는 목록입니다.
        </p>
      </div>
      <button
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        @click="openEdit()"
      >
        + 구매처 추가
      </button>
    </div>

    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
      {{ error }}
    </div>

    <p v-if="isLoading" class="py-16 text-center text-gray-500">불러오는 중…</p>

    <p v-else-if="links.length === 0" class="py-16 text-center text-gray-500">
      등록된 구매처가 없습니다. '구매처 추가' 로 시작하세요.
    </p>

    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th scope="col" class="table-header w-16">순서</th>
            <th scope="col" class="table-header w-16">로고</th>
            <th scope="col" class="table-header text-left">이름</th>
            <th scope="col" class="table-header text-left">링크</th>
            <th scope="col" class="table-header w-20">제휴</th>
            <th scope="col" class="table-header w-20">노출</th>
            <th scope="col" class="table-header w-32">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="link in links"
            :key="link.id"
            class="border-b border-gray-200 hover:bg-gray-50"
            :class="link.is_active ? '' : 'opacity-50'"
          >
            <td class="table-cell text-center text-sm tabular-nums">{{ link.sort_order }}</td>
            <td class="table-cell">
              <img
                v-if="logoSrc(link)"
                :src="logoSrc(link)"
                :alt="`${link.name} 로고`"
                class="w-8 h-8 object-contain mx-auto"
              />
              <span v-else class="block text-center text-gray-400">—</span>
            </td>
            <td class="table-cell">
              <div class="font-medium">{{ link.name }}</div>
              <div v-if="link.description" class="text-xs text-gray-500">
                {{ link.description }}
              </div>
            </td>
            <td class="table-cell max-w-xs">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline text-sm break-all"
              >
                {{ link.url }}
              </a>
            </td>
            <td class="table-cell text-center text-sm">
              <span v-if="link.is_affiliate" class="text-amber-600 font-medium">제휴</span>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="table-cell text-center">
              <button
                type="button"
                class="text-sm font-medium transition-colors"
                :class="link.is_active ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'"
                :aria-pressed="link.is_active"
                @click="toggleActive(link)"
              >
                {{ link.is_active ? '노출 중' : '숨김' }}
              </button>
            </td>
            <td class="table-cell">
              <div class="flex gap-2 justify-center">
                <button class="btn-primary text-xs py-2" @click="openEdit(link)">수정</button>
                <button class="btn-danger text-xs py-2" @click="handleDelete(link)">삭제</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
