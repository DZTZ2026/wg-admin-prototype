import { useState, type ReactNode } from 'react'
import { Checkbox, Tabs } from 'antd'
import type { SiteActionSite } from '../SiteActionModals'
import ConfigSelectTable from './ConfigSelectTable'
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
} from './configMock'

const LOGO_LABELS = [
  '长LOGO (黑夜)',
  '短LOGO (黑夜)',
  '长LOGO (白天)',
  '短LOGO (白天)',
]

const PayIcon = () => <span className="site-config-pay-icon">支</span>

function ReadRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="site-config-readonly-row">
      <span className="site-config-readonly-label">{label}</span>
      <span className="site-config-readonly-value">{value || '-'}</span>
    </div>
  )
}

interface SiteConfigReadonlyViewProps {
  site: SiteActionSite
  /** 额外塞在第一个 Tab 前面的「基本信息」内容 */
  summary?: ReactNode
  /** 是否展示开站配置相关 Tab（已配置及之后状态） */
  showConfigTabs?: boolean
}

/** 创建中 / 待付款 / 配置中（未点保存为已配置）仅展示基本信息 */
export function hasCompletedSiteConfig(openStatus?: string) {
  return Boolean(openStatus) && !['创建中', '配置中', '待付款'].includes(openStatus!)
}

export default function SiteConfigReadonlyView({
  site,
  summary,
  showConfigTabs = true,
}: SiteConfigReadonlyViewProps) {
  const [depositCurrency, setDepositCurrency] = useState(PAY_CURRENCY_TABS[0])
  const [withdrawCurrency, setWithdrawCurrency] = useState(PAY_CURRENCY_TABS[0])

  const basicInfo = (
    <div className="site-config-readonly-basic">
      <div className="site-config-section-title">开站配置摘要</div>
      <div className="site-config-readonly-grid">
        <ReadRow label="站点模式" value={site.siteMode || '娱乐城（现金网）'} />
        <ReadRow label="代理模式" value="只开启人人皆可代理" />
        <ReadRow label="后台域名" value={site.primaryDomain || site.backendDomain} />
        <ReadRow label="备域名" value={site.backupDomain || '-'} />
        <ReadRow label="OSS厂商" value="AWS S3-美国硅谷" />
        <ReadRow label="皮肤版式" value="综合版10" />
        <ReadRow label="客户端皮肤" value={site.clientSkin || '-'} />
        <ReadRow label="语言匹配模式" value="系统默认" />
        <ReadRow label="语言" value="葡萄牙语" />
        <ReadRow label="时区" value={site.timezone} />
        <ReadRow label="币种" value={site.currency} />
        <ReadRow label="游戏类型" value="棋牌" />
        <ReadRow label="平台名称" value="WG棋牌" />
        <ReadRow label="平台币种" value={site.currency} />
        <ReadRow label="默认费率(%)" value="4.00" />
        <ReadRow label="调整后价格(%)" value="4.00" />
        <ReadRow label="开站费(U)" value="20,000.00" />
        <ReadRow label="站点押金(U)" value={site.deposit || '0.00'} />
        <ReadRow label="线路维护费(U)" value={site.lineFee} />
        <ReadRow label="三方优惠(%)" value="1" />
        <ReadRow label="授信额度(U)" value="20,000.00" />
        <ReadRow label="后台白名单" value="IP白名单" />
        <ReadRow label="备注" value="-" />
      </div>
    </div>
  )

  const summaryTab = {
    key: 'summary',
    label: '基本信息',
    children: (
      <>
        {summary}
        {showConfigTabs ? basicInfo : null}
      </>
    ),
  }

  if (!showConfigTabs) {
    return (
      <Tabs
        className="site-config-tabs site-config-readonly-tabs"
        items={[summaryTab]}
      />
    )
  }

  return (
    <Tabs
      className="site-config-tabs site-config-readonly-tabs"
      items={[
        summaryTab,
        {
          key: 'brand',
          label: 'LOGO与活动',
          children: (
            <>
              <div className="site-config-section-title">站点 LOGO</div>
              <div className="site-config-logo-grid site-config-logo-readonly">
                {LOGO_LABELS.map((label) => (
                  <div key={label} className="site-config-logo-readonly-item">
                    <div className="site-config-logo-readonly-name">{label}</div>
                    <div className="site-config-logo-readonly-box">已上传</div>
                    <div className="site-config-logo-readonly-extra">
                      上传2m以内的图片; 支持格式: jpg,png,svg,webp....
                    </div>
                  </div>
                ))}
              </div>
              <div className="site-config-section-title">活动模版</div>
              <Checkbox.Group
                className="site-config-activity-grid"
                value={[...ACTIVITY_TEMPLATE_OPTIONS]}
                options={ACTIVITY_TEMPLATE_OPTIONS.map((item) => ({ label: item, value: item }))}
                disabled
              />
            </>
          ),
        },
        {
          key: 'venues',
          label: '场馆授权',
          children: (
            <ConfigSelectTable
              readonly
              dataSource={VENUE_ROWS}
              scrollX={1100}
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
                readonly
                dataSource={DEPOSIT_ROWS}
                scrollX={1100}
                filters={[
                  {
                    key: 'category',
                    kind: 'select',
                    placeholder: '请选择分类',
                    options: [
                      { value: '体育', label: '体育' },
                      { value: '电子', label: '电子' },
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
                  { title: '图标', dataIndex: 'icon', width: 70, render: () => <PayIcon /> },
                  { title: '备注', dataIndex: 'remark', width: 140 },
                  { title: '状态', dataIndex: 'status', width: 80 },
                  { title: '操作时间', dataIndex: 'operateTime', width: 160 },
                  { title: '操作人', dataIndex: 'operator', width: 120 },
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
                readonly
                dataSource={WITHDRAW_ROWS}
                scrollX={1100}
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
                  { title: '图标', dataIndex: 'icon', width: 70, render: () => <PayIcon /> },
                  { title: '备注', dataIndex: 'remark', width: 140 },
                  { title: '状态', dataIndex: 'status', width: 80 },
                  { title: '操作时间', dataIndex: 'operateTime', width: 160 },
                  { title: '操作人', dataIndex: 'operator', width: 120 },
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
              readonly
              dataSource={SMS_ROWS}
              scrollX={1100}
              filters={[
                {
                  key: 'region',
                  kind: 'select',
                  placeholder: '请选择使用区域',
                  options: [
                    { value: '越南', label: '越南' },
                    { value: '巴西', label: '巴西' },
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
              readonly
              dataSource={MAIL_ROWS}
              scrollX={900}
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
              readonly
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
  )
}
