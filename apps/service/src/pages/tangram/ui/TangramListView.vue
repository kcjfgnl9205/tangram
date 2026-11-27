<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import {
  fetchTangramList,
  fetchTangramCounts,
  deleteTangrams,
  incrementTangramDownload,
  useTangramTitle,
  type TangramListFilter,
} from '@/entities/tangram'
import { useAuthStore } from '@/entities/user'
import { Card } from '@/widgets/tangram-card'
import { useInfiniteScroll } from '@/shared/composables'
import { Button, Icon, Loading } from '@/shared/ui'
import { useToastStore } from '@/shared/stores/toast.store'
import {
  trackEvent,
  canCreateTangramToday,
  DAILY_CREATE_LIMIT,
  downloadTangramsPdf,
} from '@/shared/lib'
import { RouteNames } from '@/app/router/router-name'
import type { Tangram } from '@/shared/types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)
const toast = useToastStore()

/* ---------------- 상태 ---------------- */
type ViewMode = 'play' | 'print'
type TabId = 'official' | 'community'
type LevelId = 'all' | 'easy' | 'normal' | 'hard'

const TABS = ['official', 'community'] as const
const MODES = ['play', 'print'] as const
const LEVELS = ['all', 'easy', 'normal', 'hard'] as const

const LEVEL_RANGE: Record<Exclude<LevelId, 'all'>, [number, number]> = {
  easy: [1, 2],
  normal: [3, 3],
  hard: [4, 5],
}

const MODE_KEY = 'tangram_list_mode'

/** 쿼리값이 허용 목록에 있을 때만 쓴다 — 주소창은 사용자가 고칠 수 있다 */
const fromQuery = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
  const raw = route.query[key]
  const value = Array.isArray(raw) ? raw[0] : raw
  return allowed.includes(value as T) ? (value as T) : fallback
}

const tab = ref<TabId>(fromQuery('tab', TABS, 'official'))
const level = ref<LevelId>(fromQuery('level', LEVELS, 'all'))

// 모드만 예외: 쿼리에 없으면 지난 방문의 선택(localStorage)을 따른다
const mode = ref<ViewMode>(
  route.query.mode
    ? fromQuery('mode', MODES, 'play')
    : ((localStorage.getItem(MODE_KEY) as ViewMode | null) ?? 'play'),
)

watch(mode, (value) => localStorage.setItem(MODE_KEY, value))

/**
 * 탭·필터·모드를 주소에 적어 둔다.
 * 새로고침해도 보던 화면이 유지되고, 링크를 그대로 공유할 수 있다.
 * 기본값은 주소를 지저분하게 만들지 않도록 생략한다.
 */
watch(
  [tab, level, mode],
  () => {
    const query: Record<string, string> = {}
    if (tab.value !== 'official') query.tab = tab.value
    if (level.value !== 'all') query.level = level.value
    if (mode.value !== 'play') query.mode = mode.value

    // replace — 칩을 누를 때마다 뒤로가기 기록이 쌓이면 안 된다
    router.replace({ query })
  },
  { immediate: true },
)

/** 탭과 무관한 조건 — 두 탭의 개수를 같은 기준으로 센다 */
const sharedFilter = computed<Omit<TangramListFilter, 'official'>>(() => ({
  difficulty: level.value === 'all' ? undefined : LEVEL_RANGE[level.value],
}))

const filter = computed<TangramListFilter>(() => ({
  official: tab.value === 'official',
  ...sharedFilter.value,
}))

// 선택하지 않은 탭에도 개수를 보여준다 — 어느 쪽에 얼마나 있는지 먼저 알 수 있게
const counts = ref<{ official: number; community: number } | null>(null)

const loadCounts = async () => {
  try {
    counts.value = await fetchTangramCounts(sharedFilter.value)
  } catch (e) {
    // 개수는 보조 정보다. 실패해도 목록은 그대로 보여준다
    console.warn('탭 개수 조회 실패:', e)
    counts.value = null
  }
}

watch(sharedFilter, loadCounts, { immediate: true })

const { items, loading, hasMore, totalCount, sentinelEl, load, reset } = useInfiniteScroll<Tangram>(
  {
    fetchFn: (page, limit) => fetchTangramList(page, limit, filter.value),
    limit: 20,
  },
)

onMounted(load)

// 탭이나 필터가 바뀌면 처음부터 다시 받는다
watch(filter, () => {
  selectedIds.value = new Set()
  reset()
  load()
})

/* ---------------- 인쇄 모드 선택 ---------------- */
const selectedIds = ref<Set<number>>(new Set())
const selectedCount = computed(() => selectedIds.value.size)

