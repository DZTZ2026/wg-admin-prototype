import { QuestionCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Checkbox, Form, Input, Modal, Radio, Select, Tooltip, message } from 'antd'

const { TextArea } = Input

const COMPANY_OPTIONS = [
  { value: 'none', label: '无' },
  { value: '1179', label: '伯乐(1179)' },
  { value: '1001', label: '测试公司(1001)' },
]

const OWNER_OPTIONS = [
  { value: 'bole888', label: 'bole888' },
  { value: 'bole', label: 'bole' },
  { value: 'tempo', label: 'tempo' },
]

const SKIN_STYLE_OPTIONS = [
  { value: '综合版10', label: '综合版10' },
  { value: '综合版11', label: '综合版11' },
  { value: '综合版13', label: '综合版13' },
  { value: '电子版1', label: '电子版1' },
  { value: '体育版1', label: '体育版1' },
  { value: '体育版2', label: '体育版2' },
  { value: '体育版3', label: '体育版3' },
  { value: 'U版2', label: 'U版2' },
  { value: 'U版3', label: 'U版3' },
  { value: 'U版4', label: 'U版4' },
  { value: '真人版1', label: '真人版1' },
  { value: '真人版2', label: '真人版2' },
  { value: '俱乐部版1', label: '俱乐部版1' },
  { value: '俱乐部版2', label: '俱乐部版2' },
  { value: '青蓝版', label: '青蓝版' },
]

const CLIENT_SKIN_OPTIONS = [
  { value: '皇冠棕', label: '皇冠棕' },
  { value: '紫金', label: '紫金' },
  { value: '锈红色底', label: '锈红色底' },
  { value: '咖啡色底', label: '咖啡色底' },
  { value: '宝蓝色底', label: '宝蓝色底' },
  { value: '油青绿底', label: '油青绿底' },
  { value: '墨蓝色底', label: '墨蓝色底' },
  { value: '翠绿底', label: '翠绿底' },
  { value: '薄荷绿底', label: '薄荷绿底' },
  { value: '陶土色底', label: '陶土色底' },
  { value: '叶绿色底', label: '叶绿色底' },
  { value: '红紫底', label: '红紫底' },
  { value: '湛蓝底', label: '湛蓝底' },
  { value: '蔚蓝底', label: '蔚蓝底' },
  { value: '藏青色底', label: '藏青色底' },
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
  { value: 'USDC', label: 'USDC' },
  { value: 'TRX', label: 'TRX' },
  { value: 'NGN', label: '尼日利亚(NGN)' },
  { value: 'PYG', label: '巴拉圭(PYG1000:1)' },
]

const ALL_CURRENCY_VALUES = CURRENCY_OPTIONS.map((item) => item.value)

const LANG_OPTIONS = [
  '简体中文',
  '英文',
  '泰语',
  '越南语',
  '印度尼西亚语',
  '印地语',
  '韩语',
  '日语',
  '葡萄牙语',
  '西班牙语',
  '德语',
  '法语',
  '意大利语',
  '俄语',
  '繁体中文',
  '缅甸语',
  '阿拉伯语',
  '菲律宾语',
  '高棉语',
  '泰卢固语',
  '泰米尔语',
  '马拉地语',
  '卡纳达语',
  '土耳其语',
  '孟加拉语',
  '旁遮普语',
  '乌尔都语',
  '南非荷兰语',
  '斯瓦希里语',
  '阿姆哈拉语',
  '尼日利亚语',
  '僧加罗语',
  '普什图语',
  '尼泊尔语',
]

const AUTH_CODE_LENGTH = 9

const AUTH_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function createAuthCode() {
  let code = ''
  for (let i = 0; i < AUTH_CODE_LENGTH; i += 1) {
    code += AUTH_CODE_CHARS[Math.floor(Math.random() * AUTH_CODE_CHARS.length)]
  }
  return code
}

const AGENT_MODE_OPTIONS = [
  { value: 'everyone', label: '只开启人人皆可代理' },
  { value: 'professional', label: '只开启专业代理(全部线下或区域代理)' },
  { value: 'both', label: '人人和专业代理共存(通过网址或渠道来源区分)' },
]

const AUTH_EXTENSION_URL =
  'https://chromewebstore.google.com/detail/accelerator/cdilgeemeghjhbngefgnokgbfgknjpip?authuser=0&hl=zh-CN'

