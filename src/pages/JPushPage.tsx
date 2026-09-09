import { useState } from 'react'
import { Button, Form, Input, Modal, Radio, Space, Table, message } from 'antd'
import { jpushRows } from '../mock'

export default function JPushPage() {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState(jpushRows)
  const [form] = Form.useForm()

  return (
    <div className="page-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="section-title" style={{ marginTop: 0 }}>
            全球极光
          </div>
          <div style={{ color: '#8c8c8c', fontSize: 13 }}>套餐价格 5 折活动 · 开通流程与价格明细（原型示意）</div>
        </div>
        <Button type="primary" onClick={() => setOpen(true)}>
          + 新增
        </Button>
      </div>
      <Table
        size="middle"
        dataSource={rows}
        pagination={false}
        columns={[
          { title: '邮箱', dataIndex: 'email' },
          { title: '组织ID', dataIndex: 'orgId' },
          { title: '推送端口', dataIndex: 'port' },
          { title: 'WebKey', dataIndex: 'webKey' },
          { title: '备注', dataIndex: 'remark' },
          {
            title: '操作',
            render: () => (
              <Space>
                <a>编辑</a>
                <a>删除</a>
              </Space>
            ),
          },
        ]}
      />
      <div className="table-footer">共 {rows.length} 条</div>

      <Modal
        title="新增"
        open={open}
        width={720}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields()
          setRows((prev) => [
            {
              key: String(Date.now()),
              email: values.email,
              orgId: values.orgId || '-',
              port: values.port,
              webKey: values.webKey,
              remark: values.remark || '-',
            },
            ...prev,
          ])
          message.success('配置已保存（原型）')
          setOpen(false)
          form.resetFields()
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ port: 'Web/H5端' }}>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="orgId" label="组织ID">
            <Input placeholder="请输入组织ID" />
          </Form.Item>
          <Form.Item name="port" label="推送端口" rules={[{ required: true }]}>
            <Radio.Group
              options={[
                { value: 'Web/H5端', label: 'Web/H5端' },
                { value: 'APP端', label: 'APP端' },
              ]}
            />
          </Form.Item>
          <Form.Item name="webKey" label="WebKey" rules={[{ required: true }]}>
            <Input placeholder="请输入 WebKey" />
          </Form.Item>
          <Form.Item name="masterSecret" label="Master Secret" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入 Master Secret" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={5} placeholder="支持富文本示意，这里用多行文本代替" showCount maxLength={500} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
