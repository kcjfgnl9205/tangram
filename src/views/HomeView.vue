<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui'
import {
  PolyominoIcon,
  TangramIcon,
  PolyominoMainIcon,
  TangramMainIcon,
  BeautifulDesignIcon,
  CreativeExpressionIcon,
  DailyChallengesIcon,
  EducationalIcon,
  InteractiveIcon,
  ProgressiveDifficultyIcon,
} from '@/assets/icon/home'
import { RouteNames } from '@/router/router-name'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div className="">
    <section className="relative flex items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-16 h-16 rotate-12">
          <svg viewBox="0 0 100 100" fill="#FF6B6B">
            <polygon points="50,0 100,100 0,100" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-20 h-20 -rotate-45">
          <svg viewBox="0 0 100 100" fill="#4ECDC4">
            <rect width="100" height="100" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 rotate-45">
          <svg viewBox="0 0 100 100" fill="#FFE66D">
            <polygon points="0,50 50,0 100,50 50,100" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16">
          <svg viewBox="0 0 100 100" fill="#95E1D3">
            <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" />
          </svg>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-block px-4 py-2 rounded-full mb-4 border border-neutral-300">
            <span className="text-sm text-neutral-500">{{ t('home.area1.text1') }}</span>
          </div>
          <h1 className="text-4xl md:text-6xl tracking-tight">{{ t('home.area1.text2') }}</h1>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto">
            {{ t('home.area1.text3') }}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto mt-16">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10"
          />
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://cdn.puzmu.com/main.png"
              alt="Tangram puzzle preview"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 px-4 bg-neutral-100/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-neutral-900">
            {{ t('home.area2.text1') }}
          </h2>
          <p className="text-lg text-neutral-500">
            {{ t('home.area2.text2') }}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div
            className="flex flex-col gap-6 rounded-xl border p-8 hover:shadow-xl transition-shadow"
          >
            <div className="w-32 h-32 mx-auto">
              <TangramMainIcon />
            </div>
            <div className="flex items-center gap-2 mb-4 justify-center">
              <TangramIcon />
              <h3 className="text-2xl">{{ t('home.area2.text3') }}</h3>
            </div>
            <p className="text-neutral-500 text-center leading-relaxed">
              {{ t('home.area2.text4') }}
            </p>
            <div class="flex justify-center">
              <Button
                variant="btn-black"
                class="px-8 !rounded-4xl"
                @click="() => router.push({ name: RouteNames.TANGRAM_LIST })"
              >
                {{ t('home.area2.text7') }}
              </Button>
            </div>
          </div>

          <div
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-8 hover:shadow-xl transition-shadow"
          >
            <div className="w-32 h-32 mx-auto">
              <PolyominoMainIcon />
            </div>
            <div className="flex items-center gap-2 mb-4 justify-center">
              <PolyominoIcon />
              <h3 className="text-2xl">{{ t('home.area2.text5') }}</h3>
            </div>
            <p className="text-neutral-500 text-center leading-relaxed">
              {{ t('home.area2.text6') }}
            </p>
            <div class="flex justify-center">
              <Button
                variant="btn-black"
                class="px-8 !rounded-4xl"
                @click="() => router.push({ name: RouteNames.POLYOMINO_LIST })"
              >
                {{ t('home.area2.text7') }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-neutral-900">
            {{ t('home.area3.text1') }}
          </h2>
          <p className="text-lg text-neutral-500">{{ t('home.area3.text2') }}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center text-white"
              >
                <TangramIcon />
              </div>
              <h3 className="text-2xl">{{ t('home.area3.text3') }}</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 bg-neutral-900 text-neutral-50 rounded-full flex items-center justify-center"
                >
                  1
                </div>
                <div>
                  <h4 className="mb-2">{{ t('home.area3.text4') }}</h4>
                  <p className="text-neutral-500">
                    {{ t('home.area3.text5') }}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 bg-neutral-900 text-neutral-50 rounded-full flex items-center justify-center"
                >
                  2
                </div>
                <div>
                  <h4 className="mb-2">{{ t('home.area3.text6') }}</h4>
                  <p className="text-neutral-500">
                    {{ t('home.area3.text7') }}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 bg-neutral-900 text-neutral-50 rounded-full flex items-center justify-center"
                >
                  3
                </div>
                <div>
                  <h4 className="mb-2">{{ t('home.area3.text8') }}</h4>
                  <p className="text-neutral-500">
                    {{ t('home.area3.text9') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white"
              >
                <PolyominoIcon />
              </div>
              <h3 className="text-2xl">{{ t('home.area3.text10') }}</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 bg-neutral-900 text-neutral-50 rounded-full flex items-center justify-center"
                >
                  1
                </div>
                <div>
                  <h4 className="mb-2">{{ t('home.area3.text11') }}</h4>
                  <p className="text-neutral-500">
                    {{ t('home.area3.text12') }}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 bg-neutral-900 text-neutral-50 rounded-full flex items-center justify-center"
                >
                  2
                </div>
                <div>
                  <h4 className="mb-2">{{ t('home.area3.text13') }}</h4>
                  <p className="text-neutral-500">
                    {{ t('home.area3.text14') }}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 bg-neutral-900 text-neutral-50 rounded-full flex items-center justify-center"
                >
                  3
                </div>
                <div>
                  <h4 className="mb-2">{{ t('home.area3.text15') }}</h4>
                  <p className="text-neutral-500">
                    {{ t('home.area3.text16') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24 px-4 bg-neutral-100/30 relative overflow-hidden">
      <div
        className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
      ></div>
      <div
        className="absolute bottom-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
      ></div>

      <div className="container max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 text-neutral-900">
            {{ t('home.area4.text1') }}
          </h2>
          <p className="text-lg text-neutral-500">
            {{ t('home.area4.text2') }}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 text-white"
            >
              <InteractiveIcon />
            </div>
            <h3 className="text-xl mb-2">{{ t('home.area4.text3') }}</h3>
            <p className="text-neutral-500">
              {{ t('home.area4.text4') }}
            </p>
          </div>

          <div
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 text-white"
            >
              <EducationalIcon />
            </div>
            <h3 className="text-xl mb-2">{{ t('home.area4.text5') }}</h3>
            <p className="text-neutral-500">
              {{ t('home.area4.text6') }}
            </p>
          </div>

          <div
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 text-white"
            >
              <CreativeExpressionIcon />
            </div>
            <h3 className="text-xl mb-2">{{ t('home.area4.text7') }}</h3>
            <p className="text-neutral-500">
              {{ t('home.area4.text8') }}
            </p>
          </div>

          <div
            className=" bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-4 text-white"
            >
              <BeautifulDesignIcon />
            </div>
            <h3 className="text-xl mb-2">{{ t('home.area4.text9') }}</h3>
            <p className="text-neutral-500">
              {{ t('home.area4.text10') }}
            </p>
          </div>

          <div
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 text-white"
            >
              <ProgressiveDifficultyIcon />
            </div>
            <h3 className="text-xl mb-2">{{ t('home.area4.text11') }}</h3>
            <p className="text-neutral-500">
              {{ t('home.area4.text12') }}
            </p>
          </div>

          <div
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 text-white"
            >
              <DailyChallengesIcon />
            </div>
            <h3 className="text-xl mb-2">{{ t('home.area4.text13') }}</h3>
            <p className="text-neutral-500">
              {{ t('home.area4.text14') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-gradient-to-r from-blue-300/10 to-purple-300/10">
      <div className="text-center py-24 flex items-center flex-col">
        <h2 className="text-3xl md:text-4xl mb-4 text-neutral-900">
          {{ t('home.area5.text1') }}
        </h2>
        <p className="text-lg text-neutral-500 mb-6">
          {{ t('home.area5.text2') }}
        </p>
        <Button
          variant="btn-black"
          class="px-8 !rounded-4xl"
          @click="() => router.push({ name: RouteNames.TANGRAM_LIST })"
        >
          {{ t('home.area5.text3') }}
        </Button>
      </div>
    </section>
  </div>
</template>
