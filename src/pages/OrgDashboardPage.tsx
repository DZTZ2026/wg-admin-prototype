import { useMemo, useState, type ReactNode } from 'react'
import {
  BarChartOutlined,
  GiftOutlined,
  RiseOutlined,
  TeamOutlined,
  TransactionOutlined,
  TrophyOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Button, Select, Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import FilterRangePicker from '../components/FilterRangePicker'

type TrendTab = 'register' | 'online' | 'players'
type OverviewPeriod = 'week' | 'month'
type GameDim = 'type' | 'platform'

interface MetricCard {
  title: string
  value: string
  delta?: string
  deltaUp?: boolean
  meta: string
  color: string
  icon: ReactNode
}

interface SeriesPoint {
  x: string
  y: number
}

interface ChartSeries {
  name: string
  color: string
  points: SeriesPoint[]
}

interface OverviewRow {
  key: string
  date: string
  newAgent: number
  reg: number
  depositUsers: number
  firstDeposit: number
  bigR: number
  depositTotal: number
  withdrawTotal: number
  diff: number
  betUsers: number
  validBet: number
  killRate: number
  pnl: number
}

const METRIC_KEYS = [
  '新增代理',
  '新增会员',
  '充值次数',
  '充值总额',
  '提现次数',
  '提现总额',
  '首充人数',
  '充值人数',
  '提现人数',
  '每日优惠',
  '投注总额',
  '有效投注',
  '投注人数',
  '损益',
] as const

const GAME_METRICS = new Set(['投注总额', '有效投注', '投注人数', '损益'])

const REFRESH_OPTIONS = [
  { value: 'off', label: '不自动刷新' },
  { value: '15', label: '15秒刷新一次' },
  { value: '30', label: '30秒刷新一次' },
  { value: '60', label: '60秒刷新一次' },
]

const TYPE_OPTIONS = [
  { value: 'all', label: '全部类型' },
  { value: 'normal', label: '正常' },
  { value: 'bot', label: '疑似机器人' },
]

const DIM_OPTIONS = [
  { value: 'platform', label: '平台' },
  { value: 'country', label: '国别' },
  { value: 'system', label: '系统' },
  { value: 'port', label: '端口' },
]

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00:00`)

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function buildHourly(seed: number, peak = 8): SeriesPoint[] {
  return HOURS.map((x, i) => {
    const early = i <= 3 ? peak * (0.4 + seeded(seed + i) * 0.6) : peak * 0.15 + seeded(seed + i) * 1.2
    return { x, y: Math.round(early * 10) / 10 }
  })
}

function buildDaily(seed: number, days: number, base = 5, swing = 10): SeriesPoint[] {
  const start = dayjs('2026-07-17')
  return Array.from({ length: days }, (_, i) => {
    const d = start.add(i, 'day')
    const y = Math.max(0, Math.round((base + seeded(seed + i) * swing - swing / 3) * 10) / 10)
    return { x: d.format('YYYY-MM-DD'), y }
  })
}

function buildSignedDaily(seed: number, days: number): SeriesPoint[] {
  const start = dayjs('2026-07-17')
  return Array.from({ length: days }, (_, i) => {
    const d = start.add(i, 'day')
    const y = Math.round((seeded(seed + i) - 0.45) * 3000)
    return { x: d.format('YYYY-MM-DD'), y }
  })
}

const FOCUS_CARDS: MetricCard[] = [
  {
    title: '今日新增',
    value: '1',
    delta: '-50%',
    deltaUp: false,
    meta: '首充0人  代理1人  大R0人',
    color: 'linear-gradient(135deg,#f7b733,#fc4a1a)',
    icon: <UserAddOutlined />,
  },
  {
    title: '会员总数',
    value: '410,195',
    delta: '+0.39%',
    deltaUp: true,
    meta: '首充总数227179人  代理总数20693人  大R总数27人次',
    color: 'linear-gradient(135deg,#36d1dc,#5b86e5)',
    icon: <TeamOutlined />,
  },
  {
    title: '充提差额',
    value: '52(U)',
    meta: '今日充值66 (2人)  今日提现13 (1人)',
    color: 'linear-gradient(135deg,#f093fb,#f5576c)',
    icon: <TransactionOutlined />,
  },
  {
    title: '今日投注',
    value: '204(U)',
    meta: '今日注单523  今日杀率 33.06%',
    color: 'linear-gradient(135deg,#4e54c8,#8f94fb)',
    icon: <TrophyOutlined />,
  },
  {
    title: '今日损益',
    value: '67(U)',
    meta: '利润 48(U)  存量 54,101(U)  会员余额 52,629(U)',
    color: 'linear-gradient(135deg,#11998e,#38ef7d)',
    icon: <RiseOutlined />,
  },
  {
    title: '今日优惠',
    value: '18(U)',
    meta: '活动参与人数 5  任务 9  活动 8',
    color: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    icon: <GiftOutlined />,
  },
]

const OVERVIEW_ROWS: OverviewRow[] = [
  {
    key: 'today',
    date: '今日',
    newAgent: 1,
    reg: 1,
    depositUsers: 2,
    firstDeposit: 0,
    bigR: 0,
    depositTotal: 66.52,
    withdrawTotal: 13.57,
    diff: 52.95,
    betUsers: 8,
    validBet: 204.68,
    killRate: 33.06,
    pnl: 67.69,
  },
  {
    key: 'yesterday',
    date: '昨日',
    newAgent: 0,
    reg: 2,
    depositUsers: 31,
    firstDeposit: 3,
    bigR: 0,
    depositTotal: 3885.51,
    withdrawTotal: 4057.78,
    diff: -172.27,
    betUsers: 32,
    validBet: 13580.4,
    killRate: 3.95,
    pnl: 536.32,
  },
  {
    key: 'week',
    date: '本周',
    newAgent: 3,
    reg: 12,
    depositUsers: 48,
    firstDeposit: 5,
    bigR: 1,
    depositTotal: 12680.2,
    withdrawTotal: 9820.15,
    diff: 2860.05,
    betUsers: 96,
    validBet: 48220.5,
    killRate: 8.42,
    pnl: 4058.2,
  },
  {
    key: 'lastWeek',
    date: '上周',
    newAgent: 2,
    reg: 9,
    depositUsers: 41,
    firstDeposit: 4,
    bigR: 0,
    depositTotal: 10220.0,
    withdrawTotal: 11080.4,
    diff: -860.4,
    betUsers: 88,
    validBet: 41600.0,
    killRate: 6.1,
    pnl: 2536.0,
  },
  {
    key: 'month',
    date: '本月',
    newAgent: 11,
    reg: 56,
    depositUsers: 210,
    firstDeposit: 28,
    bigR: 3,
    depositTotal: 86540.6,
    withdrawTotal: 79210.3,
    diff: 7330.3,
    betUsers: 420,
    validBet: 312800.0,
    killRate: 7.25,
    pnl: 22680.5,
  },
  {
    key: 'lastMonth',
    date: '上月',
    newAgent: 9,
    reg: 48,
    depositUsers: 188,
    firstDeposit: 22,
    bigR: 2,
    depositTotal: 74210.0,
    withdrawTotal: 76880.0,
    diff: -2670.0,
    betUsers: 390,
    validBet: 288400.0,
    killRate: 5.8,
    pnl: 16720.0,
  },
]

function money(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function signedColor(n: number, mode: 'diff' | 'pnl' = 'diff') {
  if (n < 0) return '#ff4d4f'
  if (mode === 'pnl') return '#52c41a'
  return '#1890ff'
}

function SimpleLineChart({
  series,
  height = 260,
  yTicks = 5,
}: {
  series: ChartSeries[]
  height?: number
  yTicks?: number
}) {
  const width = 960
  const pad = { top: 28, right: 20, bottom: 36, left: 52 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const allY = series.flatMap((s) => s.points.map((p) => p.y))
  const minY = Math.min(0, ...allY)
  const maxY = Math.max(1, ...allY)
  const span = maxY - minY || 1
  const xs = series[0]?.points.map((p) => p.x) || []

  const xAt = (i: number) => pad.left + (xs.length <= 1 ? innerW / 2 : (i / (xs.length - 1)) * innerW)
  const yAt = (v: number) => pad.top + ((maxY - v) / span) * innerH

  const tickVals = Array.from({ length: yTicks }, (_, i) => minY + (span * i) / (yTicks - 1))
  const xLabelStep = Math.max(1, Math.ceil(xs.length / 12))

  return (
    <div className="org-dash-chart-wrap">
      <div className="org-dash-chart-legend">
        {series.map((s) => (
          <span key={s.name} className="org-dash-legend-item">
            <i style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="org-dash-chart-svg" role="img">
        {tickVals.map((v) => (
          <g key={v}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={yAt(v)}
              y2={yAt(v)}
              stroke="#f0f0f0"
              strokeWidth={1}
            />
            <text x={pad.left - 8} y={yAt(v) + 4} textAnchor="end" className="org-dash-axis-text">
              {Number.isInteger(v) ? v : v.toFixed(1)}
            </text>
          </g>
        ))}
        {xs.map((label, i) =>
          i % xLabelStep === 0 ? (
            <text key={label} x={xAt(i)} y={height - 10} textAnchor="middle" className="org-dash-axis-text">
              {label.length > 10 ? label.slice(5) : label.replace(/:00$/, '')}
            </text>
          ) : null,
        )}
        {series.map((s) => {
          const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(p.y)}`).join(' ')
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={2} />
              {s.points.map((p, i) => (
                <circle key={`${s.name}-${p.x}`} cx={xAt(i)} cy={yAt(p.y)} r={3} fill={s.color} />
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function OrgDashboardPage() {
  const [trendTab, setTrendTab] = useState<TrendTab>('register')
  const [userType, setUserType] = useState('all')
  const [dimField, setDimField] = useState('platform')
  const [period, setPeriod] = useState<OverviewPeriod>('month')
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs('2026-07-17').startOf('day'),
    dayjs('2026-08-15').endOf('day'),
  ])
  const [metric, setMetric] = useState<(typeof METRIC_KEYS)[number]>('新增代理')
  const [gameDim, setGameDim] = useState<GameDim>('type')
  const [refresh, setRefresh] = useState('off')

  const trendSeries = useMemo((): ChartSeries[] => {
    if (trendTab === 'register') {
      return [{ name: '今日注册', color: '#eb2f96', points: buildHourly(1, 1).map((p, i) => ({ ...p, y: i === 0 ? 0 : 1 })) }]
    }
    if (trendTab === 'players') {
      return [
        { name: '全部', color: '#1890ff', points: buildHourly(11, 9) },
        { name: '电子', color: '#52c41a', points: buildHourly(12, 7) },
        { name: '捕鱼', color: '#eb2f96', points: buildHourly(13, 2) },
      ]
    }
    return [
      { name: '全部', color: '#52c41a', points: buildHourly(21, 10) },
      { name: 'MG', color: '#f5222d', points: buildHourly(22, 6) },
      { name: 'PG', color: '#1890ff', points: buildHourly(23, 5) },
      { name: 'WG', color: '#722ed1', points: buildHourly(24, 4) },
      { name: '大厅', color: '#fa8c16', points: buildHourly(25, 3) },
    ]
  }, [trendTab])

  const overviewSeries = useMemo((): ChartSeries[] => {
    const days = period === 'week' ? 7 : 30
    if (!GAME_METRICS.has(metric)) {
      const color = '#69c0ff'
      const points =
        metric === '新增代理' || metric === '新增会员'
          ? buildDaily(30 + metric.length, days, 2, 6)
          : metric.includes('总额') || metric === '每日优惠'
            ? buildDaily(40 + metric.length, days, 800, 4000)
            : buildDaily(50 + metric.length, days, 8, 40)
      return [{ name: metric, color, points }]
    }

    if (gameDim === 'type') {
      const maker = metric === '损益' ? buildSignedDaily : buildDaily
      return [
        {
          name: '全部',
          color: '#1890ff',
          points: metric === '损益' ? maker(60, days) : buildDaily(60, days, 6000, 12000),
        },
        {
          name: '电子',
          color: '#73d13d',
          points: metric === '损益' ? maker(61, days) : buildDaily(61, days, 5000, 10000),
        },
        {
          name: '捕鱼',
          color: '#eb2f96',
          points: metric === '损益' ? maker(62, days) : buildDaily(62, days, 200, 800),
        },
      ]
    }

    const platforms = [
      { name: '全部', color: '#1890ff', seed: 70 },
      { name: 'Askmeslot', color: '#73d13d', seed: 71 },
      { name: 'JDB', color: '#f5222d', seed: 72 },
      { name: 'MG', color: '#eb2f96', seed: 73 },
      { name: 'PG', color: '#9254de', seed: 74 },
      { name: 'WG', color: '#fa8c16', seed: 75 },
    ]
    return platforms.map((p) => ({
      name: p.name,
      color: p.color,
      points: metric === '损益' ? buildSignedDaily(p.seed, days) : buildDaily(p.seed, days, 2000, 8000),
    }))
  }, [gameDim, metric, period])

  const overviewColumns: ColumnsType<OverviewRow> = [
    { title: '日期', dataIndex: 'date', width: 80, align: 'center' },
    { title: '新增代理', dataIndex: 'newAgent', width: 90, align: 'center' },
    {
      title: '会员(人)',
      children: [
        { title: '注册', dataIndex: 'reg', width: 70, align: 'center' },
        { title: '充值', dataIndex: 'depositUsers', width: 70, align: 'center' },
        { title: '首充', dataIndex: 'firstDeposit', width: 70, align: 'center' },
        { title: '大R玩家', dataIndex: 'bigR', width: 80, align: 'center' },
      ],
    },
    {
      title: '充提',
      children: [
        {
          title: '充值总额(U)',
          dataIndex: 'depositTotal',
          width: 120,
          align: 'center',
          render: (v: number) => money(v),
        },
        {
          title: '提现总额(U)',
          dataIndex: 'withdrawTotal',
          width: 120,
          align: 'center',
          render: (v: number) => money(v),
        },
        {
          title: '充提差额(U)',
          dataIndex: 'diff',
          width: 120,
          align: 'center',
          render: (v: number) => <span style={{ color: signedColor(v, 'diff') }}>{money(v)}</span>,
        },
      ],
    },
    {
      title: '游戏',
      children: [
        { title: '投注人数', dataIndex: 'betUsers', width: 90, align: 'center' },
        {
          title: '有效投注(U)',
          dataIndex: 'validBet',
          width: 120,
          align: 'center',
          render: (v: number) => money(v),
        },
        {
          title: '杀率',
          dataIndex: 'killRate',
          width: 80,
          align: 'center',
          render: (v: number) => `${v.toFixed(2)}%`,
        },
        {
          title: '损益(U)',
          dataIndex: 'pnl',
          width: 110,
          align: 'center',
          render: (v: number) => <span style={{ color: signedColor(v, 'pnl') }}>{money(v)}</span>,
        },
      ],
    },
  ]

  return (
    <div className="org-dashboard-page">
      <div className="org-dash-top-filters">
        <Select defaultValue="allCurrency" style={{ width: 120 }} options={[{ value: 'allCurrency', label: '全部币种' }]} />
        <Select defaultValue="allData" style={{ width: 120 }} options={[{ value: 'allData', label: '全部数据' }]} />
      </div>

      <section className="org-dash-section">
        <div className="org-dash-section-head">
          <div className="org-dash-section-title">今日即时焦点</div>
          <div className="org-dash-section-actions">
            <Select defaultValue="allCompany" style={{ width: 120 }} options={[{ value: 'allCompany', label: '全部公司' }]} />
            <Select defaultValue="allSite" style={{ width: 120 }} options={[{ value: 'allSite', label: '全部站点' }]} />
          </div>
        </div>
        <div className="org-dash-focus-grid">
          {FOCUS_CARDS.map((c) => (
            <div key={c.title} className="org-dash-focus-card" style={{ background: c.color }}>
              <div className="org-dash-focus-top">
                <span className="org-dash-focus-label">{c.title}</span>
                {c.delta ? (
                  <span className={`org-dash-focus-delta ${c.deltaUp ? 'up' : 'down'}`}>{c.delta}</span>
                ) : null}
              </div>
              <div className="org-dash-focus-body">
                <div className="org-dash-focus-value">{c.value}</div>
                <div className="org-dash-focus-icon">{c.icon}</div>
              </div>
              <div className="org-dash-focus-meta">{c.meta}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="org-dash-section org-dash-panel">
        <div className="org-dash-trend-bar">
          <Tabs
            className="org-dash-inline-tabs"
            activeKey={trendTab}
            onChange={(k) => setTrendTab(k as TrendTab)}
            items={[
              { key: 'register', label: '今日注册' },
              { key: 'online', label: '当前在线' },
              { key: 'players', label: '游戏人数' },
            ]}
          />
          {trendTab === 'online' ? (
            <div className="org-dash-trend-filters">
              <Select value={userType} onChange={setUserType} options={TYPE_OPTIONS} style={{ width: 120 }} />
              <Select value={dimField} onChange={setDimField} options={DIM_OPTIONS} style={{ width: 100 }} />
            </div>
          ) : null}
        </div>
        <SimpleLineChart series={trendSeries} height={280} />
      </section>

      <section className="org-dash-section org-dash-panel">
        <div className="org-dash-section-title org-dash-overview-title">运营总览</div>
        <div className="org-dash-overview-filters">
          <div className="org-dash-period">
            <button type="button" className={period === 'week' ? 'active' : ''} onClick={() => setPeriod('week')}>
              周
            </button>
            <button type="button" className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>
              月
            </button>
          </div>
          <FilterRangePicker
            value={range}
            onChange={(v) => setRange(v as [Dayjs, Dayjs] | null)}
            style={{ width: 360 }}
          />
          <div className="org-dash-metric-row">
            {METRIC_KEYS.map((m) => (
              <button
                key={m}
                type="button"
                className={metric === m ? 'active' : ''}
                onClick={() => setMetric(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {GAME_METRICS.has(metric) ? (
          <div className="org-dash-game-dim">
            <button type="button" className={gameDim === 'type' ? 'active' : ''} onClick={() => setGameDim('type')}>
              游戏类型
            </button>
            <button
              type="button"
              className={gameDim === 'platform' ? 'active' : ''}
              onClick={() => setGameDim('platform')}
            >
              游戏平台
            </button>
          </div>
        ) : null}

        <SimpleLineChart series={overviewSeries} height={300} />

        <div className="org-dash-table-toolbar">
          <Select value={refresh} onChange={setRefresh} options={REFRESH_OPTIONS} style={{ width: 140 }} />
        </div>

        <Table
          size="middle"
          rowKey="key"
          className="org-dash-overview-table"
          pagination={false}
          columns={overviewColumns}
          dataSource={OVERVIEW_ROWS}
          scroll={{ x: 1400 }}
          bordered
        />

        <div className="org-dash-more">
          <Button type="link" icon={<BarChartOutlined />}>
            查看更多
          </Button>
        </div>
      </section>
    </div>
  )
}
