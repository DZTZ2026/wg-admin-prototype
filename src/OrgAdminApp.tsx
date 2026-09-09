import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import {
  BarChartOutlined,
  CloseOutlined,
  DashboardOutlined,
  DownOutlined,
  FileTextOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  ReloadOutlined,
  RightOutlined,
  SettingOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, message } from 'antd'
import { ORG_MODULES, ORG_PAGES, type OrgModuleKey, type OrgPageKey } from './orgAdmin/nav'
import SiteSwitcher from './orgAdmin/SiteSwitcher'
import GroupManagementPage from './pages/GroupManagementPage'
import CompanyManagementPage from './pages/CompanyManagementPage'
import SiteOpenPage from './pages/SiteOpenPage'
import SiteBillPage from './pages/SiteBillPage'
import QuotaManagementPage from './pages/QuotaManagementPage'
import GroupBalanceChangePage from './pages/GroupBalanceChangePage'
import OrgDashboardPage from './pages/OrgDashboardPage'
import IpWhitelistPage from './pages/IpWhitelistPage'
import ApiResourcePage from './pages/ApiResourcePage'
import './orgAdmin/styles.css'

const moduleIcons: Record<OrgModuleKey, ReactNode> = {
  dashboard: <DashboardOutlined />,
  org: <InfoCircleOutlined />,
  ops: <FileTextOutlined />,
  finance: <WalletOutlined />,
  reports: <BarChartOutlined />,
  system: <SettingOutlined />,
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="org-page-panel">
      <div className="org-section-title">{title}</div>
      <div style={{ color: '#8c8c8c', padding: '24px 16px' }}>页面未开放</div>
    </div>
  )
}

export default function OrgAdminApp() {
  const [activeModule, setActiveModule] = useState<OrgModuleKey>('org')
  const [openMenu, setOpenMenu] = useState<OrgModuleKey | null>(null)
  const [menuLeft, setMenuLeft] = useState(0)
  const [tabs, setTabs] = useState<OrgPageKey[]>(['dashboard', 'group-mgmt', 'company-mgmt'])
  const [activeTab, setActiveTab] = useState<OrgPageKey>('company-mgmt')
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = '包网站点后台'
  }, [])

  useEffect(() => {
    const onDoc = (e: globalThis.MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const openPage = (key: OrgPageKey) => {
    const page = ORG_PAGES[key]
    if (!page) {
      message.warning('页面未注册')
      return
    }
    setActiveModule(page.module)
    setTabs((prev) => (prev.includes(key) ? prev : [...prev, key]))
    setActiveTab(key)
    setOpenMenu(null)
  }

  const closeTab = (key: OrgPageKey, e: MouseEvent) => {
    e.stopPropagation()
    if (key === 'dashboard') {
      message.info('仪表盘标签默认保留')
      return
    }
    setTabs((prev) => {
      const next = prev.filter((k) => k !== key)
      if (activeTab === key) {
        const idx = prev.indexOf(key)
        const fallback = next[Math.max(0, idx - 1)] || 'dashboard'
        setActiveTab(fallback)
        setActiveModule(ORG_PAGES[fallback].module)
      }
      return next.length ? next : ['dashboard']
    })
  }

  const onModuleClick = (mod: (typeof ORG_MODULES)[number], el: HTMLElement) => {
    if (!mod.children?.length) {
      if (mod.key === 'dashboard') openPage('dashboard')
      setOpenMenu(null)
      return
    }
    if (openMenu === mod.key) {
      setOpenMenu(null)
      return
    }
    const rect = el.getBoundingClientRect()
    const navRect = navRef.current?.getBoundingClientRect()
    setMenuLeft(rect.left - (navRect?.left || 0))
    setOpenMenu(mod.key)
    setActiveModule(mod.key)
  }

  const currentMenu = useMemo(() => ORG_MODULES.find((m) => m.key === openMenu), [openMenu])

  const renderPage = (key: OrgPageKey) => {
    switch (key) {
      case 'dashboard':
        return <OrgDashboardPage />
      case 'group-mgmt':
        return <GroupManagementPage />
      case 'company-mgmt':
        return <CompanyManagementPage />
      case 'site-open':
        return <SiteOpenPage />
      case 'quota-mgmt':
        return <QuotaManagementPage />
      case 'report-group-change':
        return <GroupBalanceChangePage />
      case 'ops-site-bill':
        return <SiteBillPage mode="merchant" />
      case 'api-resource':
        return <ApiResourcePage />
      case 'sys-ip-whitelist':
        return <IpWhitelistPage />
      default:
        return <PlaceholderPage title={ORG_PAGES[key]?.title || key} />
    }
  }

  return (
    <div className="org-app-shell" ref={navRef}>
      <header className="org-top-nav">
        <div className="org-brand">
          <SiteSwitcher />
        </div>

        <div className="org-nav-modules">
          {ORG_MODULES.map((mod) => (
            <div
              key={mod.key}
              className={`org-nav-item ${activeModule === mod.key ? 'active' : ''}`}
              onClick={(e) => onModuleClick(mod, e.currentTarget)}
            >
              {moduleIcons[mod.key]}
              <span className="label">{mod.label}</span>
              {mod.badge != null ? (
                <span className={`org-nav-badge${mod.badge === '新' ? ' is-new' : ''}`}>{mod.badge}</span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="org-nav-user">cooper</div>

        {currentMenu?.children ? (
          <div className="org-module-menu" style={{ left: menuLeft }}>
            {currentMenu.children.map((c) => (
              <div
                key={c.key}
                className={`org-module-menu-item ${activeTab === c.key ? 'active' : ''}`}
                onClick={() => openPage(c.key)}
              >
                <span>{c.label}</span>
                {c.badge != null ? (
                  <span className={`org-menu-badge${c.badge === '新' ? ' is-new' : ''}`}>{c.badge}</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </header>

      <div className="org-workspace-tabs">
        <Button type="text" size="small" icon={<LeftOutlined />} className="tab-scroll-btn" />
        {tabs.map((key) => (
          <div
            key={key}
            className={`org-workspace-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(key)
              setActiveModule(ORG_PAGES[key].module)
            }}
          >
            {ORG_PAGES[key]?.title || key}
            <CloseOutlined className="close" onClick={(e) => closeTab(key, e)} />
          </div>
        ))}
        <Button type="text" size="small" icon={<RightOutlined />} className="tab-scroll-btn" />
        <div className="org-workspace-actions">
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => message.success('已刷新当前页（原型）')}
          >
            刷新
          </Button>
          <span className="org-action-divider" />
          <Dropdown
            menu={{
              items: [
                { key: 'close-others', label: '关闭其他', onClick: () => message.info('关闭其他（原型）') },
                {
                  key: 'close-all',
                  label: '关闭全部',
                  onClick: () => {
                    setTabs(['dashboard'])
                    setActiveTab('dashboard')
                    setActiveModule('dashboard')
                  },
                },
              ],
            }}
          >
            <Button type="text" size="small">
              批量关闭 <DownOutlined style={{ fontSize: 10, marginLeft: 2 }} />
            </Button>
          </Dropdown>
          <span className="org-action-divider" />
          <Button
            type="text"
            size="small"
            icon={<FullscreenOutlined />}
            onClick={() => message.info('全屏（原型）')}
          />
        </div>
      </div>

      <main className="org-content-area">{renderPage(activeTab)}</main>
    </div>
  )
}
