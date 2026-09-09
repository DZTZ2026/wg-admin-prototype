import { QuestionCircleFilled } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Modal, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'

const { TextArea } = Input

export interface CompanyRow {
  key: string
  id: number
  name: string
  groupName: string
  groupId: number
  groupRemark: string
  companyRemark: string
  balance: string
  sites: number
  apis: number
  status: '正常' | '冻结'
  frozenAt?: string
  rateAdjust: string
  rateRemark: string
}

export type CompanyModalType = 'add' | 'edit' | 'rate' | 'unfreeze' | 'detail' | null

const RATE_ROWS = [
  { key: '1', gameType: '棋牌', platform: 'WG棋牌', currency: 'ARS', oldRate: '4.0', newRate: '4.0' },
  { key: '2', gameType: '棋牌', platform: 'WG棋牌', currency: 'BRL', oldRate: '4.0', newRate: '4.0' },
  { key: '3', gameType: '棋牌', platform: 'WG棋牌', currency: 'CLP', oldRate: '4.0', newRate: '4.0' },
  { key: '4', gameType: '棋牌', platform: 'WG棋牌', currency: 'COP', oldRate: '4.0', newRate: '4.0' },
  { key: '5', gameType: '棋牌', platform: 'WG棋牌', currency: 'PEN', oldRate: '4.0', newRate: '4.0' },
  { key: '6', gameType: '捕鱼', platform: 'WG捕鱼', currency: 'PYG1000:1', oldRate: '4.0', newRate: '4.0' },
  { key: '7', gameType: '捕鱼', platform: 'WG捕鱼', currency: 'TRX', oldRate: '4.0', newRate: '4.0' },
  { key: '8', gameType: '捕鱼', platform: 'WG捕鱼', currency: 'USDC', oldRate: '4.0', newRate: '4.0' },
  { key: '9', gameType: '捕鱼', platform: 'WG捕鱼', currency: 'USDT', oldRate: '4.0', newRate: '4.0' },
  { key: '10', gameType: '电子', platform: 'WG电子', currency: 'ARS', oldRate: '4.0', newRate: '4.0' },
  { key: '11', gameType: '电子', platform: 'WG电子', currency: 'BRL', oldRate: '4.0', newRate: '4.0' },
]

const RATE_COLUMNS: ColumnsType<(typeof RATE_ROWS)[number]> = [
  { title: '游戏类型', dataIndex: 'gameType', align: 'center' },
  { title: '平台名称', dataIndex: 'platform', align: 'center' },
  { title: '币种', dataIndex: 'currency', align: 'center' },
  { title: '默认旧费率(%)', dataIndex: 'oldRate', align: 'center' },
  { title: '默认新费率(%)', dataIndex: 'newRate', align: 'center' },
]

function CenterFooter({
  onCancel,
  onOk,
  okText = '确认',
}: {
  onCancel: () => void
  onOk: () => void
  okText?: string
}) {
  return (
    <div className="company-modal-footer-center">
      <Button onClick={onCancel}>取消</Button>
      <Button type="primary" onClick={onOk}>
        {okText}
      </Button>
    </div>
  )
}

