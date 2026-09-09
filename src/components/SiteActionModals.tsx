import { CopyOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Radio, Select, Tabs, Upload, message } from 'antd'
import { type Key, type ReactNode, useState } from 'react'
import SiteConfigReadonlyView, { hasCompletedSiteConfig } from './siteConfig/SiteConfigReadonlyView'
import SiteConfigModal from './SiteConfigModal'
import ConfigSelectTable from './siteConfig/ConfigSelectTable'
import { CS_ROWS } from './siteConfig/configMock'

const { TextArea } = Input

export type SiteActionType = '修改' | '编辑' | '强制冻结' | '转让' | '记录' | '详情' | '注销'

export interface SiteActionSite {
  key: string
  siteId: string
  siteName: string
  siteType: string
  groupId?: string
  companyId?: string
  siteMode?: string
  owner?: string
  business?: string
  referralMethod?: string
  referrer?: string
  clientSkin?: string
  currency: string
  timezone: string
  primaryDomain?: string
  backupDomain?: string
  backendDomain: string
  balance?: string
  deposit?: string
  lineFee: string
  openStatus: string
  operateTime?: string
}

interface SiteActionModalsProps {
  action: SiteActionType | null
  site: SiteActionSite | null
  onClose: () => void
  /** 编辑：merchant 用站点后台精简弹窗；full 用总控站点配置弹窗 */
  editMode?: 'merchant' | 'full'
}

const OWNER_OPTIONS = [
  { value: 'bole888', label: 'bole888' },
  { value: 'bole', label: 'bole' },
  { value: 'tempo', label: 'tempo' },
]

const TRANSFER_COMPANY_OPTIONS = [
  { value: '1179', label: '伯乐(1179)' },
  { value: '1001', label: '测试公司(1001)' },
]

function getDomainPrefix(site: SiteActionSite) {
  const domain = site.primaryDomain || site.backendDomain
  return domain.replace(/\.cg\.ink$/, '')
}

function copyText(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => message.success(`已复制：${text}`),
    () => message.info(`复制：${text}（原型）`),
  )
}

function ReadItem({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="site-action-read-item">
      <span className="site-action-read-label">{label}</span>
      <span className="site-action-read-value">{value || '-'}</span>
    </div>
  )
}

function ModalFooter({ onClose, onOk, okText = '确认' }: { onClose: () => void; onOk?: () => void; okText?: string }) {
  return (
    <div className="site-action-modal-footer">
      <Button onClick={onClose}>取消</Button>
      {onOk ? (
        <Button type="primary" onClick={onOk}>
          {okText}
        </Button>
      ) : null}
    </div>
  )
}

const LOGO_FIELDS = [
  { name: 'logoLongDark', label: '长LOGO (黑夜)' },
  { name: 'logoShortDark', label: '短LOGO (黑夜)' },
  { name: 'logoLongLight', label: '长LOGO (白天)' },
  { name: 'logoShortLight', label: '短LOGO (白天)' },
] as const

function ModifyLogoUploadItem({ label, name }: { label: string; name: string }) {
  return (
    <Form.Item
      name={name}
      label={label}
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24, style: { flex: 'none', maxWidth: '100%' } }}
      rules={[{ required: true, type: 'array', min: 1, message: `请上传${label}` }]}
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        const list = Array.isArray(e) ? e : e?.fileList
        return (list || []).slice(-1)
      }}
      className="site-config-logo-item"
      extra="上传2m以内的图片; 支持格式: jpg,png,svg,webp...."
    >
      <Upload
        listType="picture-card"
        maxCount={1}
        accept=".jpg,.jpeg,.png,.svg,.webp"
        beforeUpload={(file) => {
          const ok = file.size / 1024 / 1024 <= 2
          if (!ok) message.error('图片需在 2MB 以内')
          return false
        }}
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 6 }}>上传</div>
        </div>
      </Upload>
    </Form.Item>
  )
}

