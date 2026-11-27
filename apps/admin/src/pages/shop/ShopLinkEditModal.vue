<script setup lang="ts">
import { computed, ref } from 'vue'
import { useModalStore } from '@/shared/stores/modal.store'
import { createShopLink, updateShopLink } from '@/entities/shop/api/shop.api'
import { uploadToR2, validateImageFile } from '@/shared/lib/r2'
import { getResourceUrl } from '@/shared/lib/storage'
import type { ShopLink } from '@/shared/types/types'

interface Props {
  /** 없으면 새로 추가 */
  link?: ShopLink
  onSuccess?: () => void
}
const props = defineProps<Props>()
const modalStore = useModalStore()

const isEdit = computed(() => Boolean(props.link))

const name = ref(props.link?.name ?? '')
const url = ref(props.link?.url ?? '')
// R2 에 올린 경로이거나(업로드) 외부 절대 주소(기존 데이터)다
const logoUrl = ref(props.link?.logo_url ?? '')
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

/** 상대 경로는 CDN 주소로 바꿔서 미리보기한다 */
const logoPreview = computed(() =>
  !logoUrl.value
    ? ''
    : /^https?:\/\//i.test(logoUrl.value)
      ? logoUrl.value
      : getResourceUrl(logoUrl.value),
)

const handlePickFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const invalid = validateImageFile(file)
  if (invalid) {
    error.value = invalid
    input.value = ''
    return
  }

  error.value = null
  uploading.value = true
  try {
    const { fileName } = await uploadToR2(file)
    logoUrl.value = fileName
  } catch (err) {
    error.value = err instanceof Error ? err.message : '업로드에 실패했습니다'
  } finally {
    uploading.value = false
    // 같은 파일을 다시 골라도 change 가 발생하도록 비운다
    input.value = ''
  }
}

const clearLogo = () => {
  logoUrl.value = ''
}
const description = ref(props.link?.description ?? '')
const isAffiliate = ref(props.link?.is_affiliate ?? false)
const isActive = ref(props.link?.is_active ?? true)
const sortOrder = ref(props.link?.sort_order ?? 0)

const isLoading = ref(false)
const error = ref<string | null>(null)

// DB 의 CHECK 제약과 같은 조건을 미리 본다 — 저장을 눌러야 알게 되면 불편하다.
// https 만 받는다: http 링크는 https 페이지에서 혼합 콘텐츠로 차단된다.
const HTTPS_RE = /^https:\/\//i

const validate = (): string | null => {
  if (!name.value.trim()) return '이름을 입력해주세요'
  if (name.value.trim().length > 40) return '이름은 40자까지 입력할 수 있습니다'
  if (!HTTPS_RE.test(url.value.trim())) return '링크는 https:// 로 시작해야 합니다'
  if (description.value.trim().length > 120) return '설명은 120자까지 입력할 수 있습니다'
  return null
}

