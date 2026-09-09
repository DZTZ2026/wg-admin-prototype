import { useMemo, useState, type Key } from 'react'
import { CopyOutlined, UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tabs,
  message,
} from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import FilterRangePicker from '../components/FilterRangePicker'

type ChangeTab = 'group' | 'personal' | 'recharge'
type Period = 'day' | 'week' | 'month'

interface GroupChangeRow {
  key: string
  id: string
  time: string
  groupName: string
  companyName: string
  brandName: string
  changeType: string
  changeItem: string
  counterparty: string
  before: string
  amount: number
  after: string
  operator: string
  remark: string
}

interface PersonalChangeRow {
  key: string
  id: string
  time: string
  groupName: string
  account: string
  changeType: string
  counterparty: string
  before: string
  amount: number
  after: string
  remark: string
}

interface RechargeRow {
  key: string
  orderNo: string
  walletOrderNo: string
  orderType: string
  time: string
  groupName: string
  companyName: string
  siteName: string
  orderAmount: number
  receivedAmount: number
  giftAmount: number
  applicant: string
  chain: string
  txHash: string
  status: '待支付' | '支付成功' | '支付失败' | '支付超时'
  reviewer: string
  reviewTime: string
  remark: string
}

const TAB_ITEMS: { key: ChangeTab; label: string; badge?: boolean }[] = [
  { key: 'group', label: '集团账变', badge: true },
  { key: 'personal', label: '个人账变', badge: true },
  { key: 'recharge', label: '充币订单', badge: true },
]

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
]

const GROUP_KEYWORD_OPTIONS = [
  { value: 'siteId', label: '站点ID' },
  { value: 'company', label: '所属公司' },
  { value: 'site', label: '所属站点' },
  { value: 'id', label: '编号' },
]

const CHANGE_TYPE_OPTIONS = [
  { value: '账单', label: '账单' },
  { value: '集团管理', label: '集团管理' },
  { value: '公司管理', label: '公司管理' },
  { value: '站点管理', label: '站点管理' },
  { value: 'API管理', label: 'API管理' },
]

const CHANGE_ITEM_OPTIONS = [
  { value: '全部', label: '全部' },
  { value: '人工增加', label: '人工增加' },
  { value: '人工扣除', label: '人工扣除' },
  { value: '充币', label: '充币' },
  { value: '转入', label: '转入' },
  { value: '转出', label: '转出' },
  { value: '主站账单', label: '主站账单' },
  { value: 'API账单', label: 'API账单' },
  { value: '马甲包账单', label: '马甲包账单' },
  { value: '押金增加', label: '押金增加' },
  { value: '极光账单', label: '极光账单' },
  { value: '开站费扣除', label: '开站费扣除' },
  { value: '押金扣除', label: '押金扣除' },
  { value: '账单返利', label: '账单返利' },
  { value: '专业SEO费用', label: '专业SEO费用' },
  { value: '冻结理赔保证金', label: '冻结理赔保证金' },
  { value: '解冻理赔保证金', label: '解冻理赔保证金' },
  { value: '赎回保证金', label: '赎回保证金' },
  { value: '账单结算返现', label: '账单结算返现' },
  { value: '滞纳金', label: '滞纳金' },
  { value: '站点合并清除余额', label: '站点合并清除余额' },
  { value: '站点合并增加余额', label: '站点合并增加余额' },
  { value: '站点合并押金扣除', label: '站点合并押金扣除' },
  { value: '站点合并押金增加', label: '站点合并押金增加' },
]

const COUNTERPARTY_OPTIONS = [
  { value: '系统', label: '系统' },
  { value: '集团', label: '集团' },
  { value: '公司', label: '公司' },
  { value: '站点', label: '站点' },
]

const PERSONAL_CHANGE_TYPE_OPTIONS = [
  { value: '全部', label: '全部' },
  { value: '商务佣金返佣', label: '商务佣金返佣' },
  { value: '我的推荐返佣', label: '我的推荐返佣' },
  { value: '转为余额', label: '转为余额' },
  { value: '人工扣除', label: '人工扣除' },
  { value: '提币', label: '提币' },
]

