import { Form, InputNumber, Modal, Radio, Switch, message } from 'antd'

export function ChannelAddModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  return (
    <Modal
      title="新增"
      open={open}
      width={720}
      onCancel={onClose}
      onOk={async () => {
        await form.validateFields()
        message.success('渠道已创建（原型）')
        onClose()
        form.resetFields()
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          phone: 'follow',
          email: 'follow',
          area: 'off',
          track: 'off',
          downloadEntry: 'show',
          tip: 'on',
          content: 'pwa',
          force: 'no',
          days: 0,
          rechargeCnt: 0,
          withdrawCnt: 0,
          ingame: 'no',
          extra: 'off',
        }}
      >
        <Form.Item name="phone" label="手机号是否强制验证" rules={[{ required: true }]}>
          <Radio.Group
            options={[
              { value: 'follow', label: '跟随安全中心配置' },
              { value: 'force', label: '强制校验' },
            ]}
          />
        </Form.Item>
        <Form.Item name="email" label="邮箱是否强制验证" rules={[{ required: true }]}>
          <Radio.Group
            options={[
              { value: 'follow', label: '跟随安全中心配置' },
              { value: 'force', label: '强制校验' },
            ]}
          />
        </Form.Item>
        <Form.Item name="area" label="投放地区限制">
          <Radio.Group options={[{ value: 'off', label: '关闭' }, { value: 'on', label: '开启' }]} />
        </Form.Item>
        <Form.Item name="track" label="是否配置埋点">
          <Radio.Group options={[{ value: 'off', label: '关闭' }, { value: 'on', label: '开启' }]} />
        </Form.Item>
        <Form.Item name="downloadEntry" label="页面所有下载入口">
          <Radio.Group
            options={[
              { value: 'show', label: '展示' },
              { value: 'hide', label: '全部隐藏(部分广告商风控限制时启用)' },
            ]}
          />
        </Form.Item>
        <Form.Item name="tip" label="展示APP下载提示">
          <Radio.Group options={[{ value: 'on', label: '开启' }, { value: 'off', label: '关闭' }]} />
        </Form.Item>
        <Form.Item name="content" label="展示下载内容">
          <Radio.Group
            options={[
              { value: 'pwa', label: 'PWA快捷APP(可自动登录, 推荐)' },
              { value: 'fast', label: '极速APP' },
              { value: 'native', label: '原生APP' },
            ]}
          />
        </Form.Item>
        <Form.Item name="force" label="是否强制下载">
          <Radio.Group
            options={[
              { value: 'no', label: '不强制(可关闭)' },
              { value: 'force_h5', label: '强制下载但仍可使用网页H5' },
              { value: 'force_pwa', label: '强制下载且强制引导只能用PWA快捷APP(不能用网页H5)' },
            ]}
          />
        </Form.Item>
        <Form.Item name="days" label="会员注册天数 ≥" rules={[{ required: true }]}>
          <InputNumber min={0} addonAfter="天, 提示下载弹窗" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="rechargeCnt" label="会员充值次数" rules={[{ required: true }]}>
          <InputNumber min={0} addonAfter="次, 提示下载弹窗" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="withdrawCnt" label="会员提现次数" rules={[{ required: true }]}>
          <InputNumber min={0} addonAfter="次, 提示下载弹窗" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="ingame" label="是否在游戏内增加弹窗提示">
          <Radio.Group
            options={[
              { value: 'no', label: '不增加弹窗' },
              { value: 'yes', label: '增加弹窗(影响用户体验)' },
            ]}
          />
        </Form.Item>
        <Form.Item name="extra" label="下载额外记录">
          <Radio.Group options={[{ value: 'off', label: '关闭' }, { value: 'on', label: '开启' }]} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export function NetProfitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  return (
    <Modal
      title="净盈利设置"
      open={open}
      width={680}
      onCancel={onClose}
      onOk={async () => {
        await form.validateFields()
        message.success('净盈利设置已保存（原型）')
        onClose()
      }}
      destroyOnClose
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        initialValues={{
          currency: 'VND',
          allReward: false,
          prevBalance: false,
          gameCost: 10,
          depositRate: 0,
          depositMin: 0,
          withdrawRate: 0,
          withdrawMin: 0,
        }}
      >
        <Form.Item label="币种">VND</Form.Item>
        <Form.Item name="allReward" label="是否计算所有奖励" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="prevBalance" label="是否计算上期结余" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="gameCost" label="三方游戏统一成本">
          <InputNumber min={0} addonAfter="%" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="depositRate" label="充值费率">
          <InputNumber min={0} addonAfter="%" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="depositMin" label="充值单笔最低收取">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="withdrawRate" label="提现费率">
          <InputNumber min={0} addonAfter="%" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="withdrawMin" label="提现单笔最低收取">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
      <div
        style={{
          background: '#fafafa',
          border: '1px solid #f0f0f0',
          borderRadius: 4,
          padding: 12,
          fontSize: 12,
          color: '#595959',
          lineHeight: 1.7,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6 }}>净盈利排除平台运营成本说明</div>
        <div>1. 净盈利 = -(会员总输赢) - (所有奖励) - (三方游戏统一成本) - (充提手续费) - (上期结余)</div>
        <div>2. 所有奖励：包含全部优惠活动奖励</div>
        <div>3. 上期结余：上一结算周期上级直属会员产生的净盈利（累计亏损）</div>
        <div>4. 关闭“计算奖励/上期结余”开关后，不参与公式计算</div>
        <div>5. 成本/费率/最低收取可设为 0，表示不计算该项</div>
        <div>6. 充值费率适用于全部充值通道服务费</div>
        <div>7. 费率与单笔最低收取取较大值计入</div>
      </div>
    </Modal>
  )
}

