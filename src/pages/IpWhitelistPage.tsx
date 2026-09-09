import { useMemo, useState, type Key } from 'react'
import {
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  WarningFilled,
} from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  Modal,
  Pagination,
  Radio,
  Select,
  Space,
  Table,
  Tabs,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import FilterRangePicker from '../components/FilterRangePicker'

type SubTab = 'ip' | 'auth'
type Period = 'day' | 'week' | 'month'

interface IpRow {
  key: string
  ip: string
  region: string
  adminAccess: boolean
  remark: string
  operator: string
  time: string
}

interface AuthRow {
  key: string
  code: string
  status: '使用中' | '未使用' | '已过期'
  expire: string
  remark: string
  operator: string
  time: string
}

interface AuthLogRow {
  key: string
  loginTime: string
  ip: string
  type: string
  result: string
}

interface IpFormItem {
  ip: string
  remark: string
  adminAccess: boolean
}

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
]

const IP_KEYWORD_OPTIONS = [
  { value: 'ip', label: 'IP' },
  { value: 'operator', label: '操作人' },
  { value: 'remark', label: '备注' },
]

const AUTH_KEYWORD_OPTIONS = [
  { value: 'code', label: '授权码' },
  { value: 'operator', label: '操作人' },
  { value: 'remark', label: '备注' },
]

const AUTH_STATUS_OPTIONS = [
  { value: '全部', label: '全部' },
  { value: '使用中', label: '使用中' },
  { value: '未使用', label: '未使用' },
  { value: '已过期', label: '已过期' },
]

const MAIN_DOMAIN = 'https://bole666.cg.ink'
const BACKUP_DOMAIN = 'https://bole666.offib.com'

const IP_ROWS: IpRow[] = [
  {
    key: '1',
    ip: '13.228.93.137',
    region: 'Singapore, Singapore',
    adminAccess: true,
    remark: '',
    operator: 'fred002',
    time: '2026-08-12 10:22:15',
  },
  {
    key: '2',
    ip: '188.93.91.2',
    region: 'Czechia, Vestec',
    adminAccess: true,
    remark: '办公网',
    operator: 'shanshan',
    time: '2026-07-31 23:18:40',
  },
  {
    key: '3',
    ip: '103.86.51.18',
    region: 'Hong Kong, Hong Kong',
    adminAccess: true,
    remark: '',
    operator: 'system',
    time: '2026-07-28 09:01:02',
  },
  {
    key: '4',
    ip: '45.77.176.220',
    region: 'United States, Los Angeles',
    adminAccess: true,
    remark: 'VPN',
    operator: 'zuzhang02',
    time: '2026-07-20 16:44:11',
  },
]

const AUTH_ROWS: AuthRow[] = [
  {
    key: '1',
    code: 'bm-3TU28l6Wh',
    status: '使用中',
    expire: '永久',
    remark: '艾琳',
    operator: 'huitailiang001',
    time: '2026-07-31 11:15:04',
  },
  {
    key: '2',
    code: 'bm-9KxQm2NpA',
    status: '使用中',
    expire: '永久',
    remark: 'shanshan',
    operator: 'van123',
    time: '2026-07-28 18:02:33',
  },
  {
    key: '3',
    code: 'bm-7HdLp4RsC',
    status: '未使用',
    expire: '2026-09-15 23:59:59',
    remark: '',
    operator: 'cooper',
    time: '2026-08-01 09:20:00',
  },
  {
    key: '4',
    code: 'bm-1AbCd5EfG',
    status: '已过期',
    expire: '2026-06-01 23:59:59',
    remark: '临时',
    operator: 'system',
    time: '2026-05-01 10:00:00',
  },
]

