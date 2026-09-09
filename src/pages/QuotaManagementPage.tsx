import { useMemo, useState } from 'react'
import { BarChartOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Select, Space, Table, Tabs, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type QuotaStatus = '正常额度' | '额度预警' | '限制导出' | '限制游戏' | '禁止游戏'

type QuotaTab = 'normal' | 'warn' | 'limit-export' | 'limit-game' | 'ban-game' | 'all'

interface QuotaRow {
  key: string
  siteId: string
  siteName: string
  groupName: string
  companyName: string
  available: string
  deposit: string
  balance: string
  creditLimit: string
  unsettled: string
  overdraftRatio: number
  yesterdayRecharge: string
  status: QuotaStatus
}

const QUOTA_TABS: { key: QuotaTab; label: string; status?: QuotaStatus }[] = [
  { key: 'normal', label: '正常额度', status: '正常额度' },
  { key: 'warn', label: '额度预警', status: '额度预警' },
  { key: 'limit-export', label: '限制导出', status: '限制导出' },
  { key: 'limit-game', label: '限制游戏', status: '限制游戏' },
  { key: 'ban-game', label: '禁止游戏', status: '禁止游戏' },
  { key: 'all', label: '全部额度' },
]

const STATUS_OPTIONS = QUOTA_TABS.filter((t) => t.status).map((t) => ({
  value: t.status!,
  label: t.status!,
}))

const KEYWORD_OPTIONS = [
  { value: 'siteId', label: '站点ID' },
  { value: 'siteName', label: '站点名称' },
  { value: 'company', label: '所属公司' },
]

const METRIC_OPTIONS = [
  { value: 'ratio', label: '透支比例(%)' },
  { value: 'credit', label: '授信额度' },
  { value: 'available', label: '可用额度' },
]

function parseMoney(v: string) {
  return Number(String(v).replace(/,/g, '')) || 0
}

function metricValue(row: QuotaRow, metric: string) {
  if (metric === 'credit') return parseMoney(row.creditLimit)
  if (metric === 'available') return parseMoney(row.available)
  return row.overdraftRatio
}

const ALL_ROWS: QuotaRow[] = [
  {
    key: '7252',
    siteId: '7252',
    siteName: 'am-2.bet',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '17,062.21',
    deposit: '0.00',
    balance: '185.98',
    creditLimit: '20,000.00',
    unsettled: '-3,123.77',
    overdraftRatio: 14.68,
    yesterdayRecharge: '0.00',
    status: '正常额度',
  },
  {
    key: '7213',
    siteId: '7213',
    siteName: 'cianopg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '16,985.40',
    deposit: '0.00',
    balance: '102.55',
    creditLimit: '20,000.00',
    unsettled: '-3,117.15',
    overdraftRatio: 15.07,
    yesterdayRecharge: '0.00',
    status: '正常额度',
  },
  {
    key: '5927',
    siteId: '5927',
    siteName: 'Sagitariopg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '17,100.51',
    deposit: '0.00',
    balance: '108.83',
    creditLimit: '20,000.00',
    unsettled: '-3,008.32',
    overdraftRatio: 14.49,
    yesterdayRecharge: '195.51',
    status: '正常额度',
  },
  {
    key: '5978',
    siteId: '5978',
    siteName: 'selvapg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '16,920.18',
    deposit: '0.00',
    balance: '76.40',
    creditLimit: '20,000.00',
    unsettled: '-3,156.22',
    overdraftRatio: 15.39,
    yesterdayRecharge: '42.00',
    status: '正常额度',
  },
  {
    key: '6011',
    siteId: '6011',
    siteName: 'librapg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '17,220.00',
    deposit: '0.00',
    balance: '320.00',
    creditLimit: '20,000.00',
    unsettled: '-3,100.00',
    overdraftRatio: 13.9,
    yesterdayRecharge: '88.20',
    status: '正常额度',
  },
  {
    key: '6102',
    siteId: '6102',
    siteName: 'tauruspg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '16,800.00',
    deposit: '0.00',
    balance: '50.00',
    creditLimit: '20,000.00',
    unsettled: '-3,250.00',
    overdraftRatio: 16.0,
    yesterdayRecharge: '12.00',
    status: '正常额度',
  },
  {
    key: '6188',
    siteId: '6188',
    siteName: 'virgopg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '17,050.66',
    deposit: '0.00',
    balance: '210.66',
    creditLimit: '20,000.00',
    unsettled: '-3,160.00',
    overdraftRatio: 14.74,
    yesterdayRecharge: '0.00',
    status: '正常额度',
  },
  {
    key: '6301',
    siteId: '6301',
    siteName: 'piscespg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '16,990.10',
    deposit: '0.00',
    balance: '140.10',
    creditLimit: '20,000.00',
    unsettled: '-3,150.00',
    overdraftRatio: 15.04,
    yesterdayRecharge: '65.00',
    status: '正常额度',
  },
  {
    key: '6405',
    siteId: '6405',
    siteName: 'capricornpg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '9,800.00',
    deposit: '0.00',
    balance: '200.00',
    creditLimit: '20,000.00',
    unsettled: '-10,400.00',
    overdraftRatio: 51.0,
    yesterdayRecharge: '0.00',
    status: '额度预警',
  },
  {
    key: '6508',
    siteId: '6508',
    siteName: 'aquariuspg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '-2,100.00',
    deposit: '0.00',
    balance: '100.00',
    creditLimit: '20,000.00',
    unsettled: '-22,200.00',
    overdraftRatio: 110.5,
    yesterdayRecharge: '0.00',
    status: '限制导出',
  },
  {
    key: '6612',
    siteId: '6612',
    siteName: 'scorpiopg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '-12,500.00',
    deposit: '0.00',
    balance: '50.00',
    creditLimit: '20,000.00',
    unsettled: '-32,550.00',
    overdraftRatio: 162.5,
    yesterdayRecharge: '0.00',
    status: '限制游戏',
  },
  {
    key: '6720',
    siteId: '6720',
    siteName: 'cancerpg',
    groupName: '伯乐(1179)',
    companyName: '无',
    available: '-22,000.00',
    deposit: '0.00',
    balance: '0.00',
    creditLimit: '20,000.00',
    unsettled: '-42,000.00',
    overdraftRatio: 210.0,
    yesterdayRecharge: '0.00',
    status: '禁止游戏',
  },
]

const STATUS_COLOR: Record<QuotaStatus, string> = {
  正常额度: '#52c41a',
  额度预警: '#fa8c16',
  限制导出: '#ff4d4f',
  限制游戏: '#cf1322',
  禁止游戏: '#a8071a',
}

function StatusCell({ status }: { status: QuotaStatus }) {
  return (
    <span className="quota-status-cell" style={{ color: STATUS_COLOR[status] }}>
      <BarChartOutlined />
      {status}
    </span>
  )
}

export default function QuotaManagementPage() {
  const [subTab, setSubTab] = useState<QuotaTab>('normal')
  const [keywordField, setKeywordField] = useState('siteId')
  const [siteId, setSiteId] = useState('')
  const [metricField, setMetricField] = useState('ratio')
  const [ratioMin, setRatioMin] = useState<number | null>(null)
  const [ratioMax, setRatioMax] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<QuotaStatus | undefined>()
  const [applied, setApplied] = useState({
    keywordField: 'siteId',
    siteId: '',
    metricField: 'ratio',
    ratioMin: null as number | null,
    ratioMax: null as number | null,
    status: undefined as QuotaStatus | undefined,
  })

  const isAll = subTab === 'all'
  const tabStatus = QUOTA_TABS.find((t) => t.key === subTab)?.status

  const rows = useMemo(() => {
    return ALL_ROWS.filter((r) => {
      if (tabStatus && r.status !== tabStatus) return false
      if (isAll && applied.status && r.status !== applied.status) return false
      if (applied.siteId) {
        const q = applied.siteId.trim()
        if (applied.keywordField === 'siteName' && !r.siteName.includes(q)) return false
        if (applied.keywordField === 'company' && !r.companyName.includes(q)) return false
        if (applied.keywordField === 'siteId' && !r.siteId.includes(q)) return false
      }
      const metric = metricValue(r, applied.metricField)
      if (applied.ratioMin != null && metric < applied.ratioMin) return false
      if (applied.ratioMax != null && metric > applied.ratioMax) return false
      return true
    })
  }, [applied, isAll, tabStatus])

  const search = () => {
    setApplied({
      keywordField,
      siteId,
      metricField,
      ratioMin,
      ratioMax,
      status: isAll ? statusFilter : undefined,
    })
  }

  const reset = () => {
    setKeywordField('siteId')
    setSiteId('')
    setMetricField('ratio')
    setRatioMin(null)
    setRatioMax(null)
    setStatusFilter(undefined)
    setApplied({
      keywordField: 'siteId',
      siteId: '',
      metricField: 'ratio',
      ratioMin: null,
      ratioMax: null,
      status: undefined,
    })
  }

  const columns: ColumnsType<QuotaRow> = [
    { title: '站点ID', dataIndex: 'siteId', width: 90, align: 'center' },
    { title: '站点名称', dataIndex: 'siteName', width: 120, align: 'center' },
    { title: '所属集团(ID)', dataIndex: 'groupName', width: 120, align: 'center' },
    { title: '所属公司(ID)', dataIndex: 'companyName', width: 110, align: 'center' },
    {
      title: '可用额度(U)',
      dataIndex: 'available',
      width: 120,
      align: 'center',
      render: (v: string) => <span className="quota-num-danger">{v}</span>,
    },
    { title: '站点押金(U)', dataIndex: 'deposit', width: 110, align: 'center' },
    {
      title: '站点余额(U)',
      dataIndex: 'balance',
      width: 110,
      align: 'center',
      render: (v: string) => <span className="quota-num-danger">{v}</span>,
    },
    { title: '授信额度(U)', dataIndex: 'creditLimit', width: 110, align: 'center' },
    {
      title: '未结账单(U)',
      dataIndex: 'unsettled',
      width: 120,
      align: 'center',
      render: (v: string) => <span className="quota-num-ok">{v}</span>,
    },
    {
      title: '透支比例(%)',
      dataIndex: 'overdraftRatio',
      width: 110,
      align: 'center',
      render: (v: number) => `${v.toFixed(2)}%`,
    },
    { title: '昨日在线充值(U)', dataIndex: 'yesterdayRecharge', width: 140, align: 'center' },
    {
      title: '额度状态',
      dataIndex: 'status',
      width: 120,
      align: 'center',
      render: (v: QuotaStatus) => <StatusCell status={v} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      align: 'center',
      render: () => (
        <div className="action-links">
          <Button type="link" size="small" className="action-link" disabled>
            账变
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => message.info('费率（原型）')}>
            费率
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => message.info('详情（原型）')}>
            详情
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="org-page-panel quota-mgmt-page">
      <Tabs
        className="site-open-tabs"
        activeKey={subTab}
        onChange={(k) => {
          setSubTab(k as QuotaTab)
          setStatusFilter(undefined)
          setApplied((prev) => ({ ...prev, status: undefined }))
        }}
        items={QUOTA_TABS.map((t) => ({ key: t.key, label: t.label }))}
      />

      <div className="site-open-filter">
        <div className="site-open-filter-row site-open-filter-row-between">
          <div className="site-open-filter-row">
            <Space.Compact>
              <Select
                value={keywordField}
                onChange={setKeywordField}
                style={{ width: 100 }}
                options={KEYWORD_OPTIONS}
              />
              <Input
                placeholder={
                  keywordField === 'siteName'
                    ? '请输入站点名称'
                    : keywordField === 'company'
                      ? '请输入所属公司'
                      : '请输入站点ID'
                }
                allowClear
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                style={{ width: 160 }}
              />
            </Space.Compact>
            <Space.Compact>
              <Select
                value={metricField}
                onChange={setMetricField}
                style={{ width: 120 }}
                options={METRIC_OPTIONS}
                popupMatchSelectWidth={false}
              />
              <InputNumber
                placeholder="区间下限"
                value={ratioMin}
                onChange={(v) => setRatioMin(typeof v === 'number' ? v : null)}
                style={{ width: 110 }}
              />
              <InputNumber
                placeholder="区间上限"
                value={ratioMax}
                onChange={(v) => setRatioMax(typeof v === 'number' ? v : null)}
                style={{ width: 110 }}
              />
            </Space.Compact>
            {isAll ? (
              <Select
                allowClear
                placeholder="额度状态"
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
                style={{ width: 140 }}
              />
            ) : null}
            <Button type="primary" onClick={search}>
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

      <Table
        size="middle"
        rowKey="key"
        className="site-bill-table quota-table"
        columns={columns}
        dataSource={rows}
        scroll={{ x: 1600 }}
        pagination={false}
        locale={{ emptyText: '暂无数据' }}
      />

      <div className="org-table-footer">
        <span>共 {rows.length} 条</span>
      </div>

      <div className="quota-help">
        <div className="quota-help-block">
          <div className="quota-help-title">1、站点额度和概念说明</div>
          <p>
            <strong>(1) 站点余额：</strong>
            是指站点当前的USDT余额，金额 ≥ 0。充多少到账多少，购买马甲包、开通极光等会直接从该余额扣除。请及时充值，以免影响站点使用或被冻结。
          </p>
          <p>
            <strong>(2) 授信额度：</strong>
            是WG授予站点的授信额度，默认按实际透支额度的1倍，显示为正数，用于垫付当月账单。授信额度一般等于上月账单金额，最低值为10,000
            USDT。例如：上月账单20,000 USDT，则默认授信额度为20,000 USDT，即本月最多可透支20,000 USDT。
          </p>
          <p>
            <strong>(3) 未结账单：</strong>
            是指当月三方游戏消耗且尚未到达月底结算周期（即尚未生成月账单）的费用，加上往月已生成但尚未付清的账单。
          </p>
          <p>
            <strong>(4) 可用额度：</strong>
            由站点余额、授信额度、未结账单组成，可为负数，非常重要，直接影响站点状态。
            <br />
            可用额度 = 站点余额 + 授信额度 − 未结账单。
          </p>
          <p>
            <strong>(5) 透支比例：</strong>
            未结账单减去站点余额后占授信额度的百分比。
            <br />
            透支比例 = (未结账单 − 站点余额) / 授信额度 × 100%。
          </p>
        </div>

        <div className="quota-help-block">
          <div className="quota-help-title">2、站点状态说明</div>
          <p>
            <strong>(1) 正常额度：</strong>
            透支比例 ≤ 50%。状态正常，无功能限制。进度条为绿色。仅超级管理员和持有人每次登录会收到充值弹窗提醒。
          </p>
          <p>
            <strong>(2) 额度预警：</strong>
            50% &lt; 透支比例 ≤ 100%。预警状态，无功能限制。进度条为橙色。所有后台账号每次登录都会收到充值弹窗提醒。
          </p>
          <p>
            <strong>(3) 限制导出：</strong>
            100% &lt; 透支比例 ≤ 150%。限制导出，后台无法导出会员数据。进度条为红色。所有后台账号每10分钟收到充值弹窗提醒。
          </p>
          <p>
            <strong>(4) 限制游戏：</strong>
            150% &lt; 透支比例 ≤ 200%。限制游戏，新会员无法进入三方游戏，后台无法导出会员数据。进度条为深红色。所有后台账号每5分钟收到充值弹窗提醒。
          </p>
          <p>
            <strong>(5) 禁止游戏：</strong>
            透支比例 &gt; 200%。禁止游戏，全部会员无法进入游戏，在局玩家将被强制踢回大厅，无法导出会员数据。进度条为深红色。
          </p>
        </div>

        <div className="quota-help-block">
          <div className="quota-help-title">3、额度调整</div>
          <p>根据您站点日充值金额，请主动联系商务人员上调。</p>
        </div>
      </div>
    </div>
  )
}
