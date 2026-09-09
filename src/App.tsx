import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import {
  AppstoreOutlined,
  BellOutlined,
  CloseOutlined,
  DashboardOutlined,
  DollarOutlined,
  GiftOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  SoundOutlined,
  TeamOutlined,
  TransactionOutlined,
  UserOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, message } from 'antd'
import dayjs from 'dayjs'
import { MODULES, PAGES, type ModuleKey, type PageKey } from './nav'
import { ALL_CONFIGS } from './pageConfigsMore'
import GenericListPage from './components/GenericListPage'
import { ChannelAddModal, NetProfitModal, RechargeSettingsModal } from './components/SpecialModals'
import DashboardPage from './pages/DashboardPage'
import DomainPage from './pages/DomainPage'
import JPushPage from './pages/JPushPage'
import RoomsPage from './pages/RoomsPage'
import TiersPage from './pages/TiersPage'
import AgentsPage from './pages/AgentsPage'
import LuckyPage from './pages/LuckyPage'
import PromoReviewPage from './pages/PromoReviewPage'
import FinancePayPage from './pages/FinancePayPage'

const moduleIcons: Record<ModuleKey, ReactNode> = {
  dashboard: <DashboardOutlined />,
  ops: <AppstoreOutlined />,
  games: <PlayCircleOutlined />,
  members: <UserOutlined />,
  agents: <TeamOutlined />,
  promo: <GiftOutlined />,
  finance: <DollarOutlined />,
  reports: <SearchOutlined />,
  risk: <SafetyCertificateOutlined />,
  system: <SettingOutlined />,
}