const COPY_SITE_TIPS = (
  <div className="add-site-copy-tips">
    <div className="add-site-copy-tips-title">复制配置包含:</div>
    <ol>
      <li>
        运营管理：下载站模板、品牌设置-关于我们、Web 页脚配置、（改了皮肤版式则不复制）首页版式、节日主题、消息管理（仅一键删除、一键已读、跑马灯时间开关支持复制；定制版式不支持复制站点，仅通用版式支持复制）
      </li>
      <li>游戏管理：游戏管理配置</li>
      <li>
        会员管理：层级设置、会员标签、VIP等级、注册和验证-注册配置、安全中心配置、会员基本信息、防刷风控、大R提醒设置
      </li>
      <li>代理管理：代理模式(返佣设置)、俱乐部配置、代理设置、佣金管理</li>
      <li>
        活动中心（包括竞猜活动赛程）、任务中心、实时返水、利息宝、VIP奖励、派发与审核-派发限额、领取设置、公积金、盲盒抽奖、幸运转盘、信用借款
      </li>
      <li>
        全部充值-充值设置、充值补单-审核设置、在线充值-大类配置、转账充值-转账审核设置、客服代充-代充审核设置、提现管理-提现设置、投注任务(稽核)、充值任务、提现任务、担保理赔、人工拉回修正-审核设置、汇率和银行管理（新增：三方通道
        可选，只复制通道不包含key的数据）
      </li>
      <li>风控管理：刷子监控-默认自动规则</li>
      <li>系统管理：账号权限-权限角色、IP白名单、站点管理-站点信息、非经营地访问限制</li>
      <li>站点管理-费率调整-优惠比例</li>
    </ol>
  </div>
)

const SECURITY_CODE_TIPS = (
  <div className="add-site-security-tips">
    <p>
      <strong>1. 联系方式加密原理</strong>
      <br />
      为了保障站点联系人的信息安全，系统会对联系方式进行加密存储，加密后的密文为 128 位，无法直接查看。
    </p>
    <p>
      <strong>2. 什么是安全码？</strong>
      <br />
      安全码是用于解密联系人信息的密钥，群发消息等场景需要使用安全码才能查看联系人信息，不同安全码解密结果不同。
    </p>
    <p>
      <strong>3. 如何找回安全码？</strong>
      <br />
      安全码无法通过系统找回。如遗失，需联系集团负责人及公司走人工流程，耗时较长，请务必妥善保管。
    </p>
  </div>
)

interface AddSiteModalProps {
  open: boolean
  onClose: () => void
  variant?: 'merchant' | 'master'
}

