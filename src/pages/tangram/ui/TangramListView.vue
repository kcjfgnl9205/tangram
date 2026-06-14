<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { fetchTangramList, deleteTangrams } from '@/entities/tangram/api/tangram'
import { useAuthStore } from '@/entities/user'
import { Card } from '@/widgets/tangram-card'
import { useInfiniteScroll } from '@/shared/composables'
import { Button, Loading } from '@/shared/ui'
import { useToastStore } from '@/shared/stores/toast.store'
import { trackEvent, canCreateTangramToday, DAILY_CREATE_LIMIT } from '@/shared/lib'
import { RouteNames } from '@/app/router/router-name'
import type { Tangram } from '@/shared/types'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)
const toast = useToastStore()

const { items, loading, hasMore, totalCount, sentinelEl, load } = useInfiniteScroll<Tangram>({
  fetchFn: fetchTangramList,
  limit: 20,
})

onMounted(() => {
  load() // 최초 1페이지 로드
})

// === 선택/삭제 모드 (로그인 사용자 전용) ===
const selectMode = ref(false)
const selectedIds = ref<Set<number>>(new Set())
const deleting = ref(false)
const selectedCount = computed(() => selectedIds.value.size)

const enterSelectMode = () => {
  selectMode.value = true
  selectedIds.value = new Set()
}

const exitSelectMode = () => {
  selectMode.value = false
  selectedIds.value = new Set()
}

const toggleSelect = (id: number) => {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

const handleDelete = async () => {
  const ids = [...selectedIds.value]
  if (ids.length === 0 || deleting.value) return
  if (!confirm(t('tangram.list.deleteConfirm', { count: ids.length }))) return

  try {
    deleting.value = true
    await deleteTangrams(ids)
    items.value = items.value.filter((item) => !selectedIds.value.has(item.id))
    totalCount.value = Math.max(0, totalCount.value - ids.length)
    toast.add(t('tangram.list.deleteSuccess', { count: ids.length }), 'success')
    exitSelectMode()
  } catch (e) {
    console.error(e)
    toast.add(t('tangram.list.deleteFail'), 'error')
  } finally {
    deleting.value = false
  }
}

const handleClick = (item: Tangram, index: number) => {
  // 선택 모드에서는 이동 대신 선택 토글
  if (selectMode.value) {
    toggleSelect(item.id)
    return
  }

  trackEvent('puzzle_selected', {
    tangram_id: item.id,
    key: item.key,
    difficulty: item.difficulty,
    card_position: index,
  })
  router.push({ name: RouteNames.TANGRAM_DETAIL, params: { id: item.id } })
}

const goPlayground = () => {
  // 하루 생성 개수 제한 (localStorage 기반) — 초과 시 진입 차단
  if (!canCreateTangramToday()) {
    toast.add(t('tangram.playground.save.limitReached', { limit: DAILY_CREATE_LIMIT }), 'error')
    return
  }
  router.push({ name: RouteNames.TANGRAM_CREATE })
}
</script>

<template>
  <div class="w-full h-full min-h-screen">
    <div class="relative flex flex-col items-center w-full">
      <div
        class="w-full max-w-[1400px] mx-auto px-2 md:px-4 mt-6 flex items-center justify-between gap-2"
      >
        <p v-if="totalCount > 0" class="text-body-md text-neutral-800">
          {{ t('tangram.list.totalCount', { count: totalCount }) }}
        </p>
        <span v-else />

        <div class="flex items-center gap-2">
          <!-- 로그인 사용자 전용: 선택/삭제 -->
          <template v-if="isLoggedIn">
            <template v-if="selectMode">
              <Button variant="btn-red" :disabled="selectedCount === 0 || deleting" @click="handleDelete">
                {{ t('tangram.list.delete', { count: selectedCount }) }}
              </Button>
              <Button variant="btn-default" @click="exitSelectMode">
                {{ t('tangram.list.cancel') }}
              </Button>
            </template>
            <Button v-else variant="btn-default" @click="enterSelectMode">
              {{ t('tangram.list.select') }}
            </Button>
          </template>

          <Button variant="btn-blue" @click="goPlayground">
            {{ t('tangram.list.createMyOwn') }}
          </Button>
        </div>
      </div>
      <div
        class="w-full max-w-[1400px] mx-auto h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-1 gap-2 p-2 md:p-4"
      >
        <template v-for="(item, index) of items" :key="item.id">
          <Card
            :item="item"
            :selectable="selectMode"
            :selected="selectedIds.has(item.id)"
            @click="() => handleClick(item, index)"
          />
        </template>
      </div>

      <!-- 센티널: 뷰포트 진입 시 다음 페이지 로드 -->
      <div v-if="hasMore" ref="sentinelEl" class="w-full h-16 flex items-center justify-center">
        <Loading v-if="loading" />
      </div>

      <footer class="mt-12"></footer>
    </div>
  </div>
</template>