export default function App() {
  const [now, setNow] = useState(dayjs())
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard')
  const [openMenu, setOpenMenu] = useState<ModuleKey | null>(null)
  const [menuLeft, setMenuLeft] = useState(0)
  const [tabs, setTabs] = useState<PageKey[]>(['dashboard'])
  const [activeTab, setActiveTab] = useState<PageKey>('dashboard')
  const [channelOpen, setChannelOpen] = useState(false)
  const [netOpen, setNetOpen] = useState(false)
  const [rechargeOpen, setRechargeOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onDoc = (e: globalThis.MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const openPage = (key: PageKey) => {
    const page = PAGES[key]
    if (!page) {
      message.warning('页面未注册')
      return
    }
    setActiveModule(page.module)
    setTabs((prev) => (prev.includes(key) ? prev : [...prev, key]))
    setActiveTab(key)
    setOpenMenu(null)
  }

  const closeTab = (key: PageKey, e: MouseEvent) => {
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
        setActiveModule(PAGES[fallback].module)
      }
      return next.length ? next : ['dashboard']
    })
  }

  const onModuleClick = (mod: (typeof MODULES)[number], el: HTMLElement) => {
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
    setMenuLeft(rect.left)
    setOpenMenu(mod.key)
    setActiveModule(mod.key)
  }

  const currentMenu = useMemo(() => MODULES.find((m) => m.key === openMenu), [openMenu])

  const handleAction = (actionKey: string) => {
    if (actionKey === 'add' && activeTab === 'channel') {
      setChannelOpen(true)
      return
    }
    if (actionKey === 'netProfit') {
      setNetOpen(true)
      return
    }
    if (actionKey === 'settings' && activeTab === 'recharge-all') {
      setRechargeOpen(true)
      return
    }
    message.info(`已触发「${actionKey}」（原型）`)
  }

  const renderPage = (key: PageKey) => {
    switch (key) {
      case 'dashboard':
        return <DashboardPage />
      case 'domain':
        return <DomainPage />
      case 'jpush':
        return <JPushPage />
      case 'rooms':
        return <RoomsPage />
      case 'tiers':
        return <TiersPage />
      case 'agents':
        return <AgentsPage onOpenNetProfit={() => setNetOpen(true)} />
      case 'lucky':
        return <LuckyPage />
      case 'promo-review':
        return <PromoReviewPage />
      case 'finance-pay':
        return <FinancePayPage />
      default: {
        const cfg = ALL_CONFIGS[key]
        if (!cfg) {
          return (
            <div className="page-panel">
              <div className="section-title">{PAGES[key]?.title || key}</div>
              <div style={{ color: '#8c8c8c' }}>该页配置待补充</div>
            </div>
          )
        }
        return (
          <GenericListPage
            config={cfg}
            onAction={(a) => {
              if (a === 'add' && key === 'channel') setChannelOpen(true)
              else if (a === 'netProfit') setNetOpen(true)
              else if (a === 'settings' && key === 'recharge-all') setRechargeOpen(true)
              else handleAction(a)
            }}
          />
        )
      }
    }
  }

  return (
    <div className="app-shell" ref={navRef}>
      <header className="top-nav">
        <div>
          <div className="platform-chip">NEW88(1773)</div>
          <div className="platform-time">(UTC +8) {now.format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
        <div className="nav-modules">
          {MODULES.map((mod) => (
            <div
              key={mod.key}
              className={`nav-item ${activeModule === mod.key ? 'active' : ''}`}
              onClick={(e) => onModuleClick(mod, e.currentTarget)}
            >
              {moduleIcons[mod.key]}
              <span className="label">{mod.label}</span>
              {mod.badge != null ? (
                <span className={`nav-badge ${mod.badge === '新' ? 'new' : ''}`}>{mod.badge}</span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="nav-utils">
          <div className="nav-util">
            <WifiOutlined />
            <span>引流</span>
          </div>
          <div className="nav-util">
            <TransactionOutlined />
            <span>透支 0%</span>
          </div>
          <div className="nav-util">
            <UserOutlined />
            <span>在线 0</span>
          </div>
          <div className="nav-util">
            <SoundOutlined />
            <span>公告 14</span>
          </div>
          <div className="nav-util">
            <DollarOutlined />
            <span>出款 1</span>
          </div>
          <div className="nav-util">
            <BellOutlined />
            <span>消息 0</span>
          </div>
          <div className="nav-util">
            <QuestionCircleOutlined />
            <span>教程</span>
          </div>
          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: '个人中心' },
                { key: 'logout', label: '退出登录' },
              ],
            }}
          >
            <Avatar style={{ background: '#1677ff', cursor: 'pointer' }}>Lee</Avatar>
          </Dropdown>
        </div>
        {currentMenu?.children ? (
          <div className="module-menu" style={{ left: menuLeft, maxHeight: 420, overflowY: 'auto' }}>
            {currentMenu.children.map((c) => (
              <div
                key={c.key}
                className={`module-menu-item ${activeTab === c.key ? 'active' : ''}`}
                onClick={() => openPage(c.key)}
              >
                {c.label}
              </div>
            ))}
          </div>
        ) : null}
      </header>

      <div className="workspace-tabs">
        {tabs.map((key) => (
          <div
            key={key}
            className={`workspace-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(key)
              setActiveModule(PAGES[key].module)
            }}
          >
            {PAGES[key]?.title || key}
            <CloseOutlined className="close" onClick={(e) => closeTab(key, e)} />
          </div>
        ))}
        <div className="workspace-actions">
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => message.success('已刷新当前页（原型）')}
          >
            刷新
          </Button>
          <Button
            size="small"
            onClick={() => {
              if (tabs.length <= 1) return
              setTabs(['dashboard'])
              setActiveTab('dashboard')
              setActiveModule('dashboard')
            }}
          >
            批量关
          </Button>
        </div>
      </div>

      <main className="content-area">{renderPage(activeTab)}</main>

      <ChannelAddModal open={channelOpen} onClose={() => setChannelOpen(false)} />
      <NetProfitModal open={netOpen} onClose={() => setNetOpen(false)} />
      <RechargeSettingsModal open={rechargeOpen} onClose={() => setRechargeOpen(false)} />
    </div>
  )
}
