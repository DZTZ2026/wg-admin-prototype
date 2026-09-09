import { Button, Form, Input, Modal, Select, message } from 'antd'
import SiteActionModals, { type SiteActionSite, type SiteActionType } from './SiteActionModals'
import SiteConfigModal from './SiteConfigModal'

const { TextArea } = Input

export type MasterStateAction =
  | '补充资料'
  | '拒绝'
  | '站点配置'
  | '提交审核'
  | '退回创建中'
  | '退回配置中'
  | '审核通过'
  | '审核拒绝'
  | '确认到账'
  | '催办'
  | '关闭订单'
  | '注销'
  | '详情'

/** 新流程：创建中 →(补充资料)→ 待付款 →(确认到账)→ 配置中 →(配置/提交审核)→ 待审核 →(审核通过)→ 已上线 */
const TARGET_STATUS: Partial<Record<MasterStateAction, string>> = {
  拒绝: '已拒绝',
  提交审核: '开站待技术审',
  退回创建中: '创建中',
  退回配置中: '配置中',
  审核通过: '已上线',
  审核拒绝: '已拒绝',
  确认到账: '配置中',
  关闭订单: '待关闭',
  注销: '注销待技术审',
}

const REMARK_REQUIRED = new Set<MasterStateAction>([
  '拒绝',
  '审核拒绝',
  '关闭订单',
  '退回创建中',
  '退回配置中',
  '注销',
])

const BUSINESS_OPTIONS = [
  { value: 'tempo', label: 'tempo' },
  { value: 'cooper', label: 'cooper' },
  { value: 'system', label: 'system' },
]

const REFERRAL_OPTIONS = [
  { value: '个人', label: '个人' },
  { value: '站点', label: '站点' },
  { value: '集团', label: '集团' },
  { value: '商务', label: '商务' },
  { value: '无', label: '无' },
]

interface MasterStateModalsProps {
  action: MasterStateAction | null
  site: SiteActionSite | null
  onClose: () => void
  onSupplementSave?: (
    siteKey: string,
    values: { business: string; referralMethod?: string; lineFee?: string; remark?: string },
  ) => void
  onConfigSave?: (siteKey: string) => void
  onSubmitAudit?: (siteKey: string) => void
  onReturnToConfiguring?: (siteKey: string) => void
  onConfirmPay?: (siteKey: string) => void
  onAuditPass?: (siteKey: string) => void
}

