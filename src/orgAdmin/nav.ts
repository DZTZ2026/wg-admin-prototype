export type OrgModuleKey = 'dashboard' | 'org' | 'ops' | 'finance' | 'reports' | 'system'

export type OrgPageKey = string

export interface OrgPageDef {
  key: OrgPageKey
  title: string
  module: OrgModuleKey
}

export interface OrgModuleDef {
  key: OrgModuleKey
  label: string
  badge?: number | '新'
  children?: { key: OrgPageKey; label: string; badge?: number | '新' }[]
}

/** 已实现页面（占位页不进菜单） */
export const ORG_READY_PAGES = new Set([
  'dashboard',
  'group-mgmt',
  'company-mgmt',
  'site-open',
  'quota-mgmt',
  'ops-site-bill',
  'report-group-change',
  'api-resource',
  'sys-ip-whitelist',
])

export const ORG_MODULES: OrgModuleDef[] = [
  { key: 'dashboard', label: '仪表盘' },
  {
    key: 'org',
    label: '组织管理',
    children: [
      { key: 'group-mgmt', label: '集团管理' },
      { key: 'company-mgmt', label: '公司管理' },
      { key: 'site-open', label: '开站管理' },
      { key: 'quota-mgmt', label: '额度管理' },
      { key: 'api-resource', label: 'API资源' },
    ],
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
  {
    key: 'system',
    label: '系统',
    children: [{ key: 'sys-ip-whitelist', label: 'IP白名单' }],
  },
]

export const ORG_PAGES: Record<OrgPageKey, OrgPageDef> = Object.fromEntries(
  ORG_MODULES.flatMap((m) => {
    if (m.key === 'dashboard') {
      return [['dashboard', { key: 'dashboard', title: '仪表盘', module: 'dashboard' as OrgModuleKey }]]
    }
    return (m.children || []).map((c) => [c.key, { key: c.key, title: c.label, module: m.key }])
  }),
)
