import { ROUTE_NAME } from './routes'

export interface NavLink {
  name: ROUTE_NAME
  label: string
  icon?: string // shared/assets/icons/ 파일명 (확장자 제외)
  activeNames?: ROUTE_NAME[] // 이 메뉴를 활성화할 추가 라우트 (detail 등)
  children?: NavLink[]
}

export interface NavDivider {
  divider: true
  label?: string
}

export type NavItem = NavLink | NavDivider

export const navigation: NavItem[] = [
  { name: ROUTE_NAME.HOME, label: '대시보드' },
  { divider: true },
  { name: ROUTE_NAME.USERS, label: '유저 관리' },
  { name: ROUTE_NAME.TANGRAMS, label: '칠교놀이 관리' },
  { name: ROUTE_NAME.METADATA, label: '메타데이터 관리' },
  { name: ROUTE_NAME.CONTACTS, label: '문의사항 관리', activeNames: [ROUTE_NAME.CONTACT_DETAIL] },
]

export const bottomNavigation: NavLink[] = [
  { name: ROUTE_NAME.UI_COMPONENTS, label: 'UI 컴포넌트' },
]