const PERSONAL_COUNTERPARTY_OPTIONS = [
  { value: '系统', label: '系统' },
  { value: '集团', label: '集团' },
  { value: '公司', label: '公司' },
  { value: '站点', label: '站点' },
  { value: '钱包', label: '钱包' },
]

const RECHARGE_TIME_OPTIONS = [
  { value: 'deposit', label: '充币时间' },
  { value: 'review', label: '审核时间' },
]

const RECHARGE_SITE_OPTIONS = [
  { value: 'company', label: '公司名称' },
  { value: 'siteName', label: '站点名称' },
  { value: 'siteId', label: '站点ID' },
]

const RECHARGE_ORDER_FIELD_OPTIONS = [
  { value: 'orderNo', label: '订单号' },
  { value: 'txHash', label: '交易哈希值' },
  { value: 'walletOrderNo', label: '钱包订单号' },
]

const ORDER_STATUS_OPTIONS = [
  { value: '待支付', label: '待支付' },
  { value: '支付成功', label: '支付成功' },
  { value: '支付失败', label: '支付失败' },
  { value: '支付超时', label: '支付超时' },
]

const ORDER_TYPE_OPTIONS = [
  { value: '后台订单', label: '后台订单' },
  { value: '链上转账', label: '链上转账' },
  { value: '保证金充值', label: '保证金充值' },
]

const GROUP_CHANGE_ROWS: GroupChangeRow[] = [
  {
    key: '1',
    id: '2087441196633833474',
    time: '2026-08-12 15:28:58',
    groupName: '伯乐(1179)',
    companyName: '无',
    brandName: '3365bet(5608)',
    changeType: '账单',
    changeItem: '账单结算返现',
    counterparty: '系统',
    before: '122.14',
    amount: 79.97,
    after: '202.11',
    operator: 'system',
    remark: '',
  },
  {
    key: '2',
    id: '2087441196633833475',
    time: '2026-08-12 14:10:22',
    groupName: '伯乐(1179)',
    companyName: '无',
    brandName: 'Librapg(5922)',
    changeType: '账单',
    changeItem: '账单结算返现',
    counterparty: '系统',
    before: '7.73',
    amount: 87.17,
    after: '94.90',
    operator: 'system',
    remark: '',
  },
  {
    key: '3',
    id: '2087441196633833476',
    time: '2026-08-11 22:05:11',
    groupName: '伯乐(1179)',
    companyName: '无',
    brandName: 'felizpg(5672)',
    changeType: '账单',
    changeItem: '账单结算返现',
    counterparty: '系统',
    before: '450.00',
    amount: -820.5,
    after: '-370.50',
    operator: 'system',
    remark: '',
  },
  {
    key: '4',
    id: '2087441196633833477',
    time: '2026-08-11 18:40:03',
    groupName: '伯乐(1179)',
    companyName: '无',
    brandName: 'cianopg(6153)',
    changeType: '账单',
    changeItem: '账单结算返现',
    counterparty: '系统',
    before: '1,200.00',
    amount: -1560,
    after: '-360.00',
    operator: 'system',
    remark: '',
  },
  {
    key: '5',
    id: '2087441196633833478',
    time: '2026-08-10 09:18:44',
    groupName: '伯乐(1179)',
    companyName: '无',
    brandName: 'am-2.bet(7252)',
    changeType: '账单',
    changeItem: '账单结算返现',
    counterparty: '系统',
    before: '88.20',
    amount: 55.3,
    after: '143.50',
    operator: 'system',
    remark: '',
  },
]

