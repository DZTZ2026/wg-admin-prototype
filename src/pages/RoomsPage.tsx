import { useMemo, useState } from 'react'
import { Button, Input, Select, Space, Table, Tabs, Tag } from 'antd'
import dayjs from 'dayjs'
import FilterRangePicker from '../components/FilterRangePicker'
import { roomRows } from '../mock'

export default function RoomsPage() {
  const [statusTab, setStatusTab] = useState('all')
  const [ante, setAnte] = useState('')
  const [loading, setLoading] = useState(false)

  const data = useMemo(() => {
    return roomRows.filter((r) => {
      if (statusTab === 'running' && r.status !== '进行中') return false
      if (statusTab === 'pending' && r.status !== '待开始') return false
      if (statusTab === 'ended' && r.status !== '已结束') return false
      if (ante && String(r.ante) !== ante) return false
      return true
    })
  }, [statusTab, ante])

  return (
    <div className="page-panel">
      <Tabs
        className="sub-tabs"
        activeKey={statusTab}
        onChange={setStatusTab}
        items={[
          { key: 'manage', label: '游戏管理' },
          { key: 'pending', label: '待开始' },
          { key: 'running', label: '进行中' },
          { key: 'ended', label: '已结束' },
          { key: 'closed', label: '已关闭' },
          { key: 'all', label: '全部房间' },
        ]}
      />
      <div className="filter-bar">
        <Space.Compact>
          <Button size="small">日</Button>
          <Button size="small">周</Button>
          <Button size="small">月</Button>
        </Space.Compact>
        <FilterRangePicker
          defaultValue={[dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')]}
        />
        <Select
          placeholder="子游戏名称"
          style={{ width: 140 }}
          allowClear
          options={[
            { value: '德州扑克', label: '德州扑克' },
            { value: '百家乐', label: '百家乐' },
            { value: '龙虎', label: '龙虎' },
          ]}
        />
        <Input
          placeholder="请输入房间底注"
          style={{ width: 160 }}
          value={ante}
          onChange={(e) => setAnte(e.target.value)}
          allowClear
        />
        <Select
          placeholder="中途加入"
          style={{ width: 120 }}
          allowClear
          options={[
            { value: '允许', label: '允许' },
            { value: '禁止', label: '禁止' },
          ]}
        />
        <Select
          placeholder="请选择状态"
          style={{ width: 140 }}
          allowClear
          options={[
            { value: '待开始', label: '待开始' },
            { value: '进行中', label: '进行中' },
            { value: '已结束', label: '已结束' },
          ]}
        />
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 350)
            }}
          >
            搜索
          </Button>
          <Button onClick={() => setAnte('')}>重置</Button>
        </Space>
      </div>
      <Table
        size="middle"
        loading={loading}
        dataSource={data}
        scroll={{ x: 1400 }}
        pagination={false}
        columns={[
          { title: '币种', dataIndex: 'currency', width: 80 },
          { title: '子游戏ID', dataIndex: 'gameId', sorter: true },
          { title: '子游戏名称', dataIndex: 'gameName' },
          {
            title: 'icon缩略图',
            render: () => (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  background: '#e6f4ff',
                  border: '1px solid #91caff',
                }}
              />
            ),
          },
          { title: '房间底注', dataIndex: 'ante', sorter: (a, b) => a.ante - b.ante },
          { title: '中途加入', dataIndex: 'midJoin' },
          { title: '房间密码', dataIndex: 'password' },
          { title: '禁止选座', dataIndex: 'noSeat' },
          { title: '已抽水', dataIndex: 'rake', sorter: (a, b) => a.rake - b.rake },
          {
            title: '状态',
            dataIndex: 'status',
            render: (v) => (
              <Tag color={v === '进行中' ? 'processing' : v === '待开始' ? 'warning' : 'default'}>{v}</Tag>
            ),
          },
          { title: '创建时间', dataIndex: 'createdAt' },
          { title: '结束时间', dataIndex: 'endedAt' },
          { title: '操作人', dataIndex: 'operator' },
          { title: '操作时间', dataIndex: 'operatedAt' },
        ]}
      />
      <div className="table-footer">共 {data.length} 条</div>
    </div>
  )
}
