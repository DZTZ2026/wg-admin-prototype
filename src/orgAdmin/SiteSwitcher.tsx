import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CaretDownOutlined, CaretRightOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, message } from 'antd'

interface SiteNode {
  id: string
  name: string
  kind: 'group' | 'direct' | 'site'
  children?: SiteNode[]
}

const SITE_TREE: SiteNode[] = [
  {
    id: '1179',
    name: '伯乐(1179)',
    kind: 'group',
    children: [
      { id: '1179-direct', name: '伯乐(1179)直营', kind: 'direct' },
      { id: '1179-sub', name: '伯乐子品牌', kind: 'site' },
    ],
  },
]

function BuildingIcon({ color = '#d72c2c' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 21V8.5L12 3l8 5.5V21"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 21v-6h6v6" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 11h1.5M13.5 11H15M9 14.5h1.5M13.5 14.5H15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function NodeIcon({ kind }: { kind: SiteNode['kind'] }) {
  if (kind === 'group') return <BuildingIcon />
  if (kind === 'direct') return <span className="site-switcher-badge">直营</span>
  return <span className="site-switcher-badge site">站点</span>
}

export default function SiteSwitcher() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(SITE_TREE[0])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '1179': true })
  const [keyword, setKeyword] = useState('')
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 })
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const updatePos = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPanelPos({ top: rect.bottom + 8, left: rect.left })
  }

  useEffect(() => {
    const onDoc = (e: globalThis.MouseEvent) => {
      const target = e.target as Node
      if (wrapRef.current?.contains(target)) return
      const panel = document.getElementById('site-switcher-portal')
      if (panel?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (!open) return
    updatePos()
    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', updatePos, true)
    return () => {
      window.removeEventListener('resize', updatePos)
      window.removeEventListener('scroll', updatePos, true)
    }
  }, [open])

  const match = (node: SiteNode) => {
    const q = keyword.trim().toLowerCase()
    if (!q) return true
    return node.id.toLowerCase().includes(q) || node.name.toLowerCase().includes(q)
  }

  const selectNode = (node: SiteNode) => {
    setSelected(node)
    setOpen(false)
    message.success(`已切换至 ${node.name}`)
  }

  const search = () => {
    message.success(keyword.trim() ? `已搜索：${keyword}` : '请输入名称或id搜索')
  }

  const panel = open
    ? createPortal(
        <div
          id="site-switcher-portal"
          className="site-switcher-panel"
          style={{ top: panelPos.top, left: panelPos.left }}
        >
          <div className="site-switcher-arrow" />
          <div className="site-switcher-tree">
            {SITE_TREE.map((group) => {
              const children = group.children || []
              const shown = keyword.trim() ? children.filter(match) : children.filter((c) => c.kind === 'direct')
              const collapsedCount = keyword.trim() ? 0 : children.length - shown.length
              const isOpen = !!expanded[group.id]
              const isSelected = selected.id === group.id

              return (
                <div key={group.id}>
                  <div
                    className={`site-switcher-node ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectNode(group)}
                  >
                    <span
                      className="site-switcher-expand"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpanded((s) => ({ ...s, [group.id]: !s[group.id] }))
                      }}
                    >
                      {isOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
                    </span>
                    <NodeIcon kind={group.kind} />
                    <span className="site-switcher-name group">{group.name}</span>
                  </div>

                  {isOpen
                    ? shown.map((child) => (
                        <div
                          key={child.id}
                          className={`site-switcher-node child ${selected.id === child.id ? 'selected' : ''}`}
                          onClick={() => selectNode(child)}
                        >
                          <span className="site-switcher-branch" />
                          <span className="site-switcher-expand muted">
                            <CaretRightOutlined />
                          </span>
                          <NodeIcon kind={child.kind} />
                          <span className="site-switcher-name">{child.name}</span>
                        </div>
                      ))
                    : null}

                  {isOpen && collapsedCount > 0 ? (
                    <div className="site-switcher-collapsed">— 此处已折叠{collapsedCount}个站点 —</div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="site-switcher-search">
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="请输入名称或id搜索"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={search}
              allowClear
            />
            <Button type="primary" onClick={search}>
              搜索
            </Button>
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <div className="site-switcher" ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`site-switcher-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <BuildingIcon />
        <span className="site-switcher-label">{selected.name}</span>
        <CaretDownOutlined className={`site-switcher-caret ${open ? 'up' : ''}`} />
      </button>
      {panel}
    </div>
  )
}
