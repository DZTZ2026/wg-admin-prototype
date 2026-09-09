import { useMemo, useState } from 'react'
import { Button, Input, Space, Table, Tabs, Tag } from 'antd'
import {
  GiftOutlined,
  RiseOutlined,
  TeamOutlined,
  TransactionOutlined,
  TrophyOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import FilterRangePicker from '../components/FilterRangePicker'
import { rankingRows } from '../mock'

const cardMeta = [
  {
    title: '今日新增',
    value: '1',
    meta: '首充人数 0 · 代理 0 · 大R 0',
    color: 'linear-gradient(135deg,#f7b733,#fc4a1a)',
    icon: <UserAddOutlined className="icon" />,
  },
  {
    title: '会员总数',
    value: '255',
    delta: '0.39%',
    meta: '累计首充 7 · 代理 5 · 大R 3',
    color: 'linear-gradient(135deg,#36d1dc,#5b86e5)',
    icon: <TeamOutlined className="icon" />,
  },
  {
    title: '充提差额',
    value: '0',
    meta: '今日充值 0 · 今日提现 0',
    color: 'linear-gradient(135deg,#f093fb,#f5576c)',
    icon: <TransactionOutlined className="icon" />,
  },
  {
    title: '今日投注',
    value: '0',
    meta: '注单 0 · 胜率 0%',
    color: 'linear-gradient(135deg,#4e54c8,#8f94fb)',
    icon: <TrophyOutlined className="icon" />,
  },
  {
    title: '今日损益',
    value: '0',
    meta: '盈利 0 · 存量 7,236,044',
    color: 'linear-gradient(135deg,#11998e,#38ef7d)',
    icon: <RiseOutlined className="icon" />,
  },
  {
    title: '今日优惠',
    value: '0',
    meta: '参与 0 · 任务 0 · 活动 0',
    color: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    icon: <GiftOutlined className="icon" />,
  },
]

export default function DashboardPage() {
  const [rankTab, setRankTab] = useState('recharge')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)

  const data = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (!q) return rankingRows
    return rankingRows.filter(
      (r) =>
        r.account.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.memberId.includes(q),
    )
  }, [keyword])

  const search = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 400)
  }

  return (
    <div className="page-panel">
      <div className="section-title">今日即时焦点</div>
      <div className="metric-grid">
        {cardMeta.map((c) => (
          <div key={c.title} className="metric-card" style={{ background: c.color }}>
            <div className="title">{c.title}</div>
            <div className="value">
              {c.value}
              {c.delta ? <span className="delta-up">↑ {c.delta}</span> : null}
            </div>
            <div className="meta">{c.meta}</div>
            {c.icon}
          </div>
        ))}
      </div>

      <div className="section-title">今日排行榜</div>
      <Tabs
        activeKey={rankTab}
        onChange={setRankTab}
        items={[
          { key: 'recharge', label: '充值排行' },
          { key: 'bet', label: '投注排行' },
          { key: 'profit', label: '盈利排行' },
          { key: 'commission', label: '佣金排行' },
        ]}
      />
      <div className="filter-bar">
        <FilterRangePicker defaultValue={[dayjs().startOf('day'), dayjs().endOf('day')]} />
        <Input
          placeholder="会员账号 / ID / 名称"
          style={{ width: 220 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
        />
        <Space>
          <Button type="primary" onClick={search} loading={loading}>
            搜索
          </Button>
          <Button
            onClick={() => {
              setKeyword('')
              search()
            }}
          >
            重置
          </Button>
        </Space>
      </div>
      <Table
        size="middle"
        loading={loading}
        pagination={false}
        dataSource={data}
        columns={[
          { title: '排名', dataIndex: 'rank', width: 70 },
          { title: '名称', dataIndex: 'name' },
          { title: '会员ID', dataIndex: 'memberId' },
          { title: '会员账号', dataIndex: 'account' },
          { title: '上级代理', dataIndex: 'agent' },
          { title: '注册来源', dataIndex: 'source', render: (v) => <Tag>{v}</Tag> },
          {
            title: rankTab === 'bet' ? '投注总额' : rankTab === 'profit' ? '盈利总额' : rankTab === 'commission' ? '佣金总额' : '存款总额',
            dataIndex: 'deposit',
            render: (v: number) => v.toLocaleString(),
            sorter: (a, b) => a.deposit - b.deposit,
          },
        ]}
      />
      <div className="table-footer">共 {data.length} 条 · 原型演示数据</div>
    </div>
  )
}