const toggleSelect = (id: number) => {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

const clearSelection = () => (selectedIds.value = new Set())

watch(mode, (value) => {
  if (value === 'play') clearSelection()
})

const { getTitle } = useTangramTitle()
const printing = ref(false)

/** 고른 도안을 PDF 한 파일로 묶는다. 도안 1장당 문제 1쪽 + 맨 뒤에 잘라 쓰는 칠교판 */
const handlePrintSelected = async () => {
  if (printing.value) return
  const picked = items.value.filter((item) => selectedIds.value.has(item.id))
  if (picked.length === 0) return

  try {
    printing.value = true
    const { printed, failed } = await downloadTangramsPdf(
      picked.map((item) => ({ title: getTitle(item), jsonUrl: item.json_url })),
      t('tangram.list.printFilename'),
    )

    if (failed.length > 0) {
      toast.add(
        t('tangram.list.printPartial', { count: printed, failed: failed.length }),
        'warning',
        {
          description: failed.join(', '),
        },
      )
    } else {
      toast.add(t('tangram.list.printSuccess', { count: printed }), 'success')
    }

    // 성공한 건만 다운로드 수를 올린다 (브라우저당 1시간 throttle)
    picked
      .filter((item) => !failed.includes(getTitle(item)))
      .forEach((item) => incrementTangramDownload(item.id))

    clearSelection()
  } catch (e) {
    console.error(e)
    toast.add(t('tangram.list.printFail'), 'error')
  } finally {
    printing.value = false
  }
}

/* ---------------- 삭제 (로그인 사용자) ---------------- */
const deleting = ref(false)

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
    clearSelection()
    loadCounts()
  } catch (e) {
    console.error(e)
    toast.add(t('tangram.list.deleteFail'), 'error')
  } finally {
    deleting.value = false
  }
}

/* ---------------- 이동 ---------------- */
const handleCardClick = (item: Tangram, index: number) => {
  if (mode.value === 'print') {
    toggleSelect(item.id)
    return
  }
  trackEvent('puzzle_selected', {
    tangram_id: item.id,
    key: item.key ?? '',
    difficulty: item.difficulty,
    card_position: index,
  })
  router.push({ name: RouteNames.TANGRAM_DETAIL, params: { id: item.id } })
}

/**
 * 카드의 인쇄 버튼 — 목록에서 바로 한 장짜리 PDF 를 뽑는다.
 * 묶음 인쇄와 같은 경로를 쓰므로 결과물(문제 1쪽 + 칠교판)도 같다.
 */
const printingId = ref<number | null>(null)

const handleCardPrint = async (item: Tangram) => {
  if (printingId.value !== null) return
  const name = getTitle(item)

  try {
    printingId.value = item.id
    await downloadTangramsPdf(
      [{ title: name, jsonUrl: item.json_url }],
      t('tangram.list.printOneFilename', { name }),
    )
    incrementTangramDownload(item.id)
    toast.add(t('tangram.list.printSuccess', { count: 1 }), 'success')
  } catch (e) {
    console.error(e)
    toast.add(t('tangram.list.printFail'), 'error')
  } finally {
    printingId.value = null
  }
}

const goPlayground = () => {
  if (!canCreateTangramToday()) {
    toast.add(t('tangram.playground.save.limitReached', { limit: DAILY_CREATE_LIMIT }), 'error')
    return
  }
  router.push({ name: RouteNames.TANGRAM_CREATE })
}
</script>