const AUTH_LOGS: AuthLogRow[] = [
  {
    key: '1',
    loginTime: '2026-08-15 10:21:08',
    ip: '171.225.185.43',
    type: '登录',
    result: '成功',
  },
  {
    key: '2',
    loginTime: '2026-08-14 22:03:41',
    ip: '2402:800:629c:1806:913d:25d4:efa9:5c30',
    type: 'IP变更',
    result: '成功',
  },
  {
    key: '3',
    loginTime: '2026-08-12 08:15:20',
    ip: '103.86.51.18',
    type: '登录',
    result: '成功',
  },
]

function periodRange(period: Period): [Dayjs, Dayjs] {
  const end = dayjs().endOf('day')
  if (period === 'day') return [dayjs().startOf('day'), end]
  if (period === 'week') return [dayjs().subtract(6, 'day').startOf('day'), end]
  return [dayjs().subtract(29, 'day').startOf('day'), end]
}

function PeriodButtons({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="group-change-period">
      {PERIOD_OPTIONS.map((p) => (
        <button
          key={p.key}
          type="button"
          className={value === p.key ? 'active' : ''}
          onClick={() => onChange(p.key)}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

function copyText(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => message.success(`已复制：${text}`),
    () => message.info(`复制：${text}（原型）`),
  )
}

function randomAuthSuffix() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  let s = ''
  for (let i = 0; i < 9; i += 1) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export default function IpWhitelistPage() {
  const [subTab, setSubTab] = useState<SubTab>('ip')
  const [period, setPeriod] = useState<Period>('month')
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(() => periodRange('month'))
  const [keywordField, setKeywordField] = useState('ip')
  const [keyword, setKeyword] = useState('')
  const [authStatus, setAuthStatus] = useState<string>('全部')
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)

  const [ipRows, setIpRows] = useState(IP_ROWS)
  const [authRows, setAuthRows] = useState(AUTH_ROWS)

  const [addIpOpen, setAddIpOpen] = useState(false)
  const [editIp, setEditIp] = useState<IpRow | null>(null)
  const [ipForms, setIpForms] = useState<IpFormItem[]>([{ ip: '', remark: '', adminAccess: true }])

  const [addAuthOpen, setAddAuthOpen] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [authDays, setAuthDays] = useState('30')
  const [authRemark, setAuthRemark] = useState('')

  const [logOpen, setLogOpen] = useState(false)
  const [logCode, setLogCode] = useState('')
  const [logPeriod, setLogPeriod] = useState<Period>('week')
  const [logRange, setLogRange] = useState<[Dayjs, Dayjs] | null>(() => periodRange('week'))

  const onPeriodChange = (p: Period) => {
    setPeriod(p)
    setRange(periodRange(p))
  }

  const resetFilters = () => {
    setPeriod('month')
    setRange(periodRange('month'))
    setKeyword('')
    setKeywordField(subTab === 'ip' ? 'ip' : 'code')
    setAuthStatus('全部')
    setPage(1)
    setSelectedKeys([])
  }

  const filteredIp = useMemo(() => {
    const q = keyword.trim()
    return ipRows.filter((r) => {
      if (!q) return true
      if (keywordField === 'operator') return r.operator.includes(q)
      if (keywordField === 'remark') return r.remark.includes(q)
      return r.ip.includes(q)
    })
  }, [ipRows, keyword, keywordField])

  const filteredAuth = useMemo(() => {
    const q = keyword.trim()
    return authRows.filter((r) => {
      if (authStatus !== '全部' && r.status !== authStatus) return false
      if (!q) return true
      if (keywordField === 'operator') return r.operator.includes(q)
      if (keywordField === 'remark') return r.remark.includes(q)
      return r.code.includes(q)
    })
  }, [authRows, authStatus, keyword, keywordField])

  const currentRows = subTab === 'ip' ? filteredIp : filteredAuth
  const pageRows = currentRows.slice((page - 1) * pageSize, page * pageSize)

  const openAddIp = () => {
    setEditIp(null)
    setIpForms([{ ip: '', remark: '', adminAccess: true }])
    setAddIpOpen(true)
  }

  const openEditIp = (row: IpRow) => {
    setEditIp(row)
    setIpForms([{ ip: row.ip, remark: row.remark, adminAccess: row.adminAccess }])
    setAddIpOpen(true)
  }

  const submitIp = () => {
    const first = ipForms[0]
    if (!first?.ip.trim()) {
      message.warning('请输入IP地址')
      return
    }
    if (editIp) {
      setIpRows((prev) =>
        prev.map((r) =>
          r.key === editIp.key
            ? {
                ...r,
                ip: first.ip.trim(),
                remark: first.remark.slice(0, 40),
                adminAccess: first.adminAccess,
                operator: 'cooper',
                time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              }
            : r,
        ),
      )
      message.success('已修改（原型）')
    } else {
      const added = ipForms
        .filter((f) => f.ip.trim())
        .map((f, i) => ({
          key: `n-${Date.now()}-${i}`,
          ip: f.ip.trim(),
          region: 'Unknown',
          adminAccess: f.adminAccess,
          remark: f.remark.slice(0, 40),
          operator: 'cooper',
          time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }))
      setIpRows((prev) => [...added, ...prev])
      message.success(`已新增 ${added.length} 条（原型）`)
    }
    setAddIpOpen(false)
  }

  const deleteIp = (row: IpRow) => {
    Modal.confirm({
      title: '确认删除该 IP？',
      onOk: () => {
        setIpRows((prev) => prev.filter((r) => r.key !== row.key))
        message.success('已删除（原型）')
      },
    })
  }

  const openAddAuth = () => {
    setAuthCode('')
    setAuthDays('30')
    setAuthRemark('')
    setAddAuthOpen(true)
  }

  const submitAuth = () => {
    if (!authCode.trim()) {
      message.warning('请输入或自动生成授权码')
      return
    }
    const expire =
      authDays === '永久'
        ? '永久'
        : dayjs().add(Number(authDays), 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
    setAuthRows((prev) => [
      {
        key: `a-${Date.now()}`,
        code: `bm-${authCode.trim()}`,
        status: '未使用',
        expire,
        remark: authRemark.slice(0, 40),
        operator: 'cooper',
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      ...prev,
    ])
    message.success('已新增授权码（原型）')
    setAddAuthOpen(false)
  }

  const deleteAuth = (row: AuthRow) => {
    Modal.confirm({
      title: '确认删除该授权码？',
      onOk: () => {
        setAuthRows((prev) => prev.filter((r) => r.key !== row.key))
        message.success('已删除（原型）')
      },
    })
  }

  const ipColumns: ColumnsType<IpRow> = [
    { title: 'IP', dataIndex: 'ip', width: 160, align: 'center' },
    { title: '地区', dataIndex: 'region', width: 200, align: 'center' },
    {
      title: '访问权限',
      dataIndex: 'adminAccess',
      width: 140,
      align: 'center',
      render: (v: boolean) => (
        <Checkbox checked={v} disabled>
          管理后台
        </Checkbox>
      ),
    },
    { title: '备注', dataIndex: 'remark', width: 140, align: 'center' },
    { title: '操作人', dataIndex: 'operator', width: 120, align: 'center' },
    { title: '操作时间', dataIndex: 'time', width: 170, align: 'center' },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, row) => (
        <Space size={8}>
          <Button type="link" size="small" className="action-link" onClick={() => deleteIp(row)}>
            删除
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => openEditIp(row)}>
            修改
          </Button>
        </Space>
      ),
    },
  ]

  const authColumns: ColumnsType<AuthRow> = [
    {
      title: '授权码',
      dataIndex: 'code',
      width: 170,
      align: 'center',
      render: (v: string) => (
        <span className="ip-wl-copy-cell">
          {v}
          <CopyOutlined onClick={() => copyText(v)} />
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (v: AuthRow['status']) => (
        <span style={{ color: v === '使用中' ? '#52c41a' : v === '已过期' ? '#ff4d4f' : '#8c8c8c' }}>
          {v}
        </span>
      ),
    },
    { title: '到期时间', dataIndex: 'expire', width: 170, align: 'center' },
    { title: '备注', dataIndex: 'remark', width: 120, align: 'center' },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, row) => (
        <Space size={8}>
          <Button
            type="link"
            size="small"
            className="action-link"
            onClick={() => {
              setLogCode(row.code)
              setLogOpen(true)
            }}
          >
            记录
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => deleteAuth(row)}>
            删除
          </Button>
        </Space>
      ),
    },
    { title: '操作人', dataIndex: 'operator', width: 140, align: 'center' },
    { title: '操作时间', dataIndex: 'time', width: 170, align: 'center' },
  ]

  const logColumns: ColumnsType<AuthLogRow> = [
    { title: '登录时间', dataIndex: 'loginTime', width: 170, align: 'center' },
    { title: 'IP', dataIndex: 'ip', width: 260, align: 'center' },
    { title: '类型', dataIndex: 'type', width: 100, align: 'center' },
    { title: '结果', dataIndex: 'result', width: 90, align: 'center' },
  ]

  const batchMenu =
    subTab === 'auth'
      ? {
          items: [
            {
              key: 'delay',
              label: '批量延时',
              onClick: () => message.info('批量延时（原型）'),
            },
            {
              key: 'delete',
              label: '批量删除',
              onClick: () => {
                if (!selectedKeys.length) {
                  message.warning('请先选择数据')
                  return
                }
                setAuthRows((prev) => prev.filter((r) => !selectedKeys.includes(r.key)))
                setSelectedKeys([])
                message.success('已批量删除（原型）')
              },
            },
          ],
        }
      : {
          items: [
            {
              key: 'delete',
              label: '批量删除',
              onClick: () => {
                if (!selectedKeys.length) {
                  message.warning('请先选择数据')
                  return
                }
                setIpRows((prev) => prev.filter((r) => !selectedKeys.includes(r.key)))
                setSelectedKeys([])
                message.success('已批量删除（原型）')
              },
            },
          ],
        }

  return (
    <div className="org-page-panel ip-whitelist-page">
      <Tabs
        className="site-open-tabs"
        activeKey={subTab}
        onChange={(k) => {
          setSubTab(k as SubTab)
          setKeywordField(k === 'ip' ? 'ip' : 'code')
          setKeyword('')
          setSelectedKeys([])
          setPage(1)
        }}
        items={[
          { key: 'ip', label: 'IP白名单' },
          { key: 'auth', label: '浏览器授权码' },
        ]}
      />

      <div className="ip-wl-domains">
        <div>
          后台域名主：
          <a href={MAIN_DOMAIN} target="_blank" rel="noreferrer">
            {MAIN_DOMAIN}
          </a>
          <CopyOutlined className="ip-wl-copy" onClick={() => copyText(MAIN_DOMAIN)} />
        </div>
        <div>
          后台域名备：
          <a href={BACKUP_DOMAIN} target="_blank" rel="noreferrer">
            {BACKUP_DOMAIN}
          </a>
          <CopyOutlined className="ip-wl-copy" onClick={() => copyText(BACKUP_DOMAIN)} />
        </div>
      </div>

      <div className="site-open-filter">
        <div className="site-open-filter-row site-open-filter-row-between">
          <div className="site-open-filter-row">
            <PeriodButtons value={period} onChange={onPeriodChange} />
            <FilterRangePicker
              value={range}
              onChange={(v) => setRange(v as [Dayjs, Dayjs] | null)}
              style={{ width: 360 }}
            />
            <Space.Compact>
              <Select
                value={keywordField}
                onChange={setKeywordField}
                style={{ width: 100 }}
                options={subTab === 'ip' ? IP_KEYWORD_OPTIONS : AUTH_KEYWORD_OPTIONS}
              />
              <Input
                allowClear
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={
                  subTab === 'ip'
                    ? keywordField === 'operator'
                      ? '请输入操作人'
                      : keywordField === 'remark'
                        ? '请输入备注'
                        : '请输入IP'
                    : keywordField === 'operator'
                      ? '请输入操作人'
                      : keywordField === 'remark'
                        ? '请输入备注'
                        : '请输入授权码'
                }
                style={{ width: 160 }}
              />
            </Space.Compact>
            {subTab === 'auth' ? (
              <Select
                value={authStatus}
                onChange={setAuthStatus}
                options={AUTH_STATUS_OPTIONS}
                style={{ width: 110 }}
                placeholder="状态"
              />
            ) : null}
            <Button
              type="primary"
              onClick={() => {
                setPage(1)
                message.success('已按条件筛选（原型）')
              }}
            >
              搜索
            </Button>
            <Button onClick={resetFilters}>重置</Button>
          </div>
          <div className="site-open-filter-actions">
            <Button type="primary" icon={<PlusOutlined />} onClick={subTab === 'ip' ? openAddIp : openAddAuth}>
              新增
            </Button>
          </div>
        </div>
      </div>

      {subTab === 'ip' ? (
        <Table
          size="middle"
          rowKey="key"
          className="site-bill-table"
          columns={ipColumns}
          dataSource={pageRows as IpRow[]}
          pagination={false}
          scroll={{ x: 1200 }}
          rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        />
      ) : (
        <Table
          size="middle"
          rowKey="key"
          className="site-bill-table"
          columns={authColumns}
          dataSource={pageRows as AuthRow[]}
          pagination={false}
          scroll={{ x: 1300 }}
          rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        />
      )}

      <div className="ip-wl-footer">
        <div className="ip-wl-footer-left">
          <Checkbox
            checked={pageRows.length > 0 && pageRows.every((r) => selectedKeys.includes(r.key))}
            indeterminate={
              pageRows.some((r) => selectedKeys.includes(r.key)) &&
              !pageRows.every((r) => selectedKeys.includes(r.key))
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedKeys((prev) => Array.from(new Set([...prev, ...pageRows.map((r) => r.key)])))
              } else {
                const pageSet = new Set(pageRows.map((r) => r.key))
                setSelectedKeys((prev) => prev.filter((k) => !pageSet.has(String(k))))
              }
            }}
          >
            全选当前页
          </Checkbox>
          <Dropdown menu={batchMenu}>
            <Button>
              批量操作 <span style={{ fontSize: 10 }}>▾</span>
            </Button>
          </Dropdown>
          <span className="ip-wl-selected">
            已选择 {selectedKeys.length} 条数据
            {subTab === 'auth' ? ` 共 ${filteredAuth.length} 条` : ''}
          </span>
        </div>
        <Pagination
          size="small"
          current={page}
          pageSize={pageSize}
          total={currentRows.length}
          showSizeChanger
          pageSizeOptions={['50', '100', '200']}
          showTotal={(t) => `共 ${t} 条`}
          onChange={(p, ps) => {
            setPage(p)
            setPageSize(ps)
          }}
        />
      </div>

      {subTab === 'auth' ? (
        <div className="ip-wl-tips">
          <div>
            <WarningFilled style={{ color: '#faad14', marginRight: 6 }} />
            使用 Chrome 插件可更安全快捷地实现 IP 白名单功能，推荐安装
            <Button type="link" size="small" onClick={() => message.info('WG加速器下载（原型）')}>
              WG加速器
            </Button>
          </div>
          <div>浏览器授权码(集团)：可以登录集团后台域名和集团下所有站点的后台域名</div>
        </div>
      ) : null}

      <Modal
        title={editIp ? '修改' : '新增'}
        open={addIpOpen}
        onCancel={() => setAddIpOpen(false)}
        onOk={submitIp}
        okText="确认"
        cancelText="取消"
        destroyOnClose
        width={560}
      >
        {ipForms.map((item, idx) => (
          <div key={idx} className="ip-wl-form-row">
            <Form layout="vertical">
              <Form.Item label="访问权限">
                <Checkbox
                  checked={item.adminAccess}
                  onChange={(e) => {
                    const next = [...ipForms]
                    next[idx] = { ...item, adminAccess: e.target.checked }
                    setIpForms(next)
                  }}
                >
                  管理后台
                </Checkbox>
              </Form.Item>
              <Form.Item label="IP地址" required>
                <Input
                  placeholder="请输入IP地址"
                  value={item.ip}
                  onChange={(e) => {
                    const next = [...ipForms]
                    next[idx] = { ...item, ip: e.target.value }
                    setIpForms(next)
                  }}
                />
              </Form.Item>
              <Form.Item label="备注">
                <div className="ip-wl-remark-line">
                  <Input
                    placeholder="请输入备注"
                    maxLength={40}
                    value={item.remark}
                    onChange={(e) => {
                      const next = [...ipForms]
                      next[idx] = { ...item, remark: e.target.value }
                      setIpForms(next)
                    }}
                    suffix={`${item.remark.length}/40`}
                  />
                  {!editIp ? (
                    <Space>
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={() =>
                          setIpForms((prev) => [...prev, { ip: '', remark: '', adminAccess: true }])
                        }
                      />
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={ipForms.length <= 1}
                        onClick={() => setIpForms((prev) => prev.filter((_, i) => i !== idx))}
                      />
                    </Space>
                  ) : null}
                </div>
              </Form.Item>
            </Form>
          </div>
        ))}
      </Modal>

      <Modal
        title="新增授权码"
        open={addAuthOpen}
        onCancel={() => setAddAuthOpen(false)}
        onOk={submitAuth}
        okText="确认"
        cancelText="取消"
        destroyOnClose
        width={520}
      >
        <Form layout="vertical">
          <Form.Item label="授权码" required>
            <div className="ip-wl-auth-code-line">
              <Input
                addonBefore="bm-"
                value={authCode}
                maxLength={9}
                onChange={(e) => setAuthCode(e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 9))}
                suffix={`${authCode.length}/9`}
              />
              <Button type="link" onClick={() => setAuthCode(randomAuthSuffix())}>
                自动生成
              </Button>
            </div>
          </Form.Item>
          <Form.Item label="授权时间" required>
            <Radio.Group value={authDays} onChange={(e) => setAuthDays(e.target.value)}>
              <Radio value="7">7天</Radio>
              <Radio value="30">30天</Radio>
              <Radio value="90">90天</Radio>
              <Radio value="永久">永久</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea
              rows={3}
              maxLength={40}
              placeholder="请输入备注"
              value={authRemark}
              onChange={(e) => setAuthRemark(e.target.value)}
              showCount
            />
          </Form.Item>
        </Form>
        <div className="ip-wl-modal-tip">温情提示：授权码授权时间到期后失效且不可用。</div>
      </Modal>

      <Modal
        title="授权码记录"
        open={logOpen}
        onCancel={() => setLogOpen(false)}
        footer={null}
        width={860}
        destroyOnClose
      >
        <div className="site-open-filter-row" style={{ marginBottom: 12 }}>
          <span>登录时间</span>
          <PeriodButtons
            value={logPeriod}
            onChange={(p) => {
              setLogPeriod(p)
              setLogRange(periodRange(p))
            }}
          />
          <FilterRangePicker
            value={logRange}
            onChange={(v) => setLogRange(v as [Dayjs, Dayjs] | null)}
            style={{ width: 360 }}
          />
          <Button type="primary" onClick={() => message.success(`已查询 ${logCode}（原型）`)}>
            搜索
          </Button>
        </div>
        <Table
          size="small"
          rowKey="key"
          columns={logColumns}
          dataSource={AUTH_LOGS}
          pagination={{ pageSize: 50, showTotal: (t) => `共 ${t} 条`, showSizeChanger: true }}
        />
      </Modal>
    </div>
  )
}
