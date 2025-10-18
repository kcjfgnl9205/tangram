<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useMetaStore } from '@/stores'
import { Button, Input } from '@/components/ui'
import {
  createTranslationMetaData,
  deleteTranslationMetaData,
  updateTranslationMetaData,
} from '@/api/metadata'
import type { TranslationMeta, TranslationMetaInsert } from '@/types'

const { t } = useI18n()
const metaStore = useMetaStore()
const { translations: _translations } = storeToRefs(metaStore)
const payload = ref<TranslationMetaInsert>({ key: '', ko: '', en: '', ja: '' })
const translations = ref<(TranslationMeta & { isEdit: boolean })[]>(
  _translations.value.map((item) => ({ ...item, isEdit: false })),
)
const tmpTranslation = ref<(TranslationMeta & { isEdit: boolean }) | null>(null)

const handleAddMeta = async () => {
  try {
    const someEmpty = Object.values(payload.value).some((v) => v.trim() === '')
    if (someEmpty) throw new Error('빈 필드가 있음.')

    const response = await createTranslationMetaData(payload.value)
    if (!response) throw new Error('등록 실패')

    payload.value = { key: '', ko: '', en: '', ja: '' }
    translations.value.unshift({ ...response, isEdit: false })
  } catch (e) {
    console.error(e)
  }
}

const handleDeleteMeta = async (id: number) => {
  try {
    if (confirm('삭제하시겠습니까?')) {
      const response = await deleteTranslationMetaData(id)
      if (!response) throw new Error('삭제 실패')
      translations.value = translations.value.filter((item) => item.id !== id)
    }
  } catch (e) {
    console.error(e)
  }
}

const handleEditToggleMode = async (id: number, isClear = false) => {
  try {
    const item = translations.value.find((t) => t.id === id)
    if (!item) throw new Error('데이터를 찾을 수 없습니다.')

    if (!item.isEdit) {
      // 편집 모드로 전환할 때 → 기존 데이터 백업
      tmpTranslation.value = { ...item }
      item.isEdit = true
    } else if (isClear && tmpTranslation.value) {
      // 취소 (isClear = true) → 기존 데이터로 복원
      Object.assign(item, tmpTranslation.value) // tmp 값으로 덮어쓰기
      item.isEdit = false
      tmpTranslation.value = null
    } else {
      // 저장 완료 후 편집 종료
      const { isEdit, ...rest } = item
      const response = await updateTranslationMetaData(id, rest)
      if (!response) throw new Error('수정 실패')

      item.isEdit = false
      tmpTranslation.value = null
    }
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="mx-auto py-8">
    <div class="flex justify-between">
      <h2 class="text-2xl font-semibold leading-tight">{{ t('admin.metadata.title') }}</h2>
    </div>

    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <div class="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full leading-normal">
          <thead>
            <tr
              class="border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              <th class="p-2">id</th>
              <th class="p-2">key</th>
              <th class="p-2">ko</th>
              <th class="p-2">en</th>
              <th class="p-2">ja</th>
              <th class="p-2"></th>
            </tr>
          </thead>
          <tbody class="bg-white text-sm text-center border-b border-gray-200">
            <tr>
              <td class="p-2">
                <p class="text-gray-900 whitespace-no-wrap"></p>
              </td>
              <td class="p-2">
                <Input v-model="payload.key" class="w-full" />
              </td>
              <td class="p-2">
                <Input v-model="payload.ko" class="w-full" />
              </td>
              <td class="p-2">
                <Input v-model="payload.en" class="w-full" />
              </td>
              <td class="p-2">
                <Input v-model="payload.ja" class="w-full" />
              </td>
              <td class="p-2">
                <Button variant="btn-blue" @click="handleAddMeta">추가</Button>
              </td>
            </tr>
            <template v-for="translation of translations" :key="translation.id">
              <tr>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ translation.id }}
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    <Input
                      v-model="translation.key"
                      :disabled="!translation.isEdit"
                      class="w-full"
                    />
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    <Input
                      v-model="translation.ko"
                      :disabled="!translation.isEdit"
                      class="w-full"
                    />
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    <Input
                      v-model="translation.en"
                      :disabled="!translation.isEdit"
                      class="w-full"
                    />
                  </p>
                </td>
                <td class="p-2">
                  <p class="text-gray-900 whitespace-no-wrap">
                    <Input
                      v-model="translation.ja"
                      :disabled="!translation.isEdit"
                      class="w-full"
                    />
                  </p>
                </td>
                <td class="p-2 flex gap-1">
                  <template v-if="translation.isEdit">
                    <Button
                      variant="btn-red"
                      @click="() => handleEditToggleMode(translation.id, true)"
                    >
                      취소
                    </Button>
                    <Button variant="btn-blue" @click="() => handleEditToggleMode(translation.id)">
                      완료
                    </Button>
                  </template>
                  <template v-else>
                    <Button variant="btn-red" @click="() => handleDeleteMeta(translation.id)">
                      삭제
                    </Button>
                    <Button variant="btn-blue" @click="() => handleEditToggleMode(translation.id)">
                      수정
                    </Button>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
