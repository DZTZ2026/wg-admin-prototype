import { useMemo, useState } from 'react'
import { CaretUpOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Input, Select, Space, Table, Tabs, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import FilterRangePicker from '../components/FilterRangePicker'
import CompanyModals, { type CompanyModalType, type CompanyRow } from '../components/CompanyModals'

type SubTab = 'list' | 'frozen' | 'all'
type Period = 'day' | 'week' | 'month'
type RangeValue = [Dayjs, Dayjs] | null

const KEYWORD_OPTIONS = [
  { value: 'id', label: '公司ID' },
  { value: 'name', label: '公司名称' },
]

const STATUS_OPTIONS = [
  { value: '正常', label: '正常' },
  { value: '冻结', label: '冻结' },
]

const INITIAL_ROWS: CompanyRow[] = [
  {
    key: '599',
    id: 599,
    name: '1',
    groupName: '伯乐',
    groupId: 1179,
    groupRemark: '1',
    companyRemark: '',
    balance: '0.00',
    sites: 0,
    apis: 0,
    status: '冻结',
    frozenAt: '2026-08-10 14:22:18',
    rateAdjust: '3.0',
    rateRemark: '1',
  },
]

function periodRange(period: Period): RangeValue {
  if (period === 'day') return [dayjs().startOf('day'), dayjs().endOf('day')]
  if (period === 'week') return [dayjs().startOf('week'), dayjs().endOf('day')]
  return [dayjs().startOf('month'), dayjs().endOf('day')]
}

export default function CompanyManagementPage() {
  const [subTab, setSubTab] = useState<SubTab>('list')
  const [filterOpen, setFilterOpen] = useState(true)
  const [keywordField, setKeywordField] = useState('id')
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string>()
  const [period, setPeriod] = useState<Period>('month')
  const [range, setRange] = useState<RangeValue>(periodRange('month'))
  const [applied, setApplied] = useState({ keywordField: 'id', keyword: '', status: undefined as string | undefined })
  const [rows, setRows] = useState(INITIAL_ROWS)
  const [modal, setModal] = useState<CompanyModalType>(null)
  const [current, setCurrent] = useState<CompanyRow | null>(null)

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (subTab === 'list' && r.status !== '正常') return false
      if (subTab === 'frozen' && r.status !== '冻结') return false
      if (applied.keyword) {
        const q = applied.keyword.trim()
        if (applied.keywordField === 'name' && !r.name.includes(q)) return false
        if (applied.keywordField === 'id' && !String(r.id).includes(q)) return false
      }
      if (subTab === 'all' && applied.status && r.status !== applied.status) return false
      return true
    })
  }, [applied, rows, subTab])

  const search = () => setApplied({ keywordField, keyword, status: subTab === 'all' ? status : undefined })

  const reset = () => {
    setKeywordField('id')
    setKeyword('')
    setStatus(undefined)
    setPeriod('month')
    setRange(periodRange('month'))
    setApplied({ keywordField: 'id', keyword: '', status: undefined })
  }

  const openModal = (type: CompanyModalType, row?: CompanyRow) => {
    setCurrent(row || null)
    setModal(type)
  }

  const columns: ColumnsType<CompanyRow> = [
    { title: '公司ID', dataIndex: 'id', align: 'center', width: 90 },
    { title: '公司名称', dataIndex: 'name', align: 'center', width: 110 },
    {
      title: '所属集团(ID)',
      dataIndex: 'groupName',
      align: 'center',
      width: 140,
      render: (_, r) => `${r.groupName}(${r.groupId})`,
    },
    { title: '公司余额(U)', dataIndex: 'balance', align: 'center', width: 120 },
    { title: '站点数量', dataIndex: 'sites', align: 'center', width: 90 },
    { title: 'API线路数量', dataIndex: 'apis', align: 'center', width: 120 },
    {
      title: '公司状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (v: CompanyRow['status']) => (
        <span className={v === '冻结' ? 'company-status-frozen' : 'status-ok'}>{v}</span>
      ),
    },
    ...(subTab === 'frozen'
      ? [{ title: '冻结时间', dataIndex: 'frozenAt', align: 'center' as const, width: 170 }]
      : []),
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 220,
      render: (_, row) => (
        <div className="action-links">
          <Button type="link" size="small" className="action-link" onClick={() => openModal('edit', row)}>
            修改
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => openModal('rate', row)}>
            费率调整
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => openModal('detail', row)}>
            详情
          </Button>
          {row.status === '冻结' ? (
            <Button type="link" size="small" className="action-link" onClick={() => openModal('unfreeze', row)}>
              解冻
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              className="action-link"
              onClick={() => {
                setRows((prev) =>
                  prev.map((r) =>
                    r.key === row.key
                      ? { ...r, status: '冻结', frozenAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
                      : r,
                  ),
                )
                message.success('已冻结（原型）')
              }}
            >
              冻结
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="org-page-panel company-mgmt-page">
      <Tabs
        className="site-open-tabs"
        activeKey={subTab}
        onChange={(k) => {
          setSubTab(k as SubTab)
          setStatus(undefined)
          setApplied((prev) => ({ ...prev, status: undefined }))
        }}
        items={[
          { key: 'list', label: '公司列表' },
          { key: 'frozen', label: '冻结列表' },
          { key: 'all', label: '全部公司' },
        ]}
      />

      {filterOpen ? (
        <div className="site-open-filter">
          <div className="site-open-filter-row site-open-filter-row-between">
            <div className="site-open-filter-row">
              {subTab === 'frozen' ? (
                <>
                  <Space.Compact>
                    <Button size="small" type={period === 'day' ? 'primary' : 'default'} onClick={() => { setPeriod('day'); setRange(periodRange('day')) }}>
                      日
                    </Button>
                    <Button size="small" type={period === 'week' ? 'primary' : 'default'} onClick={() => { setPeriod('week'); setRange(periodRange('week')) }}>
                      周
                    </Button>
                    <Button size="small" type={period === 'month' ? 'primary' : 'default'} onClick={() => { setPeriod('month'); setRange(periodRange('month')) }}>
                      月
                    </Button>
                  </Space.Compact>
                  <FilterRangePicker value={range} onChange={(v) => setRange(v as RangeValue)} style={{ width: 340 }} />
                </>
              ) : null}
              <Space.Compact>
                <Select value={keywordField} onChange={setKeywordField} options={KEYWORD_OPTIONS} style={{ width: 100 }} />
                <Input
                  placeholder={keywordField === 'name' ? '请输入公司名称' : '请输入公司ID'}
                  allowClear
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ width: 180 }}
                />
              </Space.Compact>
              {subTab === 'all' ? (
                <Select
                  allowClear
                  placeholder="公司状态"
                  value={status}
                  onChange={setStatus}
                  options={STATUS_OPTIONS}
                  style={{ width: 140 }}
                />
              ) : null}
              <Button type="primary" onClick={search}>
                搜索
              </Button>
              <Button onClick={reset}>重置</Button>
            </div>
            {subTab !== 'frozen' ? (
              <div className="site-open-filter-actions">
                <Button type="primary" onClick={() => openModal('add')}>
                  新增
                </Button>
                {subTab === 'all' ? (
                  <Button icon={<UploadOutlined />} onClick={() => message.info('导出报表（原型）')}>
                    导出报表
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="site-open-filter-toggle" onClick={() => setFilterOpen((v) => !v)}>
        <CaretUpOutlined rotate={filterOpen ? 0 : 180} />
      </div>

      <Table
        size="middle"
        rowKey="key"
        className="site-bill-table"
        columns={columns}
        dataSource={filtered}
        pagination={false}
        locale={{ emptyText: '暂无数据' }}
      />

      <div className="org-table-footer">共 {filtered.length} 条</div>

      <CompanyModals
        type={modal}
        company={current}
        onClose={() => setModal(null)}
        onAdd={(values) => {
          const id = Math.max(...rows.map((r) => r.id), 599) + 1
          setRows((prev) => [
            {
              key: String(id),
              id,
              name: values.name,
              groupName: '伯乐',
              groupId: 1179,
              groupRemark: values.groupRemark,
              companyRemark: '',
              balance: '0.00',
              sites: 0,
              apis: 0,
              status: '正常',
              rateAdjust: '0.0',
              rateRemark: '',
            },
            ...prev,
          ])
          setModal(null)
          message.success('已新增公司（原型）')
        }}
        onEdit={(values) => {
          if (!current) return
          setRows((prev) =>
            prev.map((r) => (r.key === current.key ? { ...r, name: values.name, groupRemark: values.groupRemark } : r)),
          )
          setModal(null)
          message.success('已保存修改（原型）')
        }}
        onRate={(adjust, remark) => {
          if (!current) return
          setRows((prev) => prev.map((r) => (r.key === current.key ? { ...r, rateAdjust: adjust, rateRemark: remark } : r)))
          setModal(null)
          message.success('费率已调整（原型）')
        }}
        onUnfreeze={() => {
          if (!current) return
          setRows((prev) =>
            prev.map((r) => (r.key === current.key ? { ...r, status: '正常', frozenAt: undefined } : r)),
          )
          setModal(null)
          message.success('公司已解冻（原型）')
        }}
      />
    </div>
  )
}
