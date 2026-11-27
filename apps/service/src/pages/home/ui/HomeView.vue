<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { fetchTangramList, useTangramTitle } from '@/entities/tangram'
import { Button, Icon } from '@/shared/ui'
import { getResourceUrl, trackEvent } from '@/shared/lib'
import { RouteNames } from '@/app/router/router-name'
import type { Tangram } from '@/shared/types'

const { t } = useI18n()
const router = useRouter()
const { getTitle } = useTangramTitle()

/**
 * 랜딩에서 가장 설득력 있는 것은 설명이 아니라 도안 그 자체다.
 * 공식 도안 10개를 가져와 그대로 깐다 (5열 × 2줄).
 */
const popular = ref<Tangram[]>([])

onMounted(async () => {
  try {
    const { list } = await fetchTangramList(1, 10, { official: true })
    popular.value = list
  } catch (e) {
    // 랜딩이 목록 조회 실패로 통째로 비지 않도록 조용히 넘긴다
    console.warn('인기 도안 조회 실패:', e)
  }
})

const goPuzzle = (item: Tangram, index: number) => {
  trackEvent('puzzle_selected', {
    tangram_id: item.id,
    key: item.key ?? '',
    difficulty: item.difficulty,
    card_position: index,
  })
  router.push({ name: RouteNames.TANGRAM_DETAIL, params: { id: item.id } })
}

const faqKeys = ['signup', 'age', 'print', 'create', 'school'] as const
</script>

