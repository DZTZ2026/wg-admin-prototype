import { useMemo, useState } from 'react'
import { Button, Input, Select, Space, Table, Tabs } from 'antd'
import CurrencyMultiSelect from '../components/CurrencyMultiSelect'
import { payRows } from '../mock'

export default function FinancePayPage() {
  const [view, setView] = useState('payout')
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState<string[]>([])

  const data = useMemo(() => {
    return payRows.filter((r) => {
      if (currency.length && !currency.includes(r.currency)) return false
      if (name && !r.name.includes(name) && !r.id.includes(name)) return false
      return true
    })
  }, [name, currency])

  return (
    <div className="page-panel">
      <Tabs
        className="sub-tabs"
        activeKey={view}
        onChange={setView}
        items={[
          { key: 'payin', label: '可用三方支付' },
          { key: 'payout', label: '可用三方代付' },
          { key: 'risk', label: '剔除高风险三方' },
        ]}
      />
      <div className="filter-bar">
        <CurrencyMultiSelect
          value={currency}
          onChange={(v) => setCurrency(v as string[])}
          style={{ width: 150 }}
          options={[
            { value: 'USDT', label: 'USDT' },
            { value: 'VND', label: 'VND' },
            { value: 'TON', label: 'TON' },
          ]}
        />
        <Select
          placeholder="三方代付名称"
          style={{ width: 160 }}
          allowClear
          options={payRows.map((r) => ({ value: r.name, label: r.name }))}
        />
        <Input
          placeholder="请输入三方代付名称"
          style={{ width: 220 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          allowClear
        />
        <Space>
          <Button type="primary">搜索</Button>
          <Button
            onClick={() => {
              setName('')
              setCurrency([])
            }}
          >
            重置
          </Button>
        </Space>
      </div>
      <Table
        size="middle"
        dataSource={view === 'risk' ? [] : data}
        scroll={{ x: 2000 }}
        pagination={false}
        locale={{ emptyText: '暂无数据' }}
        columns={[
          { title: '接入时间', dataIndex: 'accessAt', width: 170 },
          { title: '币种', dataIndex: 'currency', width: 80 },
          { title: '三方ID', dataIndex: 'id', width: 160 },
          { title: '三方代付名称', dataIndex: 'name', width: 140 },
          { title: '缴纳保证金', dataIndex: 'margin', width: 150 },
          { title: '联系方式', dataIndex: 'contact', width: 120 },
          { title: '三方费率', dataIndex: 'rate', width: 100 },
          { title: '昨日提现次数', dataIndex: 'yesterdayCount' },
          { title: '累计提现次数', dataIndex: 'totalCount' },
          { title: '昨日提现金额', dataIndex: 'yesterdayAmount' },
          { title: '累计提现金额', dataIndex: 'totalAmount' },
          { title: '提现总成功率', dataIndex: 'totalRate' },
          { title: '昨日提现成功率', dataIndex: 'yesterdayRate' },
          { title: '总平均出款时间', dataIndex: 'avgTime' },
          { title: '昨日平均出款时间', dataIndex: 'yesterdayAvg' },
        ]}
      />
      <div className="table-footer">共 {view === 'risk' ? 0 : data.length} 条</div>
    </div>
  )
}