export default function AddSiteModal({ open, onClose, variant = 'merchant' }: AddSiteModalProps) {
  const isMaster = variant === 'master'
  const [form] = Form.useForm()
  const selectedLangs = Form.useWatch('languages', form) || []
  const selectedCurrencies: string[] = Form.useWatch('currency', form) || []
  const whitelistType = Form.useWatch('whitelist', form) || 'ip'
  const authCodeInfo = Form.useWatch('authCodeInfo', form)
  const allChecked = selectedLangs.length === LANG_OPTIONS.length
  const indeterminate = selectedLangs.length > 0 && selectedLangs.length < LANG_OPTIONS.length
  const allCurrencyChecked =
    ALL_CURRENCY_VALUES.length > 0 && ALL_CURRENCY_VALUES.every((v) => selectedCurrencies.includes(v))
  const currencyIndeterminate = selectedCurrencies.length > 0 && !allCurrencyChecked

  const normalizeCurrencyValues = (values: string[] = []) => {
    if (values.includes('__all__')) {
      return allCurrencyChecked ? [] : [...ALL_CURRENCY_VALUES]
    }
    return values.filter((v) => v !== '__all__')
  }

  const handleGenerateAuthCode = () => {
    form.setFieldValue('authCodeInfo', createAuthCode())
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleOk = async () => {
    try {
      await form.validateFields()
      message.success(isMaster ? '开站已创建，进入创建中（原型）' : '站点已创建，进入创建中（原型）')
      handleClose()
    } catch {
      // validation failed
    }
  }

  return (
    <Modal
      title={isMaster ? '新增开站' : '新增站点'}
      open={open}
      width={720}
      centered
      destroyOnClose
      className="add-site-modal"
      onCancel={handleClose}
      footer={
        <div className="add-site-modal-footer">
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleOk}>
            确认
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ style: { width: 140, flex: '0 0 140px' } }}
        wrapperCol={{ style: { flex: '1 1 0', minWidth: 0 } }}
        labelAlign="right"
        colon={false}
        className="add-site-form"
        initialValues={{
          copySite: 'no',
          siteMode: 'casino',
          agentMode: 'everyone',
          whitelist: 'ip',
          langMatchMode: 'default',
          creditMode: 'auto',
          autoCreditDefault: '20000',
          backendDomain: '801dye',
          languages: [],
          currency: [],
        }}
      >
        <Form.Item name="company" label="所属集团" rules={[{ required: true, message: '请选择所属集团' }]}>
          <Select placeholder="请选择所属集团" options={COMPANY_OPTIONS} />
        </Form.Item>

        {isMaster ? (
          <>
            <Form.Item name="siteId" label="站点ID">
              <Input placeholder="留空则系统自动分配" />
            </Form.Item>
            <Form.Item name="ossVendor" label="OSS厂商" rules={[{ required: true, message: '请选择 OSS 厂商' }]}>
              <Select
                placeholder="请选择 OSS 厂商"
                options={[
                  { value: 'aws-sv', label: 'AWS S3-美国硅谷' },
                  { value: 'aws-oregon', label: 'AWS S3-美国俄勒冈' },
                  { value: 'aliyun-hk', label: '阿里云-香港' },
                ]}
              />
            </Form.Item>
            <Form.Item name="backupDomain" label="备域名">
              <Input placeholder="例：tb27io.offtb.com" />
            </Form.Item>
            <Form.Item name="assignBusiness" label="对接商务" rules={[{ required: true, message: '请选择对接商务' }]}>
              <Select
                placeholder="请选择对接商务"
                options={[
                  { value: 'tempo', label: 'tempo' },
                  { value: 'cooper', label: 'cooper' },
                ]}
              />
            </Form.Item>
          </>
        ) : null}

        <Form.Item name="copySite" label="是否复制站点" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="no">不复制</Radio>
            <Radio value="yes">
              复制站点
              <Tooltip
                title={COPY_SITE_TIPS}
                overlayClassName="add-site-copy-tooltip"
                placement="topLeft"
                color="#fff"
              >
                <QuestionCircleOutlined
                  className="add-site-help-icon"
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="siteName" label="站点名称" rules={[{ required: true, message: '请输入站点名称' }]}>
          <Input placeholder="20 个字符,中英文皆可" maxLength={20} />
        </Form.Item>

        <Form.Item name="siteMode" label="站点模式">
          <Radio.Group>
            <Radio value="casino">娱乐城（现金网）</Radio>
            <Radio value="club">俱乐部（信用模式）</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="agentMode" label="代理方式">
          <Radio.Group className="add-site-agent-mode" options={AGENT_MODE_OPTIONS} />
        </Form.Item>

        <Form.Item name="owner" label="站点持有人" rules={[{ required: true, message: '请选择站点持有人' }]}>
          <Select placeholder="请选择站点持有人" options={OWNER_OPTIONS} />
        </Form.Item>

        <Form.Item name="securityCode" label="站点安全码" rules={[{ required: true, message: '请输入站点安全码' }]}>
          <Input.Password placeholder="请输入站点安全码" visibilityToggle />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0 }} colon={false} label=" ">
          <Alert type="warning" showIcon message={SECURITY_CODE_TIPS} className="add-site-security-alert" />
        </Form.Item>

        <Form.Item
          name="confirmSecurityCode"
          label="确认站点安全码"
          dependencies={['securityCode']}
          rules={[
            { required: true, message: '请再次输入站点安全码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('securityCode') === value) return Promise.resolve()
                return Promise.reject(new Error('两次输入的安全码不一致'))
              },
            }),
          ]}
        >
          <Input.Password placeholder="请输入站点安全码" visibilityToggle />
        </Form.Item>

        <Form.Item name="backendDomain" label="后台域名" rules={[{ required: true, message: '请输入后台域名' }]}>
          <Input addonAfter=".cg.ink" placeholder="请输入后台域名" />
        </Form.Item>

        <Form.Item name="whitelist" label="后台白名单" className="add-site-whitelist-item">
          <Radio.Group>
            <Radio value="ip">IP白名单</Radio>
            <Radio value="auth">授权码</Radio>
          </Radio.Group>
        </Form.Item>

        {whitelistType === 'ip' ? (
          <Form.Item
            name="ipWhitelist"
            label=" "
            colon={false}
            className="add-site-follow-item"
            rules={[{ required: true, message: '请输入后台IP白名单' }]}
          >
            <TextArea placeholder="请输入后台IP白名单" rows={4} />
          </Form.Item>
        ) : null}

        {whitelistType === 'auth' ? (
          <Form.Item label=" " colon={false} className="add-site-follow-item add-site-auth-follow-item">
            <div className="add-site-auth-panel">
              <div className="add-site-auth-row">
                <span className="add-site-auth-label">授权码信息</span>
                <Button type="primary" className="add-site-auth-generate-btn" onClick={handleGenerateAuthCode}>
                  生成
                </Button>
              </div>
              {authCodeInfo ? (
                <div className="add-site-auth-result">
                  <div className="add-site-auth-desc">
                    加速器地址（用于代替IP白名单），请安装 Chrome 浏览器插件「加速器」，插件下载地址：
                    <a href={AUTH_EXTENSION_URL} target="_blank" rel="noreferrer">
                      {AUTH_EXTENSION_URL}
                    </a>
                  </div>
                  <div className="add-site-auth-code-block">
                    <div className="add-site-auth-code-label">加速器授权码（有效期30天）：</div>
                    <div className="add-site-auth-code-field">
                      <span className="add-site-auth-code-prefix">bm-</span>
                      <span className="add-site-auth-code-value">{authCodeInfo}</span>
                      <span className="add-site-auth-code-count">
                        {authCodeInfo.length}/{AUTH_CODE_LENGTH}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
              <Form.Item name="authCodeInfo" hidden rules={[{ required: true, message: '请生成授权码' }]}>
                <Input />
              </Form.Item>
            </div>
          </Form.Item>
        ) : null}

        <Form.Item name="skinStyle" label="皮肤版式" rules={[{ required: true, message: '请选择皮肤版式' }]}>
          <Select placeholder="请选择皮肤版式" options={SKIN_STYLE_OPTIONS} />
        </Form.Item>

        <Form.Item name="clientSkin" label="客户端皮肤" rules={[{ required: true, message: '请选择客户端皮肤' }]}>
          <Select placeholder="请选择客户端皮肤" options={CLIENT_SKIN_OPTIONS} />
        </Form.Item>

        <Form.Item name="langMatchMode" label="客户端语言匹配模式" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="default">
              系统默认
              <Tooltip
                title="客户端根据后台选择的默认语言展示，用户切换后展示切换的语言"
                overlayClassName="add-site-light-tooltip"
                color="#fff"
              >
                <QuestionCircleOutlined
                  className="add-site-help-icon"
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </Radio>
            <Radio value="smart">
              智能匹配
              <Tooltip
                title="客户端根据：系统语言 > 站点默认语言的优先级展示，支持则跟随对应语言展示，用户切换后展示切换的语言"
                overlayClassName="add-site-light-tooltip"
                color="#fff"
              >
                <QuestionCircleOutlined
                  className="add-site-help-icon"
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="语言"
          required
          className="add-site-lang-item"
        >
          <div className="add-site-lang-all">
            <Checkbox
              indeterminate={indeterminate}
              checked={allChecked}
              onChange={(e) => form.setFieldValue('languages', e.target.checked ? [...LANG_OPTIONS] : [])}
            >
              全选
            </Checkbox>
          </div>
          <Form.Item name="languages" noStyle rules={[{ required: true, type: 'array', min: 1, message: '请至少选择一种语言' }]}>
            <Checkbox.Group className="add-site-lang-group">
              <div className="add-site-lang-grid">
                {LANG_OPTIONS.map((lang) => (
                  <Checkbox key={lang} value={lang}>
                    {lang}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="currency"
          label="币种"
          rules={[{ required: true, type: 'array', min: 1, message: '请选择币种' }]}
          getValueFromEvent={normalizeCurrencyValues}
        >
          <Select
            mode="multiple"
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择币种"
            maxTagCount="responsive"
            menuItemSelectedIcon={null}
            popupClassName="add-site-currency-dropdown"
            options={[{ value: '__all__', label: '全部' }, ...CURRENCY_OPTIONS]}
            optionRender={(option) => {
              const value = String(option.value)
              const checked = value === '__all__' ? allCurrencyChecked : selectedCurrencies.includes(value)
              return (
                <div className="add-site-currency-option">
                  <Checkbox
                    checked={checked}
                    indeterminate={value === '__all__' ? currencyIndeterminate : false}
                  />
                  <span>{option.label}</span>
                </div>
              )
            }}
          />
        </Form.Item>

        <Form.Item name="timezone" label="时区" rules={[{ required: true, message: '请选择时区' }]}>
          <Select placeholder="请选择时区" showSearch optionFilterProp="label" options={TZ_OPTIONS} />
        </Form.Item>

        <Form.Item label="站点收费标准" className="add-site-fee-label">
          <div className="add-site-fee-panel">
            <div className="add-site-fee-row">
              <span>开站费(U)</span>
              <span>20,000.00</span>
            </div>
            <div className="add-site-fee-row">
              <span>站点押金(U)</span>
              <span>0.00</span>
            </div>
            <div className="add-site-fee-row">
              <span>线路维护费(U)</span>
              <span>3,000.00</span>
            </div>
          </div>
        </Form.Item>

        <Form.Item name="creditMode" label="授信额度(U)" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="auto">自动额度（默认）</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="autoCreditDefault"
          label="自动额度首月默认值"
          rules={[{ required: true, message: '请输入自动额度首月默认值' }]}
        >
          <Input readOnly className="add-site-readonly-input" />
        </Form.Item>

        <Form.Item name="remark" label="备注">
          <TextArea placeholder="请输入备注" maxLength={200} showCount rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
