import { useMemo, useState } from 'react'
import { Button, Input, Select, Space, Table, Tabs, Tag } from 'antd'
import dayjs from 'dayjs'
import FilterRangePicker from '../components/FilterRangePicker'
import { agentRows } from '../mock'
import { NetProfitModal } from '../components/SpecialModals'

const retentionRows = [
  {
    key: '1',
    currency: 'VND1000:1',
    agentId: '461854795',
    account: 'agentlyn1',
    level: 'LV1',
    upline: '-',
    top: 'agentlyn1 (461854795)',
    source: '后台添加',
    d2: '0% (0)',
    d3: '0% (0)',
    d4: '0% (0)',
    d7: '0% (0)',
    d14: '0% (0)',
    d30: '0% (0)',
    d60: '(-)',
  },
  {
    key: '2',
    currency: 'VND1000:1',
    agentId: '461854801',
    account: 'agentnor01',
    level: 'LV1',
    upline: '-',
    top: 'agentnor01 (461854801)',
    source: '官网',
    d2: '0% (0)',
    d3: '0% (0)',
    d4: '0% (0)',
    d7: '0% (0)',
    d14: '0% (0)',
    d30: '0% (0)',
    d60: '(-)',
  },
]

export default function AgentsPage({ onOpenNetProfit }: { onOpenNetProfit?: () => void }) {
  const [tab, setTab] = useState('retention')
  const [loading, setLoading] = useState(false)
  const [kw, setKw] = useState('')
  const [netOpen, setNetOpen] = useState(false)

  const data = useMemo(() => {
    if (tab === 'mode') return agentRows
    return retentionRows.filter((r) => !kw || r.account.includes(kw) || r.agentId.includes(kw))
  }, [tab, kw])

  return (
    <div className="page-panel">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
        <Button
          type="primary"
          onClick={() => {
            if (onOpenNetProfit) onOpenNetProfit()
            else setNetOpen(true)
          }}
        >
          净盈利设置
        </Button>
        <Button>导出</Button>
      </div>
      <Tabs
        className="sub-tabs"
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: 'mode', label: '代理模式报表' },
          { key: 'top', label: '顶级代理报表' },
          { key: 'bet', label: '下级投注数据' },
          { key: 'pl', label: '下级盈亏数据' },
          { key: 'retention', label: '下级充值留存' },
        ]}
      />
      <div className="filter-bar">
        <Space.Compact>
          <Button size="small">日</Button>
          <Button size="small">周</Button>
          <Button size="small">月</Button>
        </Space.Compact>
        <FilterRangePicker defaultValue={[dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')]} />
        <Select
          defaultValue="exact"
          style={{ width: 120 }}
          options={[{ value: 'exact', label: '精准代理' }]}
        />
        <Input
          placeholder="支持批量搜索, 可用英文"
          style={{ width: 220 }}
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          allowClear
        />
        <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: '全部结算周期' }]} />
        <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: '全部代理等级' }]} />
        <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: '全部代理方式' }]} />
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 300)
            }}
          >
            搜索
          </Button>
          <Button onClick={() => setKw('')}>重置</Button>
        </Space>
      </div>

      {tab === 'retention' ? (
        <Table
          size="middle"
          loading={loading}
          dataSource={data as typeof retentionRows}
          scroll={{ x: 1600 }}
          pagination={false}
          columns={[
            { title: '币种', dataIndex: 'currency', width: 110 },
            { title: '代理ID', dataIndex: 'agentId', width: 120 },
            {
              title: '代理账号',
              dataIndex: 'account',
              render: (v: string, r: (typeof retentionRows)[0]) => (
                <span>
                  <a>{v}</a> <Tag>{r.level}</Tag>
                </span>
              ),
            },
            { title: '上级代理(ID)', dataIndex: 'upline' },
            { title: '顶级代理(ID)', dataIndex: 'top', width: 200 },
            { title: '注册来源', dataIndex: 'source' },
            { title: '2日留存(人次)', dataIndex: 'd2' },
            { title: '3日留存(人次)', dataIndex: 'd3' },
            { title: '4日留存(人次)', dataIndex: 'd4' },
            { title: '7日留存(人次)', dataIndex: 'd7' },
            { title: '14日留存(人次)', dataIndex: 'd14' },
            { title: '30日留存(人次)', dataIndex: 'd30' },
            { title: '60日留存(人次)', dataIndex: 'd60' },
          ]}
        />
      ) : tab === 'mode' ? (
        <Table
          size="middle"
          loading={loading}
          dataSource={agentRows}
          scroll={{ x: 1600 }}
          pagination={false}
          columns={[
            { title: '日期', dataIndex: 'date', fixed: 'left', width: 110 },
            { title: '币种', dataIndex: 'currency', width: 80 },
            { title: '代理模式ID', dataIndex: 'modeId' },
            { title: '代理模式(结算周期)', dataIndex: 'mode', width: 160 },
            { title: '备注', dataIndex: 'remark' },
            {
              title: '总输赢',
              dataIndex: 'winLose',
              render: (v: number) => (
                <span style={{ color: v < 0 ? '#ff4d4f' : '#52c41a' }}>{v.toLocaleString()}</span>
              ),
            },
            { title: '奖励领取(人数)', dataIndex: 'rewardUsers' },
            { title: '充值金额', dataIndex: 'recharge', render: (v: number) => v.toLocaleString() },
            { title: '首充金额', dataIndex: 'firstRecharge', render: (v: number) => v.toLocaleString() },
            { title: '首充转化率(注册当天)', dataIndex: 'convertRate' },
          ]}
        />
      ) : (
        <Table size="middle" locale={{ emptyText: '暂无数据' }} dataSource={[]} columns={[{ title: '示意', dataIndex: 'x' }]} pagination={false} />
      )}
      <div className="table-footer">共 {tab === 'mode' ? agentRows.length : tab === 'retention' ? (data as unknown[]).length : 0} 条</div>
      <NetProfitModal open={netOpen} onClose={() => setNetOpen(false)} />
    </div>
  )
}