function ModifyModal({ site, onClose }: { site: SiteActionSite; onClose: () => void }) {
  const [form] = Form.useForm()
  const [csKeys, setCsKeys] = useState<Key[]>(CS_ROWS.map((r) => r.key))

  return (
    <Modal
      title="编辑"
      open
      width={1100}
      centered
      destroyOnClose
      className="site-action-modal site-config-modal site-modify-modal"
      onCancel={onClose}
      footer={
        <div className="site-action-modal-footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            onClick={async () => {
              await form.validateFields()
              message.success('编辑已保存（原型）')
              onClose()
            }}
          >
            保存
          </Button>
        </div>
      }
    >
      <div className="site-action-confirm-text">
        站点名称: {site.siteName}，站点ID: {site.siteId}
      </div>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ style: { width: 150, flex: '0 0 150px' } }}
        wrapperCol={{ style: { flex: 1 } }}
        colon={false}
        className="site-action-form site-config-form"
        initialValues={{
          siteName: site.siteName,
          owner: site.owner,
          domainPrefix: getDomainPrefix(site),
          remark: '',
        }}
      >
        <Tabs
          className="site-config-tabs"
          items={[
            {
              key: 'basic',
              label: '基础信息',
              children: (
                <>
                  <ReadItem label="所属集团" value={site.groupId} />
                  <ReadItem label="所属公司" value={site.companyId} />
                  <ReadItem label="站点类型" value={site.siteType} />
                  <Form.Item name="siteName" label="站点名称" rules={[{ required: true, message: '请输入站点名称' }]}>
                    <Input maxLength={20} />
                  </Form.Item>
                  <Form.Item name="owner" label="站点持有人" rules={[{ required: true, message: '请选择站点持有人' }]}>
                    <Select options={OWNER_OPTIONS} />
                  </Form.Item>
                  <Form.Item name="domainPrefix" label="后台域名" rules={[{ required: true, message: '请输入后台域名' }]}>
                    <Input addonAfter=".cg.ink" />
                  </Form.Item>
                  <ReadItem label="客户端皮肤" value={site.clientSkin} />
                  <ReadItem label="客户端语言匹配模式" value="系统默认" />
                  <ReadItem label="语言" value="葡萄牙语" />
                  <div className="site-action-tip">请前往站点后台 运营管理-品牌设置-皮肤语言配置修改皮肤和语言</div>
                  <ReadItem label="时区" value={site.timezone} />
                  <ReadItem label="开站费(U)" value="20,000.00" />
                  <ReadItem label="站点押金(U)" value={site.deposit || '0.00'} />
                  <ReadItem label="线路维护费(U)" value={site.lineFee} />
                  <Form.Item name="remark" label="备注">
                    <TextArea placeholder="请输入备注" maxLength={200} showCount rows={3} />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'logo',
              label: '站点 LOGO',
              children: (
                <>
                  <div className="site-config-section-title">站点 LOGO</div>
                  <div className="site-config-logo-grid">
                    {LOGO_FIELDS.map((item) => (
                      <ModifyLogoUploadItem key={item.name} name={item.name} label={item.label} />
                    ))}
                  </div>
                </>
              ),
            },
            {
              key: 'cs',
              label: '客服通道',
              children: (
                <ConfigSelectTable
                  selectedKeys={csKeys}
                  onChange={setCsKeys}
                  dataSource={CS_ROWS}
                  scrollX={1200}
                  filters={[
                    { key: 'name', kind: 'input', placeholder: '请输入通道名称' },
                    { key: 'code', kind: 'input', placeholder: '请输入通道代码' },
                  ]}
                  matchRow={(row, values) => {
                    if (values.name && !row.channelName.includes(values.name)) return false
                    if (values.code && !row.channelCode.includes(values.code)) return false
                    return true
                  }}
                  columns={[
                    { title: '通道ID', dataIndex: 'channelId', width: 100 },
                    { title: '通道名称', dataIndex: 'channelName', width: 130 },
                    { title: '通道代码', dataIndex: 'channelCode', width: 140 },
                    { title: '客服类型', dataIndex: 'csType', width: 100 },
                    { title: '通道地址', dataIndex: 'channelAddress', width: 280, ellipsis: true },
                    { title: '备注', dataIndex: 'remark', width: 140 },
                    { title: '状态', dataIndex: 'status', width: 80 },
                    { title: '操作时间', dataIndex: 'operateTime', width: 160 },
                    { title: '操作人', dataIndex: 'operator', width: 120 },
                  ]}
                />
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  )
}

function FreezeModal({ site, onClose }: { site: SiteActionSite; onClose: () => void }) {
  const [form] = Form.useForm()

  return (
    <Modal
      title="强制冻结"
      open
      width={520}
      centered
      destroyOnClose
      className="site-action-modal"
      onCancel={onClose}
      footer={
        <ModalFooter
          onClose={onClose}
          onOk={async () => {
            await form.validateFields()
            message.success('站点已冻结（原型）')
            onClose()
          }}
        />
      }
    >
      <div className="site-action-confirm-text">
        站点名称: {site.siteName}, 站点ID: {site.siteId}, 是否冻结该站点?
      </div>
      <Form form={form} layout="vertical" className="site-action-form">
        <Form.Item name="remark" label="备注">
          <TextArea placeholder="请输入备注" maxLength={200} showCount rows={4} />
        </Form.Item>
        <Form.Item name="googleCode" label="谷歌验证码" rules={[{ required: true, message: '请输入谷歌验证码' }]}>
          <Input placeholder="请输入谷歌验证码" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function TransferModal({ site, onClose }: { site: SiteActionSite; onClose: () => void }) {
  const [form] = Form.useForm()
  const transferType = Form.useWatch('transferType', form) || 'internal'

  return (
    <Modal
      title="转让站点"
      open
      width={560}
      centered
      destroyOnClose
      className="site-action-modal"
      onCancel={onClose}
      footer={
        <ModalFooter
          onClose={onClose}
          onOk={async () => {
            await form.validateFields()
            message.success('转让申请已提交（原型）')
            onClose()
          }}
        />
      }
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ style: { width: 100, flex: '0 0 100px' } }}
        wrapperCol={{ style: { flex: 1 } }}
        colon={false}
        className="site-action-form"
        initialValues={{ transferType: 'internal' }}
      >
        <ReadItem label="所属集团" value={site.groupId?.replace(/\(\d+\)/, '') || '伯乐'} />
        <ReadItem label="所属公司" value={site.companyId} />
        <ReadItem label="站点名称" value={site.siteName} />
        <Form.Item name="transferType" label="转让类型" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="internal">内部转让</Radio>
            <Radio value="external">外部转让</Radio>
          </Radio.Group>
        </Form.Item>
        {transferType === 'internal' ? (
          <Form.Item name="transferCompany" label="转让公司" rules={[{ required: true, message: '请选择转让公司' }]}>
            <Select placeholder="请选择转让公司" options={TRANSFER_COMPANY_OPTIONS} />
          </Form.Item>
        ) : (
          <div className="site-action-confirm-text">提示: 外部转让需进行审核，请联系商务！！</div>
        )}
        <Form.Item name="remark" label="备注">
          <TextArea placeholder="请输入备注" maxLength={200} showCount rows={3} />
        </Form.Item>
        <Form.Item name="googleCode" label="谷歌验证码" rules={[{ required: true, message: '请输入谷歌验证码' }]}>
          <Input placeholder="请输入谷歌验证码" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function RecordModal({ site, onClose }: { site: SiteActionSite; onClose: () => void }) {
  return (
    <Modal
      title="记录"
      open
      width={640}
      centered
      destroyOnClose
      className="site-action-modal"
      onCancel={onClose}
      footer={
        <div className="site-action-modal-footer site-action-modal-footer-single">
          <Button type="primary" onClick={onClose}>
            关闭
          </Button>
        </div>
      }
    >
      <div className="site-action-record">
        <ReadItem label="站点类型" value={site.siteType} />
        <ReadItem label="站点名称" value={site.siteName} />
        <ReadItem label="所属集团" value={site.groupId?.replace(/\(\d+\)/, '') || '伯乐'} />
        <ReadItem label="所属公司" value={site.companyId} />
        <ReadItem label="站点模式" value={site.siteMode} />
        <ReadItem label="客户端皮肤" value={site.clientSkin} />
        <ReadItem label="语言" value="葡萄牙语" />
        <ReadItem label="时区" value={site.timezone} />
        <ReadItem label="币种" value={<span className="site-action-tag">{site.currency}</span>} />
        <ReadItem label="后台域名" value={site.primaryDomain || site.backendDomain} />
        <ReadItem label="申请人" value={site.business || 'tempo'} />
        <ReadItem label="申请时间" value="2024-03-01 01:30:10" />
        <ReadItem label="开站时间" value={site.operateTime || '2024-03-01 01:41:43'} />
        <ReadItem label="备注" value="-" />

        <div className="site-action-section-title">审批信息</div>
        <div className="site-action-audit-block">
          <div className="site-action-audit-title status-ok">一审备注：审核通过</div>
          <ReadItem label="审批人" value="system" />
          <ReadItem label="审批时间" value="2024-03-01 01:30:09" />
        </div>
        <div className="site-action-audit-block">
          <div className="site-action-audit-title status-ok">二审备注：审核通过</div>
          <ReadItem label="审批人" value="tempo" />
          <ReadItem label="审批时间" value="2024-03-01 01:30:24" />
        </div>
      </div>
    </Modal>
  )
}

function DetailModal({ site, onClose }: { site: SiteActionSite; onClose: () => void }) {
  const statusNode =
    site.openStatus === '已上线' || site.openStatus === '已配置' ? (
      <span className="status-ok">{site.openStatus}</span>
    ) : (
      site.openStatus
    )

  const summary = (
    <div className="site-action-detail-summary">
      <div className="site-action-detail-col">
        <ReadItem label="站点ID" value={site.siteId} />
        <ReadItem label="站点名称" value={site.siteName} />
        <ReadItem label="站点类型" value={site.siteType} />
        <ReadItem label="开站状态" value={statusNode} />
        <ReadItem label="所属集团" value={site.groupId?.replace(/\(\d+\)/, '') || '伯乐'} />
        <ReadItem label="所属公司" value={site.companyId} />
        <ReadItem label="客户端皮肤" value={site.clientSkin} />
        <ReadItem label="客户端语言匹配模式" value="系统默认" />
        <ReadItem label="币种" value={site.currency} />
        <ReadItem label="站点模式" value={site.siteMode} />
        <ReadItem label="代理模式" value={<span className="site-action-link-text">无极极差</span>} />
        <ReadItem label="语言" value="葡萄牙语" />
      </div>
      <div className="site-action-detail-col">
        <ReadItem label="可用额度(U)" value={<span className="amount-highlight">16,498.49</span>} />
        <ReadItem label="授信额度(U)" value="20,000.00" />
        <ReadItem label="站点余额(U)" value={<span className="amount-highlight">{site.balance || '0.00'}</span>} />
        <ReadItem label="站点透支额比例" value="17%" />
        <ReadItem label="开站费(U)" value="20,000.00" />
        <ReadItem label="站点押金(U)" value={site.deposit || '0.00'} />
        <ReadItem label="未结账单(U)" value={<span className="status-ok">-3,596.41</span>} />
        <ReadItem label="线路费用(U)" value={site.lineFee} />
      </div>
      <div className="site-action-detail-col">
        <ReadItem label="推荐方式" value={site.referralMethod} />
        <ReadItem label="时区" value={site.timezone} />
        <ReadItem label="持有人" value={site.owner} />
        <ReadItem label="OSS厂商" value="AWS S3-美国硅谷 (arry6t-5922-ppp)" />
        <ReadItem label="对接商务" value={site.business?.trim() ? site.business : '-'} />
        <ReadItem label="推荐人/推荐单位" value={site.referrer} />
        <div className="site-action-read-item site-action-read-item-top">
          <span className="site-action-read-label">后台域名</span>
          <div className="site-action-read-value">
            <div>
              主：{site.primaryDomain || site.backendDomain}
              <CopyOutlined className="copy-icon" onClick={() => copyText(site.primaryDomain || site.backendDomain)} />
            </div>
            <div>
              备：{site.backupDomain || '-'}
              {site.backupDomain ? (
                <CopyOutlined className="copy-icon" onClick={() => copyText(site.backupDomain!)} />
              ) : null}
            </div>
          </div>
        </div>
        <ReadItem label="备注" value="-" />
      </div>
    </div>
  )

  return (
    <Modal
      title="详情"
      open
      width={1180}
      centered
      destroyOnClose
      className="site-action-modal site-action-detail-modal site-config-detail-modal"
      onCancel={onClose}
      footer={
        <div className="site-action-modal-footer site-action-modal-footer-single">
          <Button type="primary" onClick={onClose}>
            关闭
          </Button>
        </div>
      }
    >
      <div className="site-action-confirm-text">
        站点名称: {site.siteName}，站点ID: {site.siteId}
      </div>
      <SiteConfigReadonlyView
        site={site}
        summary={summary}
        showConfigTabs={hasCompletedSiteConfig(site.openStatus)}
      />
    </Modal>
  )
}

function CancelSiteModal({ site, onClose }: { site: SiteActionSite; onClose: () => void }) {
  const [form] = Form.useForm()

  return (
    <Modal
      title="注销"
      open
      width={520}
      centered
      destroyOnClose
      className="site-action-modal"
      onCancel={onClose}
      footer={
        <div className="site-action-modal-footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            danger
            onClick={async () => {
              await form.validateFields()
              message.success(`${site.siteName} 已提交注销申请，进入注销待技术审（原型）`)
              onClose()
            }}
          >
            确认申请
          </Button>
        </div>
      }
    >
      <div className="site-action-confirm-text">
        站点名称: {site.siteName}，站点ID: {site.siteId}，确认后将提交注销申请（注销待技术审）
      </div>
      <Form form={form} layout="vertical">
        <Form.Item name="remark" label="注销原因" rules={[{ required: true, message: '请输入注销原因' }]}>
          <TextArea placeholder="请输入注销原因" maxLength={200} showCount rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default function SiteActionModals({
  action,
  site,
  onClose,
  editMode = 'full',
}: SiteActionModalsProps) {
  if (!action || !site) return null

  switch (action) {
    case '修改':
      return <ModifyModal site={site} onClose={onClose} />
    case '编辑':
      return editMode === 'merchant' ? (
        <ModifyModal site={site} onClose={onClose} />
      ) : (
        <SiteConfigModal site={site} onClose={onClose} mode="edit" />
      )
    case '强制冻结':
      return <FreezeModal site={site} onClose={onClose} />
    case '转让':
      return <TransferModal site={site} onClose={onClose} />
    case '记录':
      return <RecordModal site={site} onClose={onClose} />
    case '详情':
      return <DetailModal site={site} onClose={onClose} />
    case '注销':
      return <CancelSiteModal site={site} onClose={onClose} />
    default:
      return null
  }
}