function EditOrAddModal({
  type,
  company,
  onClose,
  onSave,
}: {
  type: 'add' | 'edit'
  company?: CompanyRow | null
  onClose: () => void
  onSave: (values: { name: string; groupRemark: string }) => void
}) {
  const [form] = Form.useForm()

  return (
    <Modal
      title={type === 'add' ? '新增' : '修改'}
      open
      width={520}
      centered
      destroyOnClose
      className="company-edit-modal"
      onCancel={onClose}
      footer={
        <CenterFooter
          onCancel={onClose}
          onOk={async () => {
            const values = await form.validateFields()
            onSave(values)
          }}
        />
      }
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ style: { width: 90 } }}
        wrapperCol={{ style: { flex: 1 } }}
        colon={false}
        initialValues={{
          name: company?.name || '',
          groupRemark: company?.groupRemark || '',
        }}
      >
        <Form.Item name="name" label="公司名称" rules={[{ required: true, message: '请输入公司名称' }]}>
          <Input placeholder="请输入公司名称" />
        </Form.Item>
        <Form.Item name="groupRemark" label="集团备注">
          <TextArea placeholder="请输入集团备注" maxLength={200} showCount rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function RateModal({ company, onClose, onSave }: { company: CompanyRow; onClose: () => void; onSave: (adjust: string, remark: string) => void }) {
  const [form] = Form.useForm()
  const [platform, setPlatform] = useState('')
  const [currency, setCurrency] = useState<string>()
  const [gameType, setGameType] = useState<string>()
  const [applied, setApplied] = useState({ platform: '', currency: undefined as string | undefined, gameType: undefined as string | undefined })

  const rows = useMemo(() => {
    return RATE_ROWS.filter((r) => {
      if (applied.platform && !r.platform.includes(applied.platform)) return false
      if (applied.currency && r.currency !== applied.currency) return false
      if (applied.gameType && r.gameType !== applied.gameType) return false
      return true
    })
  }, [applied])

  return (
    <Modal
      title="费率调整"
      open
      width={960}
      centered
      destroyOnClose
      className="company-rate-modal"
      onCancel={onClose}
      footer={
        <CenterFooter
          onCancel={onClose}
          onOk={async () => {
            const values = await form.validateFields()
            onSave(String(values.adjust ?? '3.0'), values.rateRemark || '')
          }}
        />
      }
    >
      <div className="company-rate-top">
        <div className="company-rate-col">
          <div>
            <span className="company-rate-label">公司ID</span>
            {company.id}
          </div>
          <div>
            <span className="company-rate-label">公司名称</span>
            {company.name}
          </div>
          <div>
            <span className="company-rate-label">所属集团</span>
            {company.groupName}
          </div>
          <div>
            <span className="company-rate-label">集团备注</span>
            {company.groupRemark || '-'}
          </div>
        </div>
        <div className="company-rate-col">
          <div>
            <span className="company-rate-label">公司余额(U)</span>
            {company.balance}
          </div>
          <div>
            <span className="company-rate-label">公司备注</span>
            {company.companyRemark || ''}
          </div>
        </div>
        <Form
          form={form}
          layout="horizontal"
          colon={false}
          className="company-rate-form"
          initialValues={{ adjust: Number(company.rateAdjust) || 3, rateRemark: company.rateRemark || '1' }}
        >
          <Form.Item name="adjust" label="调整值">
            <InputNumber min={0} step={0.1} precision={1} addonAfter="%" style={{ width: 160 }} />
          </Form.Item>
          <div className="company-rate-rule">
            <div className="company-rate-rule-title">规则说明</div>
            平台允许集团赚取下级公司差价，差价部分只能设置在公司上，每个公司都可以设置不同的值，设置后该公司下的所有api都能赚取差价，每月按账单一次性返还到集团余额。
          </div>
          <Form.Item name="rateRemark" label="费率备注">
            <TextArea maxLength={200} showCount rows={3} />
          </Form.Item>
        </Form>
      </div>

      <div className="company-rate-filter">
        <Input
          placeholder="平台名称"
          allowClear
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{ width: 160 }}
        />
        <Select
          allowClear
          placeholder="全部币种"
          value={currency}
          onChange={setCurrency}
          style={{ width: 140 }}
          options={[...new Set(RATE_ROWS.map((r) => r.currency))].map((v) => ({ value: v, label: v }))}
        />
        <Select
          allowClear
          placeholder="游戏类型"
          value={gameType}
          onChange={setGameType}
          style={{ width: 140 }}
          options={[
            { value: '棋牌', label: '棋牌' },
            { value: '捕鱼', label: '捕鱼' },
            { value: '电子', label: '电子' },
            { value: '真人', label: '真人' },
            { value: '体育', label: '体育' },
            { value: '斗鸡', label: '斗鸡' },
            { value: '电竞', label: '电竞' },
            { value: '彩票', label: '彩票' },
            { value: '区块链', label: '区块链' },
            { value: '房间局', label: '房间局' },
            { value: 'TG内置游戏', label: 'TG内置游戏' },
          ]}
        />
        <Button type="primary" onClick={() => setApplied({ platform, currency, gameType })}>
          搜索
        </Button>
        <Button
          onClick={() => {
            setPlatform('')
            setCurrency(undefined)
            setGameType(undefined)
            setApplied({ platform: '', currency: undefined, gameType: undefined })
          }}
        >
          重置
        </Button>
      </div>

      <Table
        size="small"
        rowKey="key"
        columns={RATE_COLUMNS}
        dataSource={rows}
        pagination={false}
        scroll={{ y: 240 }}
        className="company-rate-table"
      />
    </Modal>
  )
}

