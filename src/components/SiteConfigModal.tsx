import { useState, type Key } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Tabs,
  Upload,
  message,
} from 'antd'
import type { SiteActionSite } from './SiteActionModals'
import ConfigSelectTable from './siteConfig/ConfigSelectTable'
import {
  ACTIVITY_TEMPLATE_OPTIONS,
  CS_ROWS,
  DEPOSIT_ROWS,
  MAIL_ROWS,
  PAY_CURRENCY_TABS,
  SMS_ROWS,
  STATUS_OPTIONS,
  VENUE_ROWS,
  VENUE_TYPE_OPTIONS,
  WITHDRAW_ROWS,
} from './siteConfig/configMock'

const { TextArea } = Input

const OSS_OPTIONS = [
  { value: 'aws-sv', label: 'AWS S3-美国硅谷' },
  { value: 'aws-oregon', label: 'AWS S3-美国俄勒冈' },
  { value: 'aliyun-hk', label: '阿里云-香港' },
]

const SKIN_STYLE_OPTIONS = [
  { value: '综合版10', label: '综合版10' },
  { value: '综合版11', label: '综合版11' },
  { value: '综合版13', label: '综合版13' },
  { value: '电子版1', label: '电子版1' },
  { value: '体育版1', label: '体育版1' },
  { value: 'U版2', label: 'U版2' },
  { value: '真人版1', label: '真人版1' },
  { value: '俱乐部版1', label: '俱乐部版1' },
]

const CLIENT_SKIN_OPTIONS = [
  { value: '皇冠棕', label: '皇冠棕' },
  { value: '紫金', label: '紫金' },
  { value: '锈红色底', label: '锈红色底' },
  { value: '宝蓝色底', label: '宝蓝色底' },
  { value: '油青绿底', label: '油青绿底' },
]

const TZ_OPTIONS = [
  { value: 'UTC+8', label: '(UTC +08:00)中国, 新加坡, 马来西亚' },
  { value: 'UTC-3', label: '(UTC -03:00)格陵兰, 巴西, 阿根廷, 智利' },
  { value: 'UTC+0', label: '(UTC +00:00)伦敦, 里斯本' },
  { value: 'UTC+7', label: '(UTC +07:00)泰国, 越南, 印度尼西亚' },
]

const CURRENCY_OPTIONS = [
  { value: 'USDT', label: 'USDT' },
  { value: 'BRL', label: '巴西(BRL)' },
  { value: 'MXN', label: '墨西哥(MXN)' },
  { value: 'PHP', label: '菲律宾(PHP)' },
]

const LANG_OPTIONS = ['简体中文', '英文', '泰语', '越南语', '葡萄牙语', '西班牙语', '印度尼西亚语']

const AGENT_MODE_OPTIONS = [
  { value: 'everyone', label: '只开启人人皆可代理' },
  { value: 'professional', label: '只开启专业代理' },
  { value: 'both', label: '人人和专业代理共存' },
]

const LOGO_FIELDS = [
  { name: 'logoLongDark', label: '长LOGO (黑夜)' },
  { name: 'logoShortDark', label: '短LOGO (黑夜)' },
  { name: 'logoLongLight', label: '长LOGO (白天)' },
  { name: 'logoShortLight', label: '短LOGO (白天)' },
] as const

const PayIcon = () => <span className="site-config-pay-icon">支</span>

interface SiteConfigModalProps {
  site: SiteActionSite
  onClose: () => void
  onSave?: () => void
  /** config：配置中推进为已配置；edit：全部站点编辑，不改开站状态 */
  mode?: 'config' | 'edit'
}

