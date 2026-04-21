<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { fetchTangramList } from '@/entities/tangram/api/tangram'
import { Card } from '@/widgets/tangram-card'
import { useInfiniteScroll } from '@/shared/composables'
import { Loading } from '@/shared/ui'
import { trackEvent } from '@/shared/lib'
import { RouteNames } from '@/app/router/router-name'
import type { Tangram } from '@/shared/types'

const router = useRouter()
const { t } = useI18n()

const { items, loading, hasMore, totalCount, sentinelEl, load } = useInfiniteScroll<Tangram>({
  fetchFn: fetchTangramList,
  limit: 20,
})

onMounted(() => {
  load() // 최초 1페이지 로드
})

const handleClick = (item: Tangram, index: number) => {
  trackEvent('puzzle_selected', {
    tangram_id: item.id,
    key: item.key,
    difficulty: item.difficulty,
    card_position: index,
  })
  router.push({ name: RouteNames.TANGRAM_DETAIL, params: { id: item.id } })
}
</script>

<template>
  <div class="w-full h-full min-h-screen">
    <div class="relative flex flex-col items-center w-full">
      <p
        v-if="totalCount > 0"
        class="w-full max-w-[1400px] mx-auto px-2 md:px-4 mt-6 text-base text-neutral-800"
      >
        {{ t('tangram.list.totalCount', { count: totalCount }) }}
      </p>
      <div
        class="w-full max-w-[1400px] mx-auto h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-1 gap-2 p-2 md:p-4"
      >
        <template v-for="(item, index) of items" :key="item.id">
          <Card :item="item" @click="() => handleClick(item, index)" />
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
