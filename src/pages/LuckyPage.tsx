import { useMemo, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs, message } from 'antd'
import CurrencyMultiSelect from '../components/CurrencyMultiSelect'
import { luckyRows as seed } from '../mock'

export default function LuckyPage() {
  const [sub, setSub] = useState('remain')
  const [account, setAccount] = useState('')
  const [minV, setMinV] = useState<number | null>(null)
  const [maxV, setMaxV] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [rows] = useState(seed)
  const [form] = Form.useForm()

  const data = useMemo(() => {
    return rows.filter((r) => {
      if (account && !r.account.includes(account)) return false
      if (minV != null && r.remain < minV) return false
      if (maxV != null && r.remain > maxV) return false
      return true
    })
  }, [rows, account, minV, maxV])

  return (
    <div className="page-panel">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
        <Button type="primary" onClick={() => setOpen(true)}>
          新增幸运转盘
        </Button>
        <Button>导出</Button>
      </div>
      <Tabs
        className="sub-tabs"
        activeKey={sub}
        onChange={setSub}
        items={[
          { key: 'list', label: '转盘列表' },
          { key: 'record', label: '幸运值记录' },
          { key: 'remain', label: '剩余幸运值' },
          { key: 'win', label: '中奖记录' },
          { key: 'order', label: '实物订单' },
        ]}
      />
      <div className="filter-bar">
        <CurrencyMultiSelect
          placeholder="会员币种"
          style={{ width: 140 }}
          options={[
            { value: 'USDT', label: 'USDT' },
            { value: 'VND', label: 'VND' },
          ]}
        />
        <Input
          placeholder="请输入会员账号"
          style={{ width: 200 }}
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          allowClear
        />
        <InputNumber placeholder="最小值" value={minV ?? undefined} onChange={(v) => setMinV(v)} />
        <InputNumber placeholder="最大值" value={maxV ?? undefined} onChange={(v) => setMaxV(v)} />
        <Space>
          <Button type="primary">搜索</Button>
          <Button
            onClick={() => {
              setAccount('')
              setMinV(null)
              setMaxV(null)
            }}
          >
            重置
          </Button>
        </Space>
      </div>
      {sub === 'remain' ? (
        <Table
          size="middle"
          dataSource={data}
          pagination={false}
          columns={[
            { title: '会员币种', dataIndex: 'currency' },
            { title: '会员ID', dataIndex: 'memberId' },
            { title: '会员账号', dataIndex: 'account' },
            { title: '消耗幸运值', dataIndex: 'consumed', sorter: (a, b) => a.consumed - b.consumed },
            { title: '过期幸运值', dataIndex: 'expired' },
            { title: '剩余幸运值', dataIndex: 'remain', sorter: (a, b) => a.remain - b.remain },
            { title: '更新时间', dataIndex: 'updatedAt' },
          ]}
        />
      ) : (
        <Table
          size="middle"
          locale={{ emptyText: '暂无数据' }}
          dataSource={[]}
          pagination={false}
          columns={[{ title: '示意', dataIndex: 'x' }]}
        />
      )}
      <div className="table-footer">共 {sub === 'remain' ? data.length : 0} 条</div>

      <Modal
        title="新增幸运转盘"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          await form.validateFields()
          message.success('已创建转盘配置（原型）')
          setOpen(false)
          form.resetFields()
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="转盘名称" rules={[{ required: true }]}>
            <Input placeholder="例如 周末幸运轮" />
          </Form.Item>
          <Form.Item name="currency" label="币种" rules={[{ required: true }]} initialValue="USDT">
            <Select options={[{ value: 'USDT' }, { value: 'VND' }, { value: 'TON' }]} />
          </Form.Item>
          <Form.Item name="cost" label="单次消耗幸运值" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