function LogoUploadItem({ label, name }: { label: string; name: string }) {
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

export default function SiteConfigModal({ site, onClose, onSave, mode = 'config' }: SiteConfigModalProps) {
  const [form] = Form.useForm()
  const domainPrefix = (site.primaryDomain || site.backendDomain || '').replace(/\.cg\.ink$/, '')
  const [depositCurrency, setDepositCurrency] = useState(PAY_CURRENCY_TABS[0])
  const [withdrawCurrency, setWithdrawCurrency] = useState(PAY_CURRENCY_TABS[0])
  const [venueKeys, setVenueKeys] = useState<Key[]>(VENUE_ROWS.map((r) => r.key))
  const [depositKeys, setDepositKeys] = useState<Key[]>(DEPOSIT_ROWS.map((r) => r.key))
  const [withdrawKeys, setWithdrawKeys] = useState<Key[]>(WITHDRAW_ROWS.map((r) => r.key))
  const [smsKeys, setSmsKeys] = useState<Key[]>(SMS_ROWS.map((r) => r.key))
  const [mailKeys, setMailKeys] = useState<Key[]>(MAIL_ROWS.map((r) => r.key))
  const [csKeys, setCsKeys] = useState<Key[]>(CS_ROWS.map((r) => r.key))
  const isEdit = mode === 'edit'

  const handleSave = async () => {
    await form.validateFields()
    if (!venueKeys.length) {
      message.warning('请至少选择一个场馆')
      return
    }
    onSave?.()
    message.success(
      isEdit
        ? `${site.siteName} 站点信息已保存（原型）`
        : `${site.siteName} 站点配置已保存，状态已切换为「已配置」`,
    )
    onClose()
  }

  return (
    <Modal
      title={isEdit ? '编辑' : '站点配置'}
      open
      width={1180}
      centered
      destroyOnClose
      className="site-action-modal site-config-modal"
      onCancel={onClose}
      footer={
        <div className="site-action-modal-footer">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSave}>
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
          siteMode: 'casino',
          agentMode: 'everyone',
          domainPrefix: domainPrefix || 'tb27io',
          backupDomain: site.backupDomain || '',
          ossVendor: 'aws-sv',
          skinStyle: '综合版10',
          clientSkin: site.clientSkin?.includes('紫') ? '紫金' : '皇冠棕',
          langMatchMode: 'default',
          languages: ['葡萄牙语'],
          timezone: 'UTC-3',
          currency: [site.currency || 'BRL'],
          gameType: '棋牌',
          platformName: 'WG棋牌',
          platformCurrency: [site.currency || 'BRL'],
          defaultRate: '4.00',
          adjustedRate: '4.00',
          openFee: '20000',
          deposit: site.deposit || '0.00',
          lineFee: site.lineFee || '3,000.00',
          thirdDiscount: '1',
          creditLimit: '20000',
          whitelist: 'ip',
          remark: '',
          activityTemplates: [...ACTIVITY_TEMPLATE_OPTIONS],
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
                  <div className="site-config-section-title">基础信息</div>
                  <Form.Item name="siteMode" label="站点模式" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio value="casino">娱乐城（现金网）</Radio>
                      <Radio value="club">俱乐部（信用模式）</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name="agentMode" label="代理模式" rules={[{ required: true }]}>
                    <Radio.Group options={AGENT_MODE_OPTIONS} />
                  </Form.Item>
                  <Form.Item name="domainPrefix" label="后台域名" rules={[{ required: true, message: '请输入后台域名' }]}>
                    <Input addonAfter=".cg.ink" />
                  </Form.Item>
                  <Form.Item name="backupDomain" label="备域名">
                    <Input placeholder="例：tb27io.offtb.com" />
                  </Form.Item>
                  <Form.Item name="ossVendor" label="OSS厂商" rules={[{ required: true, message: '请选择 OSS 厂商' }]}>
                    <Select options={OSS_OPTIONS} />
                  </Form.Item>

                  <div className="site-config-section-title">皮肤与语言</div>
                  <Form.Item name="skinStyle" label="皮肤版式" rules={[{ required: true, message: '请选择皮肤版式' }]}>
                    <Select options={SKIN_STYLE_OPTIONS} />
                  </Form.Item>
                  <Form.Item name="clientSkin" label="客户端皮肤" rules={[{ required: true, message: '请选择客户端皮肤' }]}>
                    <Select options={CLIENT_SKIN_OPTIONS} />
                  </Form.Item>
                  <Form.Item name="langMatchMode" label="语言匹配模式" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio value="default">系统默认</Radio>
                      <Radio value="smart">智能匹配</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name="languages" label="语言" rules={[{ required: true, message: '请选择语言' }]}>
                    <Checkbox.Group
                      options={LANG_OPTIONS.map((l) => ({ label: l, value: l }))}
                      className="site-config-lang-grid"
                    />
                  </Form.Item>
                  <Form.Item name="timezone" label="时区" rules={[{ required: true, message: '请选择时区' }]}>
                    <Select options={TZ_OPTIONS} />
                  </Form.Item>
                  <Form.Item name="currency" label="币种" rules={[{ required: true, type: 'array', min: 1, message: '请选择币种' }]}>
                    <Select mode="multiple" options={CURRENCY_OPTIONS} />
                  </Form.Item>

                  <div className="site-config-section-title">游戏平台费率</div>
                  <Form.Item name="gameType" label="游戏类型" rules={[{ required: true, message: '请选择游戏类型' }]}>
                    <Select
                      options={[
                        { value: '棋牌', label: '棋牌' },
                        { value: '电子', label: '电子' },
                        { value: '真人', label: '真人' },
                        { value: '体育', label: '体育' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="platformName" label="平台名称" rules={[{ required: true, message: '请输入平台名称' }]}>
                    <Input placeholder="例：WG棋牌" />
                  </Form.Item>
                  <Form.Item name="platformCurrency" label="平台币种" rules={[{ required: true, message: '请选择平台币种' }]}>
                    <Select mode="multiple" options={CURRENCY_OPTIONS} placeholder="请选择币种" />
                  </Form.Item>
                  <Form.Item name="defaultRate" label="默认费率(%)" rules={[{ required: true, message: '请输入默认费率' }]}>
                    <Input placeholder="例：4.00" />
                  </Form.Item>
                  <Form.Item name="adjustedRate" label="调整后价格(%)" rules={[{ required: true, message: '请输入调整后价格' }]}>
                    <Input placeholder="例：4.00" />
                  </Form.Item>

                  <div className="site-config-section-title">费用与额度</div>
                  <Form.Item name="openFee" label="开站费(U)" rules={[{ required: true, message: '请输入开站费' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="deposit" label="站点押金(U)">
                    <Input />
                  </Form.Item>
                  <Form.Item name="lineFee" label="线路维护费(U)" rules={[{ required: true, message: '请输入线路维护费' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="thirdDiscount" label="三方优惠(%)">
                    <Input />
                  </Form.Item>
                  <Form.Item name="creditLimit" label="授信额度(U)" rules={[{ required: true, message: '请输入授信额度' }]}>
                    <Input />
                  </Form.Item>

                  <div className="site-config-section-title">安全与备注</div>
                  <Form.Item name="whitelist" label="后台白名单" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio value="ip">IP白名单</Radio>
                      <Radio value="auth">授权码</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name="ipWhitelist" label="IP白名单">
                    <TextArea placeholder="多个 IP 用换行或逗号分隔" rows={3} />
                  </Form.Item>
                  <Form.Item name="remark" label="备注">
                    <TextArea placeholder="请输入备注" maxLength={200} showCount rows={3} />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'brand',
              label: 'LOGO与活动',
              children: (
                <>
                  <div className="site-config-section-title">站点 LOGO</div>
                  <div className="site-config-logo-grid">
                    {LOGO_FIELDS.map((item) => (
                      <LogoUploadItem key={item.name} name={item.name} label={item.label} />
                    ))}
                  </div>
                  <div className="site-config-section-title">活动模版</div>
                  <Form.Item
                    name="activityTemplates"
                    rules={[{ required: true, type: 'array', min: 1, message: '请至少选择一个活动模版' }]}
                  >
                    <Checkbox.Group className="site-config-activity-grid">
                      {ACTIVITY_TEMPLATE_OPTIONS.map((item) => (
                        <Checkbox key={item} value={item}>
                          {item}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'venues',
              label: '场馆授权',
              children: (
                <ConfigSelectTable
                  selectedKeys={venueKeys}
                  onChange={setVenueKeys}
                  dataSource={VENUE_ROWS}
                  scrollX={1200}
                  filters={[
                    { key: 'name', kind: 'input', placeholder: '请输入场馆名称' },
                    { key: 'code', kind: 'input', placeholder: '请输入场馆代码' },
                    { key: 'type', kind: 'select', placeholder: '请选择场馆类型', options: VENUE_TYPE_OPTIONS },
                    { key: 'status', kind: 'select', placeholder: '请选择状态', options: STATUS_OPTIONS },
                  ]}
                  matchRow={(row, values) => {
                    if (values.name && !row.venueName.includes(values.name)) return false
                    if (values.code && !row.venueCode.includes(values.code)) return false
                    if (values.type && row.venueType !== values.type) return false
                    if (values.status && row.status !== values.status) return false
                    return true
                  }}
                  columns={[
                    { title: '场馆ID', dataIndex: 'venueId', width: 160 },
                    { title: '场馆名称', dataIndex: 'venueName', width: 120 },
                    { title: '场馆类型', dataIndex: 'venueType', width: 90 },
                    { title: '接入类型', dataIndex: 'accessType', width: 90 },
                    { title: '场馆代码', dataIndex: 'venueCode', width: 90 },
                    { title: '授权游戏数', dataIndex: 'authGames', width: 100 },
                    { title: '负盈利费率', dataIndex: 'negRate', width: 100 },
                    { title: '有效流水费率', dataIndex: 'turnoverRate', width: 120 },
                    { title: '状态', dataIndex: 'status', width: 80 },
                    { title: '操作时间', dataIndex: 'operateTime', width: 160 },
                    { title: '操作人', dataIndex: 'operator', width: 120 },
                    {
                      title: '操作',
                      key: 'action',
                      fixed: 'right',
                      width: 200,
                      render: () => (
                        <div className="site-config-row-actions">
                          <Button type="link" size="small">
                            设置手续费
                          </Button>
                          <Button type="link" size="small" className="site-config-link-green">
                            游戏授权
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              key: 'deposit',
              label: '存款通道',
              children: (
                <>
                  <div className="site-config-currency-tabs">
                    {PAY_CURRENCY_TABS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={depositCurrency === c ? 'active' : ''}
                        onClick={() => setDepositCurrency(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <ConfigSelectTable
                    selectedKeys={depositKeys}
                    onChange={setDepositKeys}
                    dataSource={DEPOSIT_ROWS}
                    scrollX={1200}
                    filters={[
                      {
                        key: 'category',
                        kind: 'select',
                        placeholder: '请选择分类',
                        options: [
                          { value: '体育', label: '体育' },
                          { value: '电子', label: '电子' },
                          { value: '真人', label: '真人' },
                        ],
                      },
                      {
                        key: 'method',
                        kind: 'select',
                        placeholder: '请选择存款方式',
                        options: [{ value: '扫码支付', label: '扫码支付' }],
                      },
                      { key: 'status', kind: 'select', placeholder: '请选择状态', options: STATUS_OPTIONS },
                    ]}
                    matchRow={(row, values) => {
                      if (values.method && row.depositMethod !== values.method) return false
                      if (values.status && row.status !== values.status) return false
                      return true
                    }}
                    columns={[
                      { title: '存款类型', dataIndex: 'depositType', width: 110 },
                      { title: '存款方式', dataIndex: 'depositMethod', width: 110 },
                      { title: '百分比手续费', dataIndex: 'percentFee', width: 120 },
                      { title: '单笔固定金额手续费', dataIndex: 'fixedFee', width: 150 },
                      {
                        title: '图标',
                        dataIndex: 'icon',
                        width: 70,
                        render: () => <PayIcon />,
                      },
                      { title: '备注', dataIndex: 'remark', width: 140 },
                      { title: '状态', dataIndex: 'status', width: 80 },
                      { title: '操作时间', dataIndex: 'operateTime', width: 160 },
                      { title: '操作人', dataIndex: 'operator', width: 120 },
                      {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 200,
                        render: () => (
                          <div className="site-config-row-actions">
                            <Button type="link" size="small">
                              设置手续费
                            </Button>
                            <Button type="link" size="small" className="site-config-link-green">
                              通道授权
                            </Button>
                          </div>
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },
            {
              key: 'withdraw',
              label: '提款通道',
              children: (
                <>
                  <div className="site-config-currency-tabs">
                    {PAY_CURRENCY_TABS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={withdrawCurrency === c ? 'active' : ''}
                        onClick={() => setWithdrawCurrency(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <ConfigSelectTable
                    selectedKeys={withdrawKeys}
                    onChange={setWithdrawKeys}
                    dataSource={WITHDRAW_ROWS}
                    scrollX={1200}
                    filters={[
                      {
                        key: 'type',
                        kind: 'select',
                        placeholder: '请选择提款类型',
                        options: [{ value: '电子钱包', label: '电子钱包' }],
                      },
                      {
                        key: 'method',
                        kind: 'select',
                        placeholder: '请选择提款方式',
                        options: [{ value: '扫码支付', label: '扫码支付' }],
                      },
                      { key: 'status', kind: 'select', placeholder: '请选择状态', options: STATUS_OPTIONS },
                    ]}
                    matchRow={(row, values) => {
                      if (values.type && row.withdrawType !== values.type) return false
                      if (values.method && row.withdrawMethod !== values.method) return false
                      if (values.status && row.status !== values.status) return false
                      return true
                    }}
                    columns={[
                      { title: '提款类型', dataIndex: 'withdrawType', width: 110 },
                      { title: '提款方式', dataIndex: 'withdrawMethod', width: 110 },
                      { title: '百分比手续费', dataIndex: 'percentFee', width: 120 },
                      { title: '单笔固定金额手续费', dataIndex: 'fixedFee', width: 150 },
                      {
                        title: '图标',
                        dataIndex: 'icon',
                        width: 70,
                        render: () => <PayIcon />,
                      },
                      { title: '备注', dataIndex: 'remark', width: 140 },
                      { title: '状态', dataIndex: 'status', width: 80 },
                      { title: '操作时间', dataIndex: 'operateTime', width: 160 },
                      { title: '操作人', dataIndex: 'operator', width: 120 },
                      {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 200,
                        render: () => (
                          <div className="site-config-row-actions">
                            <Button type="link" size="small">
                              设置手续费
                            </Button>
                            <Button type="link" size="small" className="site-config-link-green">
                              通道授权
                            </Button>
                          </div>
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },
            {
              key: 'sms',
              label: '短信通道',
              children: (
                <ConfigSelectTable
                  selectedKeys={smsKeys}
                  onChange={setSmsKeys}
                  dataSource={SMS_ROWS}
                  scrollX={1200}
                  filters={[
                    {
                      key: 'region',
                      kind: 'select',
                      placeholder: '请选择使用区域',
                      options: [
                        { value: '越南', label: '越南' },
                        { value: '巴西', label: '巴西' },
                        { value: '中国', label: '中国' },
                      ],
                    },
                    { key: 'name', kind: 'input', placeholder: '请输入通道名称' },
                    { key: 'code', kind: 'input', placeholder: '请输入通道代码' },
                  ]}
                  matchRow={(row, values) => {
                    if (values.region && row.region !== values.region) return false
                    if (values.name && !row.channelName.includes(values.name)) return false
                    if (values.code && !row.channelCode.includes(values.code)) return false
                    return true
                  }}
                  columns={[
                    { title: '使用地区', dataIndex: 'region', width: 90 },
                    { title: '区号', dataIndex: 'areaCode', width: 70 },
                    { title: '通道ID', dataIndex: 'channelId', width: 90 },
                    { title: '通道名称', dataIndex: 'channelName', width: 110 },
                    { title: '通道代码', dataIndex: 'channelCode', width: 100 },
                    { title: '备注', dataIndex: 'remark', width: 140 },
                    { title: '状态', dataIndex: 'status', width: 80 },
                    { title: '操作时间', dataIndex: 'operateTime', width: 160 },
                    { title: '操作人', dataIndex: 'operator', width: 120 },
                  ]}
                />
              ),
            },
            {
              key: 'mail',
              label: '邮件通道',
              children: (
                <ConfigSelectTable
                  selectedKeys={mailKeys}
                  onChange={setMailKeys}
                  dataSource={MAIL_ROWS}
                  scrollX={1000}
                  filters={[
                    { key: 'name', kind: 'input', placeholder: '请输入通道名称' },
                    { key: 'code', kind: 'input', placeholder: '请输入通道代码' },
                    { key: 'status', kind: 'select', placeholder: '请选择状态', options: STATUS_OPTIONS },
                  ]}
                  matchRow={(row, values) => {
                    if (values.name && !row.channelName.includes(values.name)) return false
                    if (values.code && !row.channelCode.includes(values.code)) return false
                    if (values.status && row.status !== values.status) return false
                    return true
                  }}
                  columns={[
                    { title: '通道名称', dataIndex: 'channelName', width: 120 },
                    { title: '通道代码', dataIndex: 'channelCode', width: 100 },
                    { title: '通道地址', dataIndex: 'channelAddress', width: 120 },
                    { title: '状态', dataIndex: 'status', width: 80 },
                    { title: '操作时间', dataIndex: 'operateTime', width: 160 },
                    { title: '操作人', dataIndex: 'operator', width: 120 },
                  ]}
                />
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
                  scrollX={1300}
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
                    {
                      title: '通道地址',
                      dataIndex: 'channelAddress',
                      width: 280,
                      ellipsis: true,
                    },
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
