export type MasterModuleKey =
  | 'dashboard'
  | 'org'
  | 'members'
  | 'resource'
  | 'games'
  | 'finance'
  | 'ops'
  | 'risk'
  | 'reports'
  | 'system'

export type MasterPageKey = string

export interface MasterPageDef {
  key: MasterPageKey
  title: string
  module: MasterModuleKey
}

export interface MasterModuleDef {
  key: MasterModuleKey
  label: string
  badge?: number | '新'
  children?: { key: MasterPageKey; label: string; badge?: number | '新' }[]
}

/** 已实现页面（占位页不进菜单） */
export const MASTER_READY_PAGES = new Set([
  'dashboard',
  'site-open',
  'ops-site-bill',
  'report-group-change',
])

export const MASTER_MODULES: MasterModuleDef[] = [
  { key: 'dashboard', label: '仪表盘' },
  {
    key: 'org',
    label: '组织管理',
    children: [{ key: 'site-open', label: '开站管理' }],
  },
  {
    key: 'ops',
    label: '运营',
    children: [{ key: 'ops-site-bill', label: '站点账单' }],
  },
  {
    key: 'reports',
    label: '报表',
    badge: '新',
    children: [{ key: 'report-group-change', label: '集团账变', badge: '新' }],
  },
]

export const MASTER_PAGES: Record<MasterPageKey, MasterPageDef> = Object.fromEntries(
  MASTER_MODULES.flatMap((m) => {
    if (m.key === 'dashboard') {
      return [['dashboard', { key: 'dashboard', title: '仪表盘', module: 'dashboard' as MasterModuleKey }]]
    }
    return (m.children || []).map((c) => [c.key, { key: c.key, title: c.label, module: m.key }])
  }),
)
