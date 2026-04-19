import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const contactRoute: RouteRecordRaw = {
  path: 'contact',
  name: RouteNames.CONTACT,
  component: () => import('./ui/ContactView.vue'),
  meta: {
    titleKey: 'meta.contact.title',
    descriptionKey: 'meta.contact.description',
    keywordsKey: 'meta.contact.keywords',
  },
}
