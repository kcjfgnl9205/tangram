<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchShopLinks, getShopLogoUrl } from '@/entities/shop'
import { Icon, Loading } from '@/shared/ui'
import { trackEvent } from '@/shared/lib'
import type { ShopLink } from '@/shared/types'

const { t } = useI18n()

const links = ref<ShopLink[]>([])
const loading = ref(true)
const failed = ref(false)

onMounted(async () => {
  try {
    links.value = await fetchShopLinks()
  } catch (e) {
    console.error(e)
    failed.value = true
  } finally {
    loading.value = false
  }
})

// 제휴 링크가 하나라도 있으면 경제적 이해관계를 고지해야 한다 (공정위 추천·보증 심사지침).
// 링크에서 멀리 떨어진 푸터가 아니라 목록 바로 위에 둔다.
const hasAffiliate = computed(() => links.value.some((link) => link.is_affiliate))

const handleClick = (link: ShopLink) => {
  trackEvent('shop_link_clicked', { shop_id: link.id, shop_name: link.name })
}
</script>

<template>
  <div class="w-full max-w-[760px] mx-auto px-5 pt-11 pb-16">
    <h1 class="text-heading-lg font-bold tracking-[-0.035em] text-ink">
      {{ t('shop.title') }}
    </h1>
    <p class="mt-2 text-body-md text-ink-3">{{ t('shop.lead') }}</p>

    <div v-if="loading" class="py-20">
      <Loading />
    </div>

    <p v-else-if="failed" class="py-20 text-center text-body-md text-ink-3">
      {{ t('shop.loadFail') }}
    </p>

    <p v-else-if="links.length === 0" class="py-20 text-center text-body-md text-ink-3">
      {{ t('shop.empty') }}
    </p>

    <template v-else>
      <p
        v-if="hasAffiliate"
        class="flex gap-2.5 items-start mt-7 px-4 py-3 rounded-card bg-surface-sub border border-line text-body-xs text-ink-2 leading-relaxed"
      >
        <Icon icon="alert-icon" class="w-4 h-4 shrink-0 mt-0.5 text-ink-3" />
        {{ t('shop.affiliateNotice') }}
      </p>

      <ul class="grid gap-3 mt-5 list-none p-0">
        <li v-for="link in links" :key="link.id">
          <a
            :href="link.url"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            class="flex items-center gap-4 p-4 rounded-card border border-line bg-surface transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="handleClick(link)"
          >
            <!-- 로고가 없으면 이름 첫 글자로 대체한다 -->
            <span
              class="grid place-items-center shrink-0 w-12 h-12 rounded-lg bg-surface-sub border border-line overflow-hidden"
            >
              <img
                v-if="getShopLogoUrl(link)"
                :src="getShopLogoUrl(link)"
                alt=""
                width="48"
                height="48"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-contain"
              />
              <span v-else class="text-body-lg font-bold text-ink-3" aria-hidden="true">
                {{ link.name.trim().charAt(0) }}
              </span>
            </span>

            <span class="min-w-0 flex-1">
              <span class="flex items-center gap-1.5 min-w-0">
                <span class="text-body-md font-semibold text-ink truncate">{{ link.name }}</span>
                <!-- 맨 위 안내만으로는 어느 링크가 제휴인지 알 수 없다.
                     지침도 표시가 링크에 가까이 있기를 요구하므로 항목마다 붙인다 -->
                <span
                  v-if="link.is_affiliate"
                  class="shrink-0 px-1.5 py-0.5 rounded border border-line bg-surface-sub text-[11px] font-semibold text-ink-3"
                  :title="t('shop.affiliateItemTitle')"
                >
                  {{ t('shop.affiliateBadge') }}
                </span>
              </span>
              <span v-if="link.description" class="block mt-0.5 text-body-sm text-ink-3 truncate">
                {{ link.description }}
              </span>
            </span>

            <Icon icon="link-icon" class="w-4 h-4 shrink-0 text-ink-3" />
            <span class="sr-only">{{ t('shop.opensNewTab') }}</span>
          </a>
        </li>
      </ul>

      <p class="mt-6 text-body-xs text-ink-3">{{ t('shop.disclaimer') }}</p>
    </template>
  </div>
</template>
