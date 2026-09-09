import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import {
  BarChartOutlined,
  CloseOutlined,
  CloudOutlined,
  DashboardOutlined,
  DownOutlined,
  FileTextOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  ReloadOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  TrophyOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, message } from 'antd'
import { MASTER_MODULES, MASTER_PAGES, type MasterModuleKey, type MasterPageKey } from './masterAdmin/nav'
import SiteOpenPage from './pages/SiteOpenPage'
import SiteBillPage from './pages/SiteBillPage'
import GroupBalanceChangePage from './pages/GroupBalanceChangePage'
import './orgAdmin/styles.css'
import './masterAdmin/styles.css'

const moduleIcons: Record<MasterModuleKey, ReactNode> = {
  dashboard: <DashboardOutlined />,
  org: <InfoCircleOutlined />,
  members: <TeamOutlined />,
  resource: <CloudOutlined />,
  games: <TrophyOutlined />,
  finance: <WalletOutlined />,
  ops: <BarChartOutlined />,
  risk: <SafetyCertificateOutlined />,
  reports: <FileTextOutlined />,
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

function MasterDashboardPage() {
  return (
    <div className="org-page-panel">
      <div className="org-section-title">总控仪表盘</div>
      <div className="org-dashboard-cards">
        <div className="org-dash-card">
          <div className="label">全平台站点</div>
          <div className="value">128</div>
        </div>
        <div className="org-dash-card">
          <div className="label">创建中</div>
          <div className="value">6</div>
        </div>
        <div className="org-dash-card">
          <div className="label">待审核</div>
          <div className="value">3</div>
        </div>
        <div className="org-dash-card">
          <div className="label">待付款</div>
          <div className="value">2</div>
        </div>
      </div>
    </div>
  )
}

export default function MasterAdminApp() {
  const [activeModule, setActiveModule] = useState<MasterModuleKey>('org')
  const [openMenu, setOpenMenu] = useState<MasterModuleKey | null>(null)
  const [menuLeft, setMenuLeft] = useState(0)
  const [tabs, setTabs] = useState<MasterPageKey[]>(['dashboard', 'site-open'])
  const [activeTab, setActiveTab] = useState<MasterPageKey>('site-open')
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = '包网总控后台'
  }, [])

  useEffect(() => {
    const onDoc = (e: globalThis.MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const openPage = (key: MasterPageKey) => {
    const page = MASTER_PAGES[key]
    if (!page) {
      message.warning('页面未注册')
      return
    }
    setActiveModule(page.module)
    setTabs((prev) => (prev.includes(key) ? prev : [...prev, key]))
    setActiveTab(key)
    setOpenMenu(null)
  }

  const closeTab = (key: MasterPageKey, e: MouseEvent) => {
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
        setActiveModule(MASTER_PAGES[fallback].module)
      }
      return next.length ? next : ['dashboard']
    })
  }

  const onModuleClick = (mod: (typeof MASTER_MODULES)[number], el: HTMLElement) => {
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

  const currentMenu = useMemo(() => MASTER_MODULES.find((m) => m.key === openMenu), [openMenu])

  const renderPage = (key: MasterPageKey) => {
    switch (key) {
      case 'dashboard':
        return <MasterDashboardPage />
      case 'site-open':
        return <SiteOpenPage mode="master" />
      case 'ops-site-bill':
        return <SiteBillPage mode="master" />
      case 'report-group-change':
        return <GroupBalanceChangePage mode="master" />
      default:
        return <PlaceholderPage title={MASTER_PAGES[key]?.title || key} />
    }
  }

  return (
    <div className="org-app-shell master-app-shell" ref={navRef}>
      <header className="org-top-nav master-top-nav">
        <div className="org-brand master-brand">
          <CloudOutlined className="master-brand-icon" />
          <span className="master-brand-title">包网总控</span>
        </div>

        <div className="org-nav-modules">
          {MASTER_MODULES.map((mod) => (
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
              setActiveModule(MASTER_PAGES[key].module)
            }}
          >
            {MASTER_PAGES[key]?.title || key}
            <CloseOutlined className="close" onClick={(e) => closeTab(key, e)} />
          </div>
        ))}
        <Button type="text" size="small" icon={<RightOutlined />} className="tab-scroll-btn" />
        <div className="org-workspace-actions">
          <Button type="text" size="small" icon={<ReloadOutlined />} onClick={() => message.success('已刷新（原型）')}>
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
          <Button type="text" size="small" icon={<FullscreenOutlined />} onClick={() => message.info('全屏（原型）')} />
        </div>
      </div>

      <main className="org-content-area">{renderPage(activeTab)}</main>
    </div>
  )
}
