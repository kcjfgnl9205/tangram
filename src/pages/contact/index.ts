import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import ContactView from './ui/ContactView.vue'

export { ContactView }

export const contactRoute: RouteRecordRaw = {
  path: 'contact',
  name: RouteNames.CONTACT,
  component: ContactView,
  meta: {
    titleKey: 'meta.contact.title',
    descriptionKey: 'meta.contact.description',
    keywordsKey: 'meta.contact.keywords',
  },
}
