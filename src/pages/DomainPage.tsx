import { useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Select, Space, Table, Tabs, Tag, message } from 'antd'
import { domainRows } from '../mock'

export default function DomainPage() {
  const [provider, setProvider] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState(domainRows)
  const [form] = Form.useForm()

  const data = useMemo(() => {
    return rows.filter((r) => {
      if (keyword && !r.domain.includes(keyword)) return false
      return true
    })
  }, [rows, keyword])

  return (
    <div className="page-panel">
      <Tabs
        className="sub-tabs"
        defaultActiveKey="domain"
        items={[
          { key: 'lobby', label: 'Web大厅' },
          { key: 'backend', label: '后台加速域名' },
          { key: 'app', label: 'APP更新' },
          { key: 'oss', label: 'OSS加速域名' },
          { key: 'download', label: '下载站域名' },
          { key: 'domain', label: '域名检测' },
          { key: 'custom', label: '自定义分析' },
        ]}
      />
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 140, flexShrink: 0 }}>
          {[
            { key: 'all', label: '全部' },
            { key: 'cf', label: 'Cloudflare', active: true },
            { key: 'limit', label: '限额说明' },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => setProvider(item.key)}
              style={{
                padding: '10px 12px',
                marginBottom: 6,
                borderRadius: 4,
                cursor: 'pointer',
                background: provider === item.key ? '#e6f4ff' : '#fafafa',
                color: provider === item.key ? '#1677ff' : '#595959',
                border: '1px solid #f0f0f0',
              }}
            >
              {item.label}
              {item.active ? (
                <Tag color="success" style={{ marginLeft: 6 }}>
                  active
                </Tag>
              ) : null}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="filter-bar">
            <Select
              defaultValue="all"
              style={{ width: 140 }}
              options={[
                { value: 'all', label: '全部主域名' },
                { value: 'play', label: 'play-*.example.com' },
              ]}
            />
            <Select
              defaultValue="all"
              style={{ width: 140 }}
              options={[
                { value: 'all', label: '应用场景' },
                { value: 'web', label: 'Web大厅' },
                { value: 'dl', label: '下载站' },
              ]}
            />
            <Select
              defaultValue="all"
              style={{ width: 140 }}
              options={[
                { value: 'all', label: '主域名状态' },
                { value: 'ok', label: '正常' },
              ]}
            />
            <Input
              placeholder="搜索域名"
              style={{ width: 200 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
            />
            <Space>
              <Button type="primary">搜索</Button>
              <Button onClick={() => setKeyword('')}>重置</Button>
              <Button type="primary" onClick={() => setOpen(true)}>
                + 新增
              </Button>
              <Button>封锁检测</Button>
              <Button
                onClick={() =>
                  Modal.info({
                    title: 'PC代理后台设置',
                    width: 720,
                    content: (
                      <Table
                        size="small"
                        pagination={false}
                        locale={{ emptyText: '暂无数据' }}
                        columns={[
                          { title: '选择节点', dataIndex: 'node' },
                          { title: '主域名', dataIndex: 'domain' },
                          { title: '生效域名', dataIndex: 'active' },
                          { title: '使用状态', dataIndex: 'status' },
                          { title: '备注', dataIndex: 'remark' },
                          { title: '操作', dataIndex: 'action' },
                        ]}
                        dataSource={[]}
                      />
                    ),
                  })
                }
              >
                PC代理后台设置
              </Button>
            </Space>
          </div>
          <Table
            size="middle"
            dataSource={data}
            pagination={false}
            columns={[
              { title: 'CDN节点名称', dataIndex: 'cdn' },
              { title: 'DNS节点名称', dataIndex: 'dns' },
              {
                title: '主域名(子域名数)',
                dataIndex: 'domain',
                render: (v, r) => (
                  <span>
                    {v} <Tag>{r.subs}</Tag>
                  </span>
                ),
              },
              { title: '验证方式', dataIndex: 'verify' },
              {
                title: '状态',
                dataIndex: 'status',
                render: (v) => <Tag color={v === '正常' ? 'success' : 'processing'}>{v}</Tag>,
              },
              { title: '域名到期日', dataIndex: 'domainExpire' },
              { title: '证书到期日', dataIndex: 'certExpire' },
              { title: '应用场景', dataIndex: 'scenario' },
            ]}
          />
          <div className="table-footer">共 {data.length} 条</div>
        </div>
      </div>

      <Modal
        title="新增域名"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields()
          setRows((prev) => [
            {
              key: String(Date.now()),
              cdn: values.cdn,
              dns: values.dns,
              domain: values.domain,
              subs: 0,
              verify: values.verify,
              status: '正常',
              domainExpire: '2027-01-01',
              certExpire: '2026-12-01',
              scenario: values.scenario,
            },
            ...prev,
          ])
          message.success('已新增（原型本地数据）')
          setOpen(false)
          form.resetFields()
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ verify: 'TXT', scenario: 'Web大厅' }}>
          <Form.Item name="domain" label="主域名" rules={[{ required: true }]}>
            <Input placeholder="例如 api.example.com" />
          </Form.Item>
          <Form.Item name="cdn" label="CDN节点" rules={[{ required: true }]}>
            <Input placeholder="CF-SG-01" />
          </Form.Item>
          <Form.Item name="dns" label="DNS节点" rules={[{ required: true }]}>
            <Input placeholder="dns-sg" />
          </Form.Item>
          <Form.Item name="verify" label="验证方式">
            <Select options={[{ value: 'TXT' }, { value: 'CNAME' }]} />
          </Form.Item>
          <Form.Item name="scenario" label="应用场景">
            <Select options={[{ value: 'Web大厅' }, { value: '后台加速' }, { value: '下载站' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