function ConfirmModal({
  action,
  site,
  onClose,
  onConfirm,
}: {
  action: MasterStateAction
  site: SiteActionSite
  onClose: () => void
  onConfirm?: () => void
}) {
  const [form] = Form.useForm()
  const needRemark = REMARK_REQUIRED.has(action)
  const target = TARGET_STATUS[action]

  return (
    <Modal
      title={action}
      open
      centered
      destroyOnClose
      className="site-action-modal"
      onCancel={onClose}
      footer={
        <div className="site-action-modal-footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            onClick={async () => {
              if (needRemark) await form.validateFields()
              const remark = form.getFieldValue('remark')
              onConfirm?.()
              message.success(
                target
                  ? `${site.siteName}：${site.openStatus} → ${target}（原型）${remark ? `，备注：${remark}` : ''}`
                  : `${action}已执行（原型）`,
              )
              onClose()
            }}
          >
            确认
          </Button>
        </div>
      }
    >
      <div className="site-action-confirm-text">
        站点名称: {site.siteName}，站点ID: {site.siteId}
        {target ? `，确认后将变更为「${target}」` : ''}
        {action === '催办' ? '，将向商户发送催办通知' : ''}
        {action === '注销' ? '，将提交注销申请进入审核' : ''}
      </div>
      <Form form={form} layout="vertical">
        <Form.Item
          name="remark"
          label="备注"
          rules={needRemark ? [{ required: true, message: '请输入备注' }] : []}
        >
          <TextArea placeholder="请输入备注" maxLength={200} showCount rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function SupplementModal({
  site,
  onClose,
  onSave,
}: {
  site: SiteActionSite
  onClose: () => void
  onSave?: (values: {
    business: string
    referralMethod?: string
    lineFee?: string
    remark?: string
  }) => void
}) {
  const [form] = Form.useForm()

  return (
    <Modal
      title="补充资料"
      open
      width={560}
      centered
      destroyOnClose
      className="site-action-modal"
      onCancel={onClose}
      footer={
        <div className="site-action-modal-footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            onClick={async () => {
              const values = await form.validateFields()
              onSave?.({
                business: values.business,
                referralMethod: values.referralMethod,
                lineFee: values.lineFee,
                remark: values.remark,
              })
              message.success(`${site.siteName} 补充资料已保存，进入待付款（原型）`)
              onClose()
            }}
          >
            保存
          </Button>
        </div>
      }
    >
      <div className="site-action-confirm-text">
        站点名称: {site.siteName}，站点ID: {site.siteId}，保存后将进入「待付款」
      </div>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ style: { width: 110 } }}
        colon={false}
        initialValues={{
          business: site.business || undefined,
          referralMethod: site.referralMethod || undefined,
          lineFee: site.lineFee || undefined,
        }}
      >
        <Form.Item name="business" label="对接商务" rules={[{ required: true, message: '请选择对接商务' }]}>
          <Select placeholder="请选择对接商务" options={BUSINESS_OPTIONS} />
        </Form.Item>
        <Form.Item name="referralMethod" label="推荐方式" rules={[{ required: true, message: '请选择推荐方式' }]}>
          <Select placeholder="请选择推荐方式" options={REFERRAL_OPTIONS} />
        </Form.Item>
        <Form.Item name="lineFee" label="线路维护费(U)">
          <Input placeholder={site.lineFee || '3,000.00'} />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea maxLength={200} showCount rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default function MasterStateModals({
  action,
  site,
  onClose,
  onSupplementSave,
  onConfigSave,
  onSubmitAudit,
  onReturnToConfiguring,
  onConfirmPay,
  onAuditPass,
}: MasterStateModalsProps) {
  if (!action || !site) return null

  if (action === '详情') {
    return <SiteActionModals action={'详情' as SiteActionType} site={site} onClose={onClose} />
  }

  if (action === '补充资料') {
    return (
      <SupplementModal
        site={site}
        onClose={onClose}
        onSave={(values) => onSupplementSave?.(site.key, values)}
      />
    )
  }

  if (action === '站点配置') {
    return <SiteConfigModal site={site} onClose={onClose} onSave={() => onConfigSave?.(site.key)} />
  }

  if (action === '注销') {
    return (
      <SiteActionModals action={'注销' as SiteActionType} site={site} onClose={onClose} />
    )
  }

  return (
    <ConfirmModal
      action={action}
      site={site}
      onClose={onClose}
      onConfirm={
        action === '提交审核'
          ? () => onSubmitAudit?.(site.key)
          : action === '退回配置中'
            ? () => onReturnToConfiguring?.(site.key)
            : action === '确认到账'
              ? () => onConfirmPay?.(site.key)
              : action === '审核通过'
                ? () => onAuditPass?.(site.key)
                : undefined
      }
    />
  )
}

export function hasBusinessAssigned(site: { business?: string }) {
  return Boolean(site.business && site.business.trim() && site.business !== '-')
}

export function hasSiteConfigured(site: { openStatus?: string }) {
  return site.openStatus === '已配置'
}

export function getMasterTabActions(subTab: string): MasterStateAction[] {
  switch (subTab) {
    case 'creating':
      return ['补充资料', '拒绝', '详情']
    case 'pending-pay':
      return ['确认到账', '催办', '关闭订单', '详情']
    case 'configuring':
      return ['站点配置', '提交审核', '退回创建中', '详情']
    case 'pending-audit':
      return ['审核通过', '审核拒绝', '退回配置中', '详情']
    case 'online':
      return ['注销', '详情']
    case 'cancelled':
      return ['详情']
    default:
      return []
  }
}