export function RechargeSettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  return (
    <Modal
      title="充值设置"
      open={open}
      width={760}
      onCancel={onClose}
      onOk={() => {
        message.success('充值设置已保存（原型）')
        onClose()
      }}
      destroyOnClose
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        initialValues={{
          showPromo: 'show',
          promoRule: 'ladder',
          promoStyle: 'tile',
          promoPos: 'below',
          detailPromo: 'show',
          tip: 'on',
          btn: 'tile',
          scroll: 'float',
          highlight: 'after',
          notify: 'top',
          page: 'modal',
          layout: 'single',
          channelNotify: 'off',
          order: 'channel_first',
          defaultOpt: 'recommend',
        }}
      >
        <Form.Item name="showPromo" label="充值页面展示优惠">
          <Radio.Group
            options={[
              { value: 'show', label: '展示' },
              { value: 'hide_all', label: '隐藏全部' },
              { value: 'hide_panel', label: '仅隐藏优惠面板' },
            ]}
          />
        </Form.Item>
        <Form.Item name="promoRule" label="充值优惠展示规则">
          <Radio.Group options={[{ value: 'activity', label: '按活动' }, { value: 'ladder', label: '阶梯' }]} />
        </Form.Item>
        <Form.Item name="promoStyle" label="充值优惠选项样式">
          <Radio.Group
            options={[
              { value: 'menu', label: '菜单栏' },
              { value: 'mini', label: '迷你下拉' },
              { value: 'tile', label: '平铺' },
              { value: 'float', label: '底部浮窗' },
            ]}
          />
        </Form.Item>
        <Form.Item name="promoPos" label="优惠面板显示位置">
          <Radio.Group
            options={[
              { value: 'below', label: '金额输入框下方' },
              { value: 'above', label: '金额输入框上方' },
            ]}
          />
        </Form.Item>
        <Form.Item name="detailPromo" label="充值详情页展示优惠">
          <Radio.Group options={[{ value: 'show', label: '展示' }, { value: 'hide', label: '隐藏' }]} />
        </Form.Item>
        <Form.Item name="tip" label="充值信息提示开关">
          <Radio.Group options={[{ value: 'on', label: '开启' }, { value: 'off', label: '关闭' }]} />
        </Form.Item>
        <Form.Item name="btn" label="充值按钮展示">
          <Radio.Group options={[{ value: 'sticky', label: '吸底展示' }, { value: 'tile', label: '平铺展示' }]} />
        </Form.Item>
        <Form.Item name="scroll" label="一键滚动底部按钮">
          <Radio.Group
            options={[
              { value: 'float', label: '显示浮动按钮' },
              { value: 'hide', label: '隐藏悬浮按钮' },
            ]}
          />
        </Form.Item>
        <Form.Item name="highlight" label="充值按钮高亮状态">
          <Radio.Group
            options={[
              { value: 'after', label: '输入金额后高亮' },
              { value: 'always', label: '始终点亮' },
            ]}
          />
        </Form.Item>
        <Form.Item name="notify" label="充值通知弹窗样式">
          <Radio.Group
            options={[
              { value: 'top', label: '顶部悬浮窗(5秒自动消失)' },
              { value: 'modal', label: '弹窗(需手动关闭)' },
            ]}
          />
        </Form.Item>
        <Form.Item name="page" label="充值页展示">
          <Radio.Group options={[{ value: 'modal', label: '浮动弹窗' }, { value: 'full', label: '全屏页面' }]} />
        </Form.Item>
        <Form.Item name="layout" label="大类通道布局">
          <Radio.Group
            options={[
              { value: 'single', label: '单行横板布局' },
              { value: 'double', label: '双行竖版布局' },
            ]}
          />
        </Form.Item>
        <Form.Item name="channelNotify" label="充值通道更新通知">
          <Radio.Group options={[{ value: 'on', label: '开启' }, { value: 'off', label: '关闭' }]} />
        </Form.Item>
        <Form.Item name="order" label="充值页面设置">
          <Radio.Group
            options={[
              { value: 'amount_first', label: '先填金额后选通道(推荐)' },
              { value: 'channel_first', label: '先选通道后填金额' },
            ]}
          />
        </Form.Item>
        <Form.Item name="defaultOpt" label="充值默认选项">
          <Radio.Group
            options={[
              { value: 'last', label: '上次充值通道' },
              { value: 'recommend', label: '第一个推荐' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