/** 总控全平台额外账变（其他集团） */
const MASTER_EXTRA_GROUP_ROWS: GroupChangeRow[] = [
  {
    key: 'm1',
    id: '2091001001001001001',
    time: '2026-08-14 11:20:08',
    groupName: '星辰(2201)',
    companyName: '星辰科技(88)',
    brandName: 'starpg(8801)',
    changeType: '集团管理',
    changeItem: '人工增加',
    counterparty: '集团',
    before: '10,000.00',
    amount: 5000,
    after: '15,000.00',
    operator: 'master_ops',
    remark: '全平台演示',
  },
  {
    key: 'm2',
    id: '2091001001001001002',
    time: '2026-08-13 16:45:30',
    groupName: '银河(3305)',
    companyName: '无',
    brandName: 'galaxybet(3305)',
    changeType: '账单',
    changeItem: '主站账单',
    counterparty: '系统',
    before: '2,200.00',
    amount: -880.4,
    after: '1,319.60',
    operator: 'system',
    remark: '',
  },
  {
    key: 'm3',
    id: '2091001001001001003',
    time: '2026-08-12 09:12:01',
    groupName: '蓝海(4410)',
    companyName: '蓝海互动(12)',
    brandName: 'blueocean(4412)',
    changeType: '站点管理',
    changeItem: '押金增加',
    counterparty: '站点',
    before: '0.00',
    amount: 20000,
    after: '20,000.00',
    operator: 'master_fin',
    remark: '开站押金',
  },
]

const RECHARGE_ROWS: RechargeRow[] = [
  {
    key: '1',
    orderNo: '2089011223344556677',
    walletOrderNo: 'USDU8K2M9P1Q',
    orderType: '后台订单',
    time: '2026-08-14 10:22:15',
    groupName: '伯乐(1179)',
    companyName: '无',
    siteName: '无',
    orderAmount: 5000,
    receivedAmount: 5060,
    giftAmount: 60,
    applicant: 'gabriel123',
    chain: 'TRC20',
    txHash: '0x8a1b2c3d4e5f678901234567890abcdef1234567890',
    status: '支付成功',
    reviewer: 'system',
    reviewTime: '2026-08-14 10:23:00',
    remark: '',
  },
  {
    key: '2',
    orderNo: '2089011223344556688',
    walletOrderNo: 'USDU7N4R2T8W',
    orderType: '后台订单',
    time: '2026-08-13 23:50:40',
    groupName: '伯乐(1179)',
    companyName: '无',
    siteName: 'cianopg(6153)',
    orderAmount: 10000,
    receivedAmount: 10120,
    giftAmount: 120,
    applicant: 'cooper',
    chain: 'TRC20',
    txHash: '0x9f0e1d2c3b4a5968778899aabbccddeeff001122',
    status: '支付成功',
    reviewer: 'system',
    reviewTime: '2026-08-13 23:52:00',
    remark: '',
  },
  {
    key: '3',
    orderNo: '2089011223344556699',
    walletOrderNo: 'USDU5H6J7K8L',
    orderType: '后台订单',
    time: '2026-08-12 16:08:21',
    groupName: '伯乐(1179)',
    companyName: '无',
    siteName: '无',
    orderAmount: 2000,
    receivedAmount: 0,
    giftAmount: 0,
    applicant: 'tempo',
    chain: 'TRC20',
    txHash: '0x11223344556677889900aabbccddeeff99887766',
    status: '支付失败',
    reviewer: 'system',
    reviewTime: '2026-08-12 16:10:05',
    remark: '链上确认超时',
  },
]

const MASTER_EXTRA_RECHARGE_ROWS: RechargeRow[] = [
  {
    key: 'm1',
    orderNo: '3099011223344556700',
    walletOrderNo: 'USDTX1Y2Z3',
    orderType: '链上转账',
    time: '2026-08-14 19:08:11',
    groupName: '星辰(2201)',
    companyName: '星辰科技(88)',
    siteName: 'starpg(8801)',
    orderAmount: 8000,
    receivedAmount: 8000,
    giftAmount: 0,
    applicant: 'star_admin',
    chain: 'TRC20',
    txHash: '0xabcdef0123456789abcdef0123456789abcdef01',
    status: '支付成功',
    reviewer: 'master_ops',
    reviewTime: '2026-08-14 19:10:00',
    remark: '',
  },
  {
    key: 'm2',
    orderNo: '3099011223344556701',
    walletOrderNo: 'USDTA9B8C7',
    orderType: '保证金充值',
    time: '2026-08-11 12:00:00',
    groupName: '蓝海(4410)',
    companyName: '蓝海互动(12)',
    siteName: 'blueocean(4412)',
    orderAmount: 20000,
    receivedAmount: 20000,
    giftAmount: 0,
    applicant: 'blue_ops',
    chain: 'TRC20',
    txHash: '0x99887766554433221100ffeeddccbbaa99887766',
    status: '待支付',
    reviewer: '-',
    reviewTime: '-',
    remark: '',
  },
]