<template>
  <div>
    <!-- 히어로 — 설명보다 제품을 먼저 보여준다 -->
    <section class="max-w-[1120px] mx-auto px-5 py-14 md:py-20">
      <div class="flex flex-wrap items-center gap-10 md:gap-14">
        <div class="flex-[1_1_400px] min-w-0">
          <span
            class="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-sub border border-line text-body-xs font-semibold text-ink-2"
          >
            {{ t('home.hero.badge') }}
          </span>

          <h1
            class="mt-4 text-[clamp(2rem,5.2vw,3.125rem)] font-bold leading-[1.28] tracking-[-0.035em] text-ink whitespace-pre-line"
          >
            {{ t('home.hero.title') }}
          </h1>

          <p class="mt-4 max-w-[34ch] text-body-lg text-ink-2">
            {{ t('home.hero.lead') }}
          </p>

          <div class="flex flex-wrap items-center gap-2.5 mt-8">
            <Button
              variant="btn-blue"
              class="!px-7 !py-3.5"
              @click="() => router.push({ name: RouteNames.TANGRAM_LIST })"
            >
              {{ t('home.hero.ctaPlay') }}
            </Button>
            <Button
              variant="btn-default"
              class="!px-7 !py-3.5 !bg-white !border !border-line-strong"
              @click="
                () => router.push({ name: RouteNames.TANGRAM_LIST, query: { mode: 'print' } })
              "
            >
              {{ t('home.hero.ctaPrint') }}
            </Button>
          </div>

          <p class="mt-4 text-body-sm text-ink-3">{{ t('home.hero.note') }}</p>
        </div>

        <!-- 실제 플레이 화면. 왼쪽이 맞춰야 할 모양, 오른쪽이 일곱 조각 -->
        <div class="flex-[1_1_460px] min-w-0">
          <figure
            class="m-0 rounded-[14px] shadow-[0_1px_2px_rgba(22,24,29,0.05),0_18px_40px_-18px_rgba(22,24,29,0.22)]"
          >
            <svg
              viewBox="0 0 560 352"
              class="block w-full h-auto"
              role="img"
              :aria-label="t('home.hero.shotAlt')"
            >
              <rect x="0.5" y="0.5" width="559" height="351" rx="13" fill="#fff" stroke="#E8EAED" />
              <path d="M0 14 A14 14 0 0 1 14 0 H546 A14 14 0 0 1 560 14 V32 H0 Z" fill="#FAFBFC" />
              <line x1="0" y1="32" x2="560" y2="32" stroke="#E8EAED" />
              <circle cx="20" cy="16" r="4" fill="#E0E3E7" />
              <circle cx="35" cy="16" r="4" fill="#E0E3E7" />
              <circle cx="50" cy="16" r="4" fill="#E0E3E7" />

              <g fill="#fff" stroke="#E8EAED">
                <rect x="18" y="46" width="30" height="30" rx="8" />
                <rect x="54" y="46" width="30" height="30" rx="8" />
                <rect x="90" y="46" width="30" height="30" rx="8" />
                <rect x="126" y="46" width="30" height="30" rx="8" />
              </g>
              <g
                stroke="#868D96"
                stroke-width="1.6"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M36,55 L28,61 L36,67" />
                <path d="M76,57 a7 7 0 1 0 2 5 M76,53 v5 h-5" />
                <path d="M98,61 c3,-4 9,-7 14,0 c-5,7 -11,4 -14,0 z" />
                <path d="M141,56 a5 5 0 1 0 0.01 0 M141,48 v3 M141,71 v3 M133,61 h-3 M152,61 h-3" />
              </g>

              <rect x="22" y="88" width="238" height="238" rx="12" fill="#FAFBFC" />
              <g transform="translate(69,135) scale(1.44)">
                <path
                  d="M20,92 L20,50 L34,36 L34,20 L48,34 L62,34 L76,20 L76,36 L90,50 L90,92 L68,92 L68,64 L42,64 L42,92 Z"
                  fill="#16181D"
                />
              </g>

              <g stroke="#fff" stroke-width="1.5" stroke-linejoin="round">
                <polygon
                  points="0,0 80,0 40,40"
                  fill="#F4714E"
                  transform="translate(292,104) rotate(-12)"
                />
                <polygon
                  points="0,0 40,40 0,80"
                  fill="#2194FF"
                  transform="translate(452,96) rotate(14)"
                />
                <polygon
                  points="40,0 40,40 0,40"
                  fill="#FBBF24"
                  transform="translate(300,186) rotate(26)"
                />
                <polygon
                  points="20,0 20,40 0,20"
                  fill="#8B7FE8"
                  transform="translate(400,178) rotate(-22)"
                />
                <polygon
                  points="0,20 20,0 40,20 20,40"
                  fill="#34D399"
                  transform="translate(452,198) rotate(8)"
                />
                <polygon
                  points="20,0 0,20 40,20"
                  fill="#F472B6"
                  transform="translate(298,264) rotate(-8)"
                />
                <polygon
                  points="0,20 20,0 60,0 40,20"
                  fill="#84CC16"
                  transform="translate(386,276) rotate(5)"
                />
              </g>
            </svg>
          </figure>
        </div>
      </div>
    </section>

    <!-- 제품을 보여준다 -->
    <section v-if="popular.length > 0" class="bg-surface-sub border-y border-line">
      <div class="max-w-[1120px] mx-auto px-5 py-16 md:py-[76px]">
        <div class="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <h2 class="text-heading-lg font-bold tracking-[-0.035em] text-ink">
              {{ t('home.popular.title') }}
            </h2>
            <p class="mt-2 text-body-md text-ink-3">{{ t('home.popular.sub') }}</p>
          </div>
          <Button
            variant="btn-default"
            class="!bg-white !border !border-line-strong"
            @click="() => router.push({ name: RouteNames.TANGRAM_LIST })"
          >
            {{ t('home.popular.seeAll') }}
          </Button>
        </div>

        <ul class="grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 list-none p-0 m-0">
          <li v-for="(item, index) in popular" :key="item.id">
            <a
              href="#"
              class="block rounded-card border border-line bg-surface overflow-hidden transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click.prevent="goPuzzle(item, index)"
            >
              <span class="grid place-items-center aspect-[4/3] p-4 bg-surface-sub">
                <img
                  :src="getResourceUrl(item.thumbnail_url)"
                  :alt="getTitle(item)"
                  width="320"
                  height="240"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-contain"
                />
              </span>
              <span class="block px-3.5 py-2.5 text-body-md font-semibold truncate text-ink">
                {{ getTitle(item) }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- 타깃 분리 — 쓰는 사람에 따라 필요한 화면이 다르다 -->
    <section class="max-w-[1120px] mx-auto px-5 py-16 md:py-[76px]">
      <div class="mb-8">
        <span class="text-body-sm font-bold text-primary">{{ t('home.modes.eyebrow') }}</span>
        <h2 class="mt-3 text-heading-lg font-bold tracking-[-0.035em] text-ink">
          {{ t('home.modes.title') }}
        </h2>
        <p class="mt-2 text-body-md text-ink-3">{{ t('home.modes.sub') }}</p>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <div
          v-for="mode in ['kid', 'adult'] as const"
          :key="mode"
          class="rounded-panel border border-line bg-surface p-7 md:p-8"
        >
          <span
            class="grid place-items-center w-[42px] h-[42px] mb-4 rounded-lg bg-surface-sub border border-line text-ink"
          >
            <Icon :icon="mode === 'kid' ? 'logo-icon' : 'print-icon'" class="w-5 h-5" />
          </span>

          <h3 class="text-heading-sm font-bold text-ink">{{ t(`home.modes.${mode}.title`) }}</h3>
          <p class="mt-1.5 text-body-sm text-ink-3">{{ t(`home.modes.${mode}.desc`) }}</p>

          <ul class="grid gap-2.5 my-5 p-0 list-none text-body-sm text-ink-2">
            <li v-for="n in 3" :key="n" class="flex gap-2.5 items-start">
              <Icon icon="check-icon" class="w-4 h-4 shrink-0 mt-1 text-primary" />
              {{ t(`home.modes.${mode}.point${n}`) }}
            </li>
          </ul>

          <Button
            :variant="mode === 'kid' ? 'btn-blue' : 'btn-default'"
            :class="mode === 'adult' ? '!bg-white !border !border-line-strong' : ''"
            @click="
              () =>
                router.push({
                  name: RouteNames.TANGRAM_LIST,
                  query: mode === 'adult' ? { mode: 'print' } : {},
                })
            "
          >
            {{ t(`home.modes.${mode}.cta`) }}
          </Button>
        </div>
      </div>
    </section>

    <!-- 이용 방법 -->
    <section id="how" class="bg-surface-sub border-y border-line scroll-mt-20">
      <div class="max-w-[1120px] mx-auto px-5 py-16 md:py-[76px]">
        <div class="mb-8">
          <span class="text-body-sm font-bold text-primary">{{ t('home.how.eyebrow') }}</span>
          <h2 class="mt-3 text-heading-lg font-bold tracking-[-0.035em] text-ink">
            {{ t('home.how.title') }}
          </h2>
        </div>

        <ol class="grid gap-5 md:grid-cols-3 list-none p-0 m-0">
          <li v-for="n in 3" :key="n">
            <div
              class="grid place-items-center aspect-[16/10] p-5 mb-4 rounded-card border border-line bg-surface"
            >
              <Icon :icon="`step-${n}-icon`" class="w-full h-full" />
            </div>
            <span class="block text-body-sm font-bold tracking-wider text-primary">
              {{ String(n).padStart(2, '0') }}
            </span>
            <h3 class="mt-1 text-heading-sm font-bold text-ink">
              {{ t(`home.how.step${n}.title`) }}
            </h3>
            <p class="mt-1 text-body-sm text-ink-3">{{ t(`home.how.step${n}.desc`) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 자주 묻는 질문 -->
    <section id="faq" class="max-w-[1120px] mx-auto px-5 py-16 md:py-[76px] scroll-mt-20">
      <h2 class="mb-8 text-heading-lg font-bold tracking-[-0.035em] text-ink">
        {{ t('home.faq.title') }}
      </h2>

      <div class="max-w-[760px] border-t border-line">
        <details
          v-for="(key, i) in faqKeys"
          :key="key"
          :open="i === 0"
          class="border-b border-line group"
        >
          <summary
            class="flex items-center justify-between gap-4 py-5 text-body-md font-semibold cursor-pointer list-none text-ink [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
          >
            {{ t(`home.faq.${key}.q`) }}
            <Icon
              icon="plus-icon"
              class="w-4.5 h-4.5 shrink-0 text-ink-3 transition-transform group-open:rotate-45"
            />
          </summary>
          <p class="pb-6 text-body-sm text-ink-2">{{ t(`home.faq.${key}.a`) }}</p>
        </details>
      </div>
    </section>

    <!-- 마무리 -->
    <section class="bg-surface-sub border-t border-line">
      <div class="max-w-[1120px] mx-auto px-5 py-20 md:py-24 text-center">
        <h2 class="text-heading-lg font-bold tracking-[-0.035em] text-ink">
          {{ t('home.closing.title') }}
        </h2>
        <p class="mt-2.5 text-body-md text-ink-3">{{ t('home.closing.sub') }}</p>
        <Button
          variant="btn-blue"
          class="!px-7 !py-3.5 mt-7 mx-auto"
          @click="() => router.push({ name: RouteNames.TANGRAM_LIST })"
        >
          {{ t('home.closing.cta') }}
        </Button>
      </div>
    </section>
  </div>
</template>