function UnfreezeModal({ company, onClose, onConfirm }: { company: CompanyRow; onClose: () => void; onConfirm: () => void }) {
  const [form] = Form.useForm()

  return (
    <Modal
      title="解冻公司"
      open
      width={460}
      centered
      destroyOnClose
      className="company-unfreeze-modal"
      onCancel={onClose}
      footer={
        <div className="company-modal-footer-right">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            onClick={async () => {
              await form.validateFields()
              onConfirm()
            }}
          >
            确认
          </Button>
        </div>
      }
    >
      <div className="company-unfreeze-prompt">
        <QuestionCircleFilled />
        <span>是否要解冻该公司?</span>
      </div>
      <div className="company-unfreeze-divider" />
      <Form form={form} layout="horizontal" labelCol={{ style: { width: 100 } }} colon={false}>
        <Form.Item name="googleCode" label="谷歌验证码" rules={[{ required: true, message: '请输入谷歌验证码' }]}>
          <Input placeholder="请输入谷歌验证码" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function DetailModal({ company, onClose }: { company: CompanyRow; onClose: () => void }) {
  return (
    <Modal
      title="详情"
      open
      width={520}
      centered
      destroyOnClose
      className="company-edit-modal"
      onCancel={onClose}
      footer={
        <div className="company-modal-footer-center">
          <Button type="primary" onClick={onClose}>
            关闭
          </Button>
        </div>
      }
    >
      <div className="company-detail-grid">
        <div>
          <span>公司ID</span>
          {company.id}
        </div>
        <div>
          <span>公司名称</span>
          {company.name}
        </div>
        <div>
          <span>所属集团</span>
          {company.groupName}({company.groupId})
        </div>
        <div>
          <span>公司余额(U)</span>
          {company.balance}
        </div>
        <div>
          <span>站点数量</span>
          {company.sites}
        </div>
        <div>
          <span>API线路数量</span>
          {company.apis}
        </div>
        <div>
          <span>公司状态</span>
          {company.status}
        </div>
        <div>
          <span>集团备注</span>
          {company.groupRemark || '-'}
        </div>
      </div>
    </Modal>
  )
}

export default function CompanyModals({
  type,
  company,
  onClose,
  onAdd,
  onEdit,
  onRate,
  onUnfreeze,
}: {
  type: CompanyModalType
  company: CompanyRow | null
  onClose: () => void
  onAdd: (values: { name: string; groupRemark: string }) => void
  onEdit: (values: { name: string; groupRemark: string }) => void
  onRate: (adjust: string, remark: string) => void
  onUnfreeze: () => void
}) {
  if (type === 'add') {
    return <EditOrAddModal type="add" onClose={onClose} onSave={onAdd} />
  }
  if (type === 'edit' && company) {
    return <EditOrAddModal type="edit" company={company} onClose={onClose} onSave={onEdit} />
  }
  if (type === 'rate' && company) {
    return <RateModal company={company} onClose={onClose} onSave={onRate} />
  }
  if (type === 'unfreeze' && company) {
    return <UnfreezeModal company={company} onClose={onClose} onConfirm={onUnfreeze} />
  }
  if (type === 'detail' && company) {
    return <DetailModal company={company} onClose={onClose} />
  }
  return null
}