<template>
  <div class="w-full max-w-[1120px] mx-auto px-5 pb-16">
    <!-- 제목은 화면에서 감추되 마크업으로는 남긴다 —
         탭이 제목 역할을 대신하지만 h1 이 사라지면 SEO·스크린리더가 손해를 본다 -->
    <h1 class="sr-only">{{ t('tangram.list.title') }}</h1>

    <!-- 탭이 페이지의 첫 요소다. 모드 전환과 한 줄을 나눠 쓴다 -->
    <div class="flex items-center justify-between gap-4 flex-wrap pt-8 pb-5">
      <div class="flex gap-1.5" role="tablist" :aria-label="t('tangram.list.tabsLabel')">
        <button
          v-for="id in TABS"
          :key="id"
          type="button"
          role="tab"
          :aria-selected="tab === id"
          class="inline-flex items-center gap-2 h-10 px-4 rounded-full text-body-lg font-bold cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="
            tab === id ? 'bg-ink text-white' : 'text-ink-3 hover:text-ink hover:bg-surface-sub'
          "
          @click="tab = id"
        >
          {{ t(`tangram.list.tab.${id}`) }}
          <span
            v-if="counts"
            class="text-body-sm font-semibold tabular-nums"
            :class="tab === id ? 'text-white/70' : 'text-ink-3'"
          >
            {{ counts[id] }}
          </span>
        </button>
      </div>

      <div
        class="inline-flex p-[3px] gap-0.5 rounded-lg bg-surface-sub border border-line"
        role="group"
        :aria-label="t('tangram.list.modeLabel')"
      >
        <button
          v-for="id in MODES"
          :key="id"
          type="button"
          :aria-pressed="mode === id"
          class="inline-flex items-center gap-1.5 min-h-[34px] px-3 rounded-md text-body-sm font-semibold cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          :class="mode === id ? 'bg-white text-ink shadow-sm' : 'text-ink-3 hover:text-ink-2'"
          @click="mode = id"
        >
          <Icon :icon="id === 'play' ? 'logo-icon' : 'print-icon'" class="w-4 h-4" />
          {{ t(`tangram.list.mode.${id}`) }}
        </button>
      </div>
    </div>

    <!-- 필터와 동작이 한 줄을 나눠 쓴다.
         칩은 테두리형이다 — 채움은 탭 하나만 써야 위계가 선다 -->
    <div
      class="flex items-center justify-between gap-x-6 gap-y-3 flex-wrap pb-5 border-b border-line"
    >
      <div
        class="flex gap-1.5 items-center flex-wrap"
        role="group"
        :aria-label="t('tangram.list.levelLabel')"
      >
        <button
          v-for="id in LEVELS"
          :key="id"
          type="button"
          :aria-pressed="level === id"
          class="inline-flex items-center gap-1.5 min-h-[34px] px-3.5 rounded-full border text-body-sm cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="
            level === id
              ? 'bg-surface-sub text-ink border-ink font-semibold'
              : 'bg-surface text-ink-2 border-line font-medium hover:border-line-strong'
          "
          @click="level = id"
        >
          <Icon v-if="id !== 'all'" :icon="`level-${id}-icon`" class="w-3.5 h-3.5" />
          {{ t(`tangram.level.${id}`) }}
        </button>
      </div>

      <div class="flex items-center gap-2 ml-auto">
        <!-- 로그인 사용자 전용 삭제 — 인쇄 모드의 선택을 그대로 쓴다 -->
        <Button
          v-if="isLoggedIn && mode === 'print' && selectedCount > 0"
          variant="btn-red"
          size="sm"
          :disabled="deleting"
          @click="handleDelete"
        >
          {{ t('tangram.list.delete', { count: selectedCount }) }}
        </Button>
        <!-- 만든 도안은 '모두의 도안' 으로 들어가므로 그 탭에서만 보여준다.
             헤더 CTA 를 뺀 뒤로 여기가 만들기로 가는 유일한 입구라 강조색을 쓴다 -->
        <Button v-if="tab === 'community'" variant="btn-blue" size="sm" @click="goPlayground">
          <Icon icon="plus-icon" class="w-4 h-4" />
          {{ t('tangram.list.create') }}
        </Button>
      </div>
    </div>

    <!-- 목록 -->
    <div class="grid gap-3.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pt-5">
      <Card
        v-for="(item, index) of items"
        :key="item.id"
        :item="item"
        :selectable="mode === 'print'"
        :selected="selectedIds.has(item.id)"
        :printing="printingId === item.id"
        @click="handleCardClick(item, index)"
        @print="handleCardPrint(item)"
      />
    </div>

    <p v-if="!loading && items.length === 0" class="py-20 text-center text-body-md text-ink-3">
      {{ t('tangram.list.empty') }}
    </p>

    <!-- 센티널: 뷰포트 진입 시 다음 페이지 로드 -->
    <div v-if="hasMore" ref="sentinelEl" class="w-full h-16 flex items-center justify-center">
      <Loading v-if="loading" />
    </div>

    <!-- 선택 바 — 인쇄 모드의 핵심 -->
    <Transition
      enter-active-class="animate-toast-in-bottom"
      leave-active-class="animate-toast-out-bottom"
    >
      <div
        v-if="mode === 'print' && selectedCount > 0"
        class="sticky bottom-4 z-40 mt-6 flex items-center justify-between gap-3 flex-wrap px-4 py-3 rounded-card bg-ink text-white shadow-lg"
      >
        <span class="text-body-md font-semibold">
          {{ t('tangram.list.selectedCount', { count: selectedCount }) }}
        </span>
        <div class="flex gap-2 flex-wrap">
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-body-sm text-white/80 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
            @click="clearSelection"
          >
            {{ t('tangram.list.clearSelection') }}
          </button>
          <Button variant="btn-blue" :is-loading="printing" @click="handlePrintSelected">
            {{ t('tangram.list.printSelected') }}
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>
