import { useMemo, useState } from 'react'
import { Button, Input, InputNumber, Space, Table, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { tierRows as seed } from '../mock'

type Tier = (typeof seed)[number]

export default function TiersPage() {
  const [mode, setMode] = useState<'auto' | 'fixed'>('auto')
  const [keyword, setKeyword] = useState('')
  const [rows, setRows] = useState<Tier[]>(seed)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', desc: '', rechargeCount: 0, rechargeAmount: 0 })

  const data = useMemo(
    () => rows.filter((r) => !keyword || r.name.includes(keyword) || r.desc.includes(keyword)),
    [rows, keyword],
  )

  return (
    <div className="page-panel">
      <div className="filter-bar">
        <Input
          placeholder="层级名称"
          style={{ width: 220 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
        />
        <Button type="primary">搜索</Button>
        <Button onClick={() => setKeyword('')}>重置</Button>
        <Space style={{ marginLeft: 12 }}>
          <Button type={mode === 'auto' ? 'primary' : 'default'} shape="round" onClick={() => setMode('auto')}>
            自动层级
          </Button>
          <Button type={mode === 'fixed' ? 'primary' : 'default'} shape="round" onClick={() => setMode('fixed')}>
            固定层级
          </Button>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginLeft: 'auto' }}
          onClick={() => setAdding(true)}
        >
          新增
        </Button>
      </div>
      <Table
        size="middle"
        dataSource={
          adding
            ? [
                ...data,
                {
                  key: 'draft',
                  id: 0,
                  type: mode === 'auto' ? '自动层级' : '固定层级',
                  name: draft.name,
                  desc: draft.desc,
                  tags: [],
                  rechargeCount: draft.rechargeCount,
                  rechargeAmount: draft.rechargeAmount,
                  members: 0,
                },
              ]
            : data
        }
        pagination={false}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 70, render: (v, r) => (r.key === 'draft' ? '-' : v) },
          { title: '层级类型', dataIndex: 'type' },
          {
            title: '层级名称',
            dataIndex: 'name',
            render: (v, r) =>
              r.key === 'draft' ? (
                <Input
                  value={draft.name}
                  placeholder="层级名称"
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                />
              ) : (
                v
              ),
          },
          {
            title: '描述',
            dataIndex: 'desc',
            render: (v, r) =>
              r.key === 'draft' ? (
                <Input
                  value={draft.desc}
                  placeholder="描述"
                  onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
                />
              ) : (
                v
              ),
          },
          {
            title: '关联标签',
            dataIndex: 'tags',
            render: (tags: string[]) =>
              tags.length ? tags.map((t) => <Tag key={t}>{t}</Tag>) : <span style={{ color: '#bfbfbf' }}>-</span>,
          },
          {
            title: '充值次数',
            dataIndex: 'rechargeCount',
            render: (v, r) =>
              r.key === 'draft' ? (
                <InputNumber
                  min={0}
                  value={draft.rechargeCount}
                  onChange={(n) => setDraft((d) => ({ ...d, rechargeCount: Number(n || 0) }))}
                />
              ) : (
                v
              ),
          },
          {
            title: '累计充值金额',
            dataIndex: 'rechargeAmount',
            render: (v, r) =>
              r.key === 'draft' ? (
                <InputNumber
                  min={0}
                  value={draft.rechargeAmount}
                  onChange={(n) => setDraft((d) => ({ ...d, rechargeAmount: Number(n || 0) }))}
                />
              ) : (
                Number(v).toFixed(2)
              ),
          },
          { title: '层级人数', dataIndex: 'members' },
          {
            title: '操作',
            render: (_, r) =>
              r.key === 'draft' ? (
                <Space>
                  <a
                    onClick={() => {
                      if (!draft.name.trim()) {
                        message.warning('请填写层级名称')
                        return
                      }
                      setRows((prev) => [
                        ...prev,
                        {
                          key: String(Date.now()),
                          id: Math.max(...prev.map((p) => p.id)) + 1,
                          type: mode === 'auto' ? '自动层级' : '固定层级',
                          name: draft.name,
                          desc: draft.desc || '-',
                          tags: [],
                          rechargeCount: draft.rechargeCount,
                          rechargeAmount: draft.rechargeAmount,
                          members: 0,
                        },
                      ])
                      setDraft({ name: '', desc: '', rechargeCount: 0, rechargeAmount: 0 })
                      setAdding(false)
                      message.success('已新增层级')
                    }}
                  >
                    确认
                  </a>
                  <a
                    onClick={() => {
                      setAdding(false)
                      setDraft({ name: '', desc: '', rechargeCount: 0, rechargeAmount: 0 })
                    }}
                  >
                    取消
                  </a>
                </Space>
              ) : (
                <Space>
                  <a>详情</a>
                  <a>修改</a>
                  <a
                    style={{ color: '#ff4d4f' }}
                    onClick={() => {
                      setRows((prev) => prev.filter((x) => x.key !== r.key))
                      message.success('已删除')
                    }}
                  >
                    删除
                  </a>
                </Space>
              ),
          },
        ]}
      />
      <div className="table-footer">共 {data.length} 条 · {mode === 'auto' ? '自动层级' : '固定层级'}</div>
    </div>
  )
}
