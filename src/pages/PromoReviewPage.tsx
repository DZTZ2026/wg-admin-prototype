import { useMemo, useState, type Key } from 'react'
import { Button, Checkbox, Input, Select, Space, Table, Tabs, Tag } from 'antd'
import dayjs from 'dayjs'
import FilterRangePicker from '../components/FilterRangePicker'
import { promoRows } from '../mock'

export default function PromoReviewPage() {
  const [tab, setTab] = useState('rejected')
  const [account, setAccount] = useState('')
  const [selected, setSelected] = useState<Key[]>([])

  const data = useMemo(() => {
    return promoRows.filter((r) => {
      if (tab === 'rejected' && r.status !== '被拒绝') return false
      if (account && !r.accountType.includes(account) && !r.name.includes(account)) return false
      return true
    })
  }, [tab, account])

  return (
    <div className="page-panel">
      <Tabs
        className="sub-tabs"
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: 'one', label: '派发一键审核' },
          { key: 'bulk', label: '派发逐条审核' },
          { key: 'apply', label: '会员申请审核' },
          { key: 'big', label: '大额申请' },
          { key: 'bigAudit', label: '大额审核' },
          { key: 'invalid', label: '不符合条件审核' },
          { key: 'wait', label: '待领取' },
          { key: 'done', label: '已领取' },
          { key: 'rejected', label: '被拒绝' },
          { key: 'expired', label: '已过期' },
          { key: 'all', label: '全部记录' },
        ]}
      />
      <div className="filter-bar">
        <Space.Compact>
          <Button size="small">日</Button>
          <Button size="small">月</Button>
        </Space.Compact>
        <FilterRangePicker defaultValue={[dayjs().startOf('day'), dayjs().endOf('day')]} />
        <Input placeholder="单号" style={{ width: 140 }} allowClear />
        <Select
          defaultValue="all"
          style={{ width: 140 }}
          options={[
            { value: 'all', label: '全部账号类型' },
            { value: 'formal', label: '正式' },
          ]}
        />
        <Input
          placeholder="请输入会员账号"
          style={{ width: 180 }}
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          allowClear
        />
        <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: '全部优惠来源' }]} />
        <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: '全部类型' }]} />
        <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: '全部状态' }]} />
        <Space>
          <Button type="primary">搜索</Button>
          <Button type="primary" ghost>
            高级搜索
          </Button>
          <Button onClick={() => setAccount('')}>重置</Button>
        </Space>
      </div>
      <Table
        size="middle"
        rowSelection={{ selectedRowKeys: selected, onChange: setSelected }}
        dataSource={tab === 'rejected' || tab === 'all' ? data : []}
        scroll={{ x: 1800 }}
        pagination={false}
        locale={{ emptyText: '暂无数据' }}
        columns={[
          { title: '会员币种', dataIndex: 'currency', width: 90 },
          { title: '优惠ID', dataIndex: 'promoId' },
          { title: '优惠名称', dataIndex: 'name' },
          { title: '优惠来源', dataIndex: 'source' },
          { title: '来源类型', dataIndex: 'sourceType' },
          { title: '优惠类型', dataIndex: 'type' },
          { title: '账号类型', dataIndex: 'accountType' },
          {
            title: '领取状态',
            dataIndex: 'status',
            render: (v) => <Tag color="error">{v}</Tag>,
          },
          { title: '可领取时间', dataIndex: 'earnAt' },
          { title: '过期时间', dataIndex: 'expireAt' },
          { title: '奖励说明', dataIndex: 'rewardDesc' },
          { title: '不符合原因', dataIndex: 'reason' },
          { title: '申报IP', dataIndex: 'ip' },
          { title: '奖励类型', dataIndex: 'rewardType' },
          { title: '奖励', dataIndex: 'reward' },
          { title: '活跃度', dataIndex: 'activity' },
        ]}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        <Checkbox>全选当前页</Checkbox>
        <Checkbox>全选所有结果</Checkbox>
        <Select placeholder="批量操作" style={{ width: 140 }} options={[{ value: 'export', label: '导出' }]} />
        <span className="table-footer" style={{ marginTop: 0 }}>
          已选择 {selected.length} 条数据 共 {tab === 'rejected' || tab === 'all' ? data.length : 0} 条
        </span>
      </div>
    </div>
  )
}