function copyText(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => message.success(`已复制：${text}`),
    () => message.info(`复制：${text}（原型）`),
  )
}

function formatMoney(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function amountCell(amount: number) {
  const text = `${amount > 0 ? '+' : ''}${formatMoney(amount)}`
  return <span style={{ color: amount >= 0 ? '#52c41a' : '#ff4d4f' }}>{text}</span>
}

function periodRange(period: Period): [Dayjs, Dayjs] {
  const end = dayjs().endOf('day')
  if (period === 'day') return [dayjs().startOf('day'), end]
  if (period === 'week') return [dayjs().subtract(6, 'day').startOf('day'), end]
  return [dayjs().subtract(29, 'day').startOf('day'), end]
}

function PeriodButtons({
  value,
  onChange,
}: {
  value: Period
  onChange: (p: Period) => void
}) {
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

function TabLabel({ label, badge }: { label: string; badge?: boolean }) {
  return (
    <span className="group-change-tab-label">
      {label}
      {badge ? <span className="group-change-tab-badge">新</span> : null}
    </span>
  )
}

export type GroupBalanceChangeMode = 'merchant' | 'master'

export default function GroupBalanceChangePage({ mode = 'merchant' }: { mode?: GroupBalanceChangeMode }) {
  const isMaster = mode === 'master'
  const [subTab, setSubTab] = useState<ChangeTab>('group')
  const [period, setPeriod] = useState<Period>('week')
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(() => periodRange('week'))
  const [siteId, setSiteId] = useState('')
  const [keywordField, setKeywordField] = useState('siteId')
  const [groupFilter, setGroupFilter] = useState<string>()
  const [changeType, setChangeType] = useState<string>()
  const [changeItem, setChangeItem] = useState<string>()
  const [counterparty, setCounterparty] = useState<string>()
  const [serialNo, setSerialNo] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [rechargeTimeField, setRechargeTimeField] = useState('deposit')
  const [rechargeSiteField, setRechargeSiteField] = useState('siteId')
  const [rechargeOrderField, setRechargeOrderField] = useState('orderNo')
  const [orderStatus, setOrderStatus] = useState<string>()
  const [orderType, setOrderType] = useState<string>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])

  const sourceGroupRows = useMemo(
    () => (isMaster ? [...MASTER_EXTRA_GROUP_ROWS, ...GROUP_CHANGE_ROWS] : GROUP_CHANGE_ROWS),
    [isMaster],
  )
  const sourceRechargeRows = useMemo(
    () => (isMaster ? [...MASTER_EXTRA_RECHARGE_ROWS, ...RECHARGE_ROWS] : RECHARGE_ROWS),
    [isMaster],
  )

  const groupOptions = useMemo(() => {
    const names = Array.from(new Set(sourceGroupRows.map((r) => r.groupName)))
    return names.map((n) => ({ value: n, label: n }))
  }, [sourceGroupRows])

  const onPeriodChange = (p: Period) => {
    setPeriod(p)
    setRange(periodRange(p))
  }

  const reset = () => {
    setPeriod('week')
    setRange(periodRange('week'))
    setSiteId('')
    setKeywordField('siteId')
    setGroupFilter(undefined)
    setChangeType(undefined)
    setChangeItem(undefined)
    setCounterparty(undefined)
    setSerialNo('')
    setOrderNo('')
    setRechargeTimeField('deposit')
    setRechargeSiteField('siteId')
    setRechargeOrderField('orderNo')
    setOrderStatus(undefined)
    setOrderType(undefined)
    setPage(1)
    setSelectedKeys([])
  }

  const groupRows = useMemo(() => {
    return sourceGroupRows.filter((r) => {
      if (groupFilter && r.groupName !== groupFilter) return false
      if (siteId) {
        const q = siteId.trim()
        if (keywordField === 'id' && !r.id.includes(q)) return false
        if (keywordField === 'company' && !r.companyName.includes(q)) return false
        if (keywordField === 'site' && !r.brandName.includes(q)) return false
        if (keywordField === 'siteId' && !r.brandName.includes(q) && !r.id.includes(q)) return false
      }
      if (changeType && r.changeType !== changeType) return false
      if (changeItem && changeItem !== '全部' && r.changeItem !== changeItem) return false
      if (counterparty && r.counterparty !== counterparty) return false
      return true
    })
  }, [sourceGroupRows, siteId, keywordField, groupFilter, changeType, changeItem, counterparty])

  const personalRows = useMemo(() => {
    return [] as PersonalChangeRow[]
  }, [])

  const rechargeRows = useMemo(() => {
    return sourceRechargeRows.filter((r) => {
      if (groupFilter && r.groupName !== groupFilter) return false
      if (siteId) {
        const q = siteId.trim()
        if (rechargeSiteField === 'company' && !r.companyName.includes(q)) return false
        if (rechargeSiteField === 'siteName' && !r.siteName.includes(q)) return false
        if (rechargeSiteField === 'siteId' && !r.siteName.includes(q) && r.siteName !== '无') return false
      }
      if (orderNo) {
        const q = orderNo.trim()
        if (rechargeOrderField === 'orderNo' && !r.orderNo.includes(q)) return false
        if (rechargeOrderField === 'txHash' && !r.txHash.includes(q)) return false
        if (rechargeOrderField === 'walletOrderNo' && !r.walletOrderNo.includes(q)) return false
      }
      if (orderStatus && r.status !== orderStatus) return false
      if (orderType && r.orderType !== orderType) return false
      return true
    })
  }, [
    sourceRechargeRows,
    groupFilter,
    siteId,
    rechargeSiteField,
    orderNo,
    rechargeOrderField,
    orderStatus,
    orderType,
  ])

  const groupAmountTotal = useMemo(
    () => groupRows.reduce((sum, r) => sum + r.amount, 0),
    [groupRows],
  )

  const rechargeTotals = useMemo(() => {
    return rechargeRows.reduce(
      (acc, r) => {
        acc.order += r.orderAmount
        acc.received += r.receivedAmount
        acc.gift += r.giftAmount
        return acc
      },
      { order: 0, received: 0, gift: 0 },
    )
  }, [rechargeRows])

  const groupColumns: ColumnsType<GroupChangeRow> = [
    { title: '编号', dataIndex: 'id', width: 190, align: 'center' },
    { title: '账变时间', dataIndex: 'time', width: 160, align: 'center' },
    { title: '所属集团(ID)', dataIndex: 'groupName', width: 120, align: 'center' },
    { title: '所属公司(ID)', dataIndex: 'companyName', width: 110, align: 'center' },
    { title: '品牌名称(ID)', dataIndex: 'brandName', width: 140, align: 'center' },
    { title: '账变类型', dataIndex: 'changeType', width: 100, align: 'center' },
    { title: '账变细项', dataIndex: 'changeItem', width: 130, align: 'center' },
    { title: '交易对象', dataIndex: 'counterparty', width: 100, align: 'center' },
    { title: '变动前余额', dataIndex: 'before', width: 110, align: 'center' },
    {
      title: '变动金额',
      dataIndex: 'amount',
      width: 110,
      align: 'center',
      render: (v: number) => amountCell(v),
    },
    { title: '变动后余额', dataIndex: 'after', width: 110, align: 'center' },
    { title: '操作人', dataIndex: 'operator', width: 90, align: 'center' },
    { title: '前台备注', dataIndex: 'remark', width: 120, align: 'center', render: (v) => v || '-' },
  ]

  const personalColumns: ColumnsType<PersonalChangeRow> = [
    { title: '编号', dataIndex: 'id', width: 190, align: 'center' },
    { title: '账变时间', dataIndex: 'time', width: 160, align: 'center' },
    { title: '所属集团(ID)', dataIndex: 'groupName', width: 120, align: 'center' },
    { title: '后台账号', dataIndex: 'account', width: 120, align: 'center' },
    { title: '账变类型', dataIndex: 'changeType', width: 100, align: 'center' },
    { title: '交易对象', dataIndex: 'counterparty', width: 100, align: 'center' },
    { title: '变动前余额', dataIndex: 'before', width: 110, align: 'center' },
    {
      title: '变动金额',
      dataIndex: 'amount',
      width: 110,
      align: 'center',
      render: (v: number) => amountCell(v),
    },
    { title: '变动后余额', dataIndex: 'after', width: 110, align: 'center' },
    { title: '备注', dataIndex: 'remark', width: 140, align: 'center', render: (v) => v || '-' },
  ]

  const rechargeColumns: ColumnsType<RechargeRow> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 200,
      align: 'center',
      render: (v: string) => (
        <span className="group-change-copy-cell">
          {v}
          <CopyOutlined onClick={() => copyText(v)} />
        </span>
      ),
    },
    {
      title: '钱包订单号',
      dataIndex: 'walletOrderNo',
      width: 150,
      align: 'center',
      render: (v: string) => (
        <span className="group-change-copy-cell">
          <a onClick={() => message.info('钱包订单详情（原型）')}>{v}</a>
          <CopyOutlined onClick={() => copyText(v)} />
        </span>
      ),
    },
    { title: '订单类型', dataIndex: 'orderType', width: 100, align: 'center' },
    { title: '充币时间', dataIndex: 'time', width: 160, align: 'center' },
    { title: '所属集团(ID)', dataIndex: 'groupName', width: 120, align: 'center' },
    { title: '所属公司(ID)', dataIndex: 'companyName', width: 110, align: 'center' },
    { title: '所属站点(ID)', dataIndex: 'siteName', width: 130, align: 'center' },
    {
      title: '充币订单金额',
      dataIndex: 'orderAmount',
      width: 120,
      align: 'center',
      render: (v: number) => formatMoney(v),
    },
    {
      title: '实际到账金额(U)',
      dataIndex: 'receivedAmount',
      width: 130,
      align: 'center',
      render: (v: number) => formatMoney(v),
    },
    {
      title: '赠送金额(U)',
      dataIndex: 'giftAmount',
      width: 110,
      align: 'center',
      render: (v: number) => formatMoney(v),
    },
    { title: '申请人', dataIndex: 'applicant', width: 110, align: 'center' },
    { title: '公链协议', dataIndex: 'chain', width: 90, align: 'center' },
    {
      title: '交易哈希值',
      dataIndex: 'txHash',
      width: 180,
      align: 'center',
      render: (v: string) => (
        <a onClick={() => message.info('哈希详情（原型）')}>{`${v.slice(0, 10)}...${v.slice(-6)}`}</a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (v: RechargeRow['status']) => (
        <span
          style={{
            color: v === '支付成功' ? '#52c41a' : v === '待支付' ? '#1890ff' : '#ff4d4f',
          }}
        >
          {v}
        </span>
      ),
    },
    { title: '操作', key: 'action', width: 80, align: 'center', render: () => '-' },
    { title: '审核人', dataIndex: 'reviewer', width: 90, align: 'center' },
    { title: '审核时间', dataIndex: 'reviewTime', width: 160, align: 'center' },
    { title: '备注', dataIndex: 'remark', width: 120, align: 'center', render: (v) => v || '-' },
  ]

  const currentTotal =
    subTab === 'group' ? groupRows.length : subTab === 'personal' ? personalRows.length : rechargeRows.length

  const groupSummary: TableProps<GroupChangeRow>['summary'] = () =>
    groupRows.length ? (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={11} align="center">
            总计
          </Table.Summary.Cell>
          <Table.Summary.Cell index={11} align="center">
            {amountCell(groupAmountTotal)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={12} colSpan={3} />
        </Table.Summary.Row>
      </Table.Summary>
    ) : null

  const rechargeSummary: TableProps<RechargeRow>['summary'] = () =>
    rechargeRows.length ? (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={7} align="center">
            总计
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7} align="center">
            {formatMoney(rechargeTotals.order)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={8} align="center">
            {formatMoney(rechargeTotals.received)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={9} align="center">
            {formatMoney(rechargeTotals.gift)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={10} colSpan={8} />
        </Table.Summary.Row>
      </Table.Summary>
    ) : null

  return (
    <div className="org-page-panel group-change-page">
      <div className={`group-change-scope-banner ${isMaster ? 'is-master' : 'is-site'}`}>
        {isMaster
          ? '数据范围：全平台所有集团 / 站点（总控报表）'
          : '数据范围：当前站点所属集团（站点后台报表）'}
      </div>
      <Tabs
        className="site-open-tabs"
        activeKey={subTab}
        onChange={(k) => {
          setSubTab(k as ChangeTab)
          setPage(1)
          setSelectedKeys([])
        }}
        items={TAB_ITEMS.map((t) => ({
          key: t.key,
          label: <TabLabel label={t.label} badge={t.badge} />,
        }))}
      />

      <div className="site-open-filter">
        <div className="site-open-filter-row site-open-filter-row-between">
          <div className="site-open-filter-row">
            {subTab === 'recharge' ? (
              <Select
                value={rechargeTimeField}
                onChange={setRechargeTimeField}
                style={{ width: 100 }}
                options={RECHARGE_TIME_OPTIONS}
              />
            ) : null}
            <PeriodButtons value={period} onChange={onPeriodChange} />
            <FilterRangePicker
              value={range}
              onChange={(v) => setRange(v as [Dayjs, Dayjs] | null)}
              style={{ width: 360 }}
            />
            {isMaster ? (
              <Select
                allowClear
                placeholder="所属集团"
                value={groupFilter}
                onChange={setGroupFilter}
                options={groupOptions}
                style={{ width: 140 }}
                showSearch
                optionFilterProp="label"
              />
            ) : null}

            {subTab === 'group' ? (
              <>
                <Space.Compact>
                  <Select
                    value={keywordField}
                    onChange={setKeywordField}
                    style={{ width: 110 }}
                    options={GROUP_KEYWORD_OPTIONS}
                  />
                  <Input
                    placeholder={
                      keywordField === 'company'
                        ? '请输入所属公司'
                        : keywordField === 'site'
                          ? '请输入所属站点'
                          : keywordField === 'id'
                            ? '请输入编号'
                            : '请输入站点ID'
                    }
                    allowClear
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    style={{ width: 150 }}
                  />
                </Space.Compact>
                <Select
                  allowClear
                  placeholder="账变类型"
                  value={changeType}
                  onChange={setChangeType}
                  options={CHANGE_TYPE_OPTIONS}
                  style={{ width: 120 }}
                  popupMatchSelectWidth={false}
                />
                <Select
                  allowClear
                  placeholder="账变细项"
                  value={changeItem}
                  onChange={setChangeItem}
                  options={CHANGE_ITEM_OPTIONS}
                  style={{ width: 140 }}
                  listHeight={280}
                  popupMatchSelectWidth={false}
                />
                <Select
                  allowClear
                  placeholder="交易对象"
                  value={counterparty}
                  onChange={setCounterparty}
                  options={COUNTERPARTY_OPTIONS}
                  style={{ width: 120 }}
                  popupMatchSelectWidth={false}
                />
              </>
            ) : null}

            {subTab === 'personal' ? (
              <>
                <Input
                  placeholder="编号"
                  allowClear
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  style={{ width: 180 }}
                />
                <Select
                  allowClear
                  placeholder="账变类型"
                  value={changeType}
                  onChange={setChangeType}
                  options={PERSONAL_CHANGE_TYPE_OPTIONS}
                  style={{ width: 140 }}
                  popupMatchSelectWidth={false}
                />
                <Select
                  allowClear
                  placeholder="交易对象"
                  value={counterparty}
                  onChange={setCounterparty}
                  options={PERSONAL_COUNTERPARTY_OPTIONS}
                  style={{ width: 120 }}
                  popupMatchSelectWidth={false}
                />
              </>
            ) : null}

            {subTab === 'recharge' ? (
              <>
                <Space.Compact>
                  <Select
                    value={rechargeSiteField}
                    onChange={setRechargeSiteField}
                    style={{ width: 100 }}
                    options={RECHARGE_SITE_OPTIONS}
                  />
                  <Input
                    placeholder={
                      rechargeSiteField === 'company'
                        ? '请输入公司名称'
                        : rechargeSiteField === 'siteName'
                          ? '请输入站点名称'
                          : '请输入站点ID'
                    }
                    allowClear
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    style={{ width: 150 }}
                  />
                </Space.Compact>
                <Space.Compact>
                  <Select
                    value={rechargeOrderField}
                    onChange={setRechargeOrderField}
                    style={{ width: 110 }}
                    options={RECHARGE_ORDER_FIELD_OPTIONS}
                    popupMatchSelectWidth={false}
                  />
                  <Input
                    placeholder={
                      rechargeOrderField === 'txHash'
                        ? '请输入交易哈希值'
                        : rechargeOrderField === 'walletOrderNo'
                          ? '请输入钱包订单号'
                          : '请输入订单号'
                    }
                    allowClear
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    style={{ width: 180 }}
                  />
                </Space.Compact>
                <Select
                  allowClear
                  placeholder="全部状态"
                  value={orderStatus}
                  onChange={setOrderStatus}
                  options={ORDER_STATUS_OPTIONS}
                  style={{ width: 120 }}
                />
                <Select
                  allowClear
                  placeholder="订单类型"
                  value={orderType}
                  onChange={setOrderType}
                  options={ORDER_TYPE_OPTIONS}
                  style={{ width: 120 }}
                />
              </>
            ) : null}

            <Button type="primary" onClick={() => message.success('已按条件筛选（原型）')}>
              搜索
            </Button>
            <Button onClick={reset}>重置</Button>
          </div>
          <div className="site-open-filter-actions">
            <Button icon={<UploadOutlined />} onClick={() => message.info('导出报表（原型）')}>
              导出报表
            </Button>
          </div>
        </div>
      </div>

      {subTab === 'group' ? (
        <Table
          size="middle"
          rowKey="key"
          className="site-bill-table group-change-table"
          columns={groupColumns}
          dataSource={groupRows}
          scroll={{ x: 1800 }}
          pagination={false}
          rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
          locale={{ emptyText: '暂无数据' }}
          summary={groupSummary}
        />
      ) : null}

      {subTab === 'personal' ? (
        <Table
          size="middle"
          rowKey="key"
          className="site-bill-table group-change-table"
          columns={personalColumns}
          dataSource={personalRows}
          scroll={{ x: 1400 }}
          pagination={false}
          locale={{ emptyText: '暂无数据' }}
        />
      ) : null}

      {subTab === 'recharge' ? (
        <Table
          size="middle"
          rowKey="key"
          className="site-bill-table group-change-table"
          columns={rechargeColumns}
          dataSource={rechargeRows}
          scroll={{ x: 2400 }}
          pagination={false}
          locale={{ emptyText: '暂无数据' }}
          summary={rechargeSummary}
        />
      ) : null}

      <div className="org-table-footer group-change-footer">
        {currentTotal > 0 ? (
          <Pagination
            size="small"
            current={page}
            pageSize={pageSize}
            total={currentTotal}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['20', '50', '100']}
            onChange={(p, size) => {
              setPage(p)
              setPageSize(size)
            }}
            showTotal={(t) => `共 ${t} 条`}
          />
        ) : (
          <span>共 0 条</span>
        )}
      </div>
    </div>
  )
}