const handleSave = async () => {
  if (uploading.value) return
  error.value = validate()
  if (error.value) return

  isLoading.value = true
  try {
    const payload = {
      name: name.value.trim(),
      url: url.value.trim(),
      logo_url: logoUrl.value.trim() || null,
      description: description.value.trim() || null,
      is_affiliate: isAffiliate.value,
      is_active: isActive.value,
      sort_order: Number(sortOrder.value) || 0,
    }

    const result = props.link
      ? await updateShopLink(props.link.id, payload)
      : await createShopLink(payload)

    if (result.error) {
      error.value = result.error
      return
    }
    props.onSuccess?.()
    modalStore.onClose()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Save failed'
    console.error('handleSave error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => modalStore.onClose()
</script>

<template>
  <div class="flex justify-center gap-2 min-w-96">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div
        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center"
      >
        <h2 class="text-heading-md text-gray-900">
          {{ isEdit ? '구매처 편집' : '구매처 추가' }}
        </h2>
        <button class="text-gray-500 hover:text-gray-700 transition-colors" @click="handleClose">
          ✕
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {{ error }}
        </div>

        <div>
          <label for="shop-name" class="block text-sm font-medium text-gray-700 mb-1">
            이름 <span class="text-red-500">*</span>
          </label>
          <input
            id="shop-name"
            v-model="name"
            type="text"
            maxlength="40"
            placeholder="쿠팡"
            class="input-base"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label for="shop-url" class="block text-sm font-medium text-gray-700 mb-1">
            링크 <span class="text-red-500">*</span>
          </label>
          <input
            id="shop-url"
            v-model="url"
            type="url"
            placeholder="https://www.coupang.com/..."
            class="input-base"
            :disabled="isLoading"
          />
        </div>

        <div>
          <span class="block text-sm font-medium text-gray-700 mb-1">로고 이미지</span>

          <div class="flex items-center gap-3">
            <span
              class="grid place-items-center shrink-0 w-14 h-14 border border-gray-200 rounded bg-gray-50 overflow-hidden"
            >
              <img
                v-if="logoPreview"
                :src="logoPreview"
                alt="로고 미리보기"
                class="w-full h-full object-contain"
              />
              <span v-else class="text-xs text-gray-400">없음</span>
            </span>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                :disabled="isLoading || uploading"
                @click="fileInput?.click()"
              >
                {{ uploading ? '업로드 중…' : logoUrl ? '이미지 변경' : '이미지 선택' }}
              </button>
              <button
                v-if="logoUrl && !uploading"
                type="button"
                class="px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                :disabled="isLoading"
                @click="clearLogo"
              >
                제거
              </button>
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            class="sr-only"
            @change="handlePickFile"
          />
          <p class="mt-1.5 text-xs text-gray-500">
            PNG · JPG · WEBP · SVG, 최대 2MB. 비우면 이름 첫 글자로 표시됩니다.
          </p>
        </div>

        <div>
          <label for="shop-desc" class="block text-sm font-medium text-gray-700 mb-1">설명</label>
          <input
            id="shop-desc"
            v-model="description"
            type="text"
            maxlength="120"
            placeholder="원목 칠교 · 유아용"
            class="input-base"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label for="shop-order" class="block text-sm font-medium text-gray-700 mb-1">
            노출 순서
          </label>
          <input
            id="shop-order"
            v-model.number="sortOrder"
            type="number"
            class="input-base"
            :disabled="isLoading"
          />
          <p class="mt-1 text-xs text-gray-500">작을수록 위에 보입니다.</p>
        </div>

        <div class="flex items-center">
          <input
            id="shop-affiliate"
            v-model="isAffiliate"
            type="checkbox"
            class="w-4 h-4 rounded border-gray-300 cursor-pointer"
            :disabled="isLoading"
          />
          <label for="shop-affiliate" class="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
            제휴 링크
          </label>
        </div>
        <div class="-mt-2 space-y-1.5 text-xs text-gray-500">
          <p>쿠팡 파트너스·알리 어필리에이트 링크라면 <strong>반드시 켜야 합니다.</strong></p>
          <p>켜면 목록의 이 항목에 「제휴」 배지가 붙고, 페이지 상단에 아래 고지가 노출됩니다.</p>
          <p class="p-2 bg-gray-50 border border-gray-200 rounded text-gray-600">
            이 페이지에는 제휴 링크가 포함되어 있습니다. 「제휴」 표시가 붙은 링크를 통해 구매하면
            구매 금액의 일부가 수수료로 운영자에게 지급됩니다. 구매자가 추가로 부담하는 금액은
            없습니다.
          </p>
          <p>
            공정거래위원회 추천·보증 심사지침상 <strong>의무 고지</strong>입니다. 제휴 링크인데
            꺼두면 미표시로 제재 대상이 될 수 있습니다.
          </p>
        </div>

        <div class="flex items-center">
          <input
            id="shop-active"
            v-model="isActive"
            type="checkbox"
            class="w-4 h-4 rounded border-gray-300 cursor-pointer"
            :disabled="isLoading"
          />
          <label for="shop-active" class="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
            사용자 페이지에 노출
          </label>
        </div>
      </div>

      <div
        class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end"
      >
        <button
          :disabled="isLoading"
          class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          @click="handleClose"
        >
          취소
        </button>
        <button
          :disabled="isLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="handleSave"
        >
          {{ isLoading ? '저장 중...' : '저장' }}
        </button>
      </div>
    </div>
  </div>
</template>
