import { useMemo, useState, type Key } from 'react'
import { CaretUpOutlined, CopyOutlined, DownOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown, Input, Select, Space, Table, Tabs, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddSiteModal from '../components/AddSiteModal'
import CurrencyMultiSelect, { FILTER_CURRENCY_OPTIONS } from '../components/CurrencyMultiSelect'
import FilterRangePicker from '../components/FilterRangePicker'
import MasterStateModals, {
  getMasterTabActions,
  hasSiteConfigured,
  type MasterStateAction,
} from '../components/MasterStateModals'
import SiteActionModals, { type SiteActionType } from '../components/SiteActionModals'

export type SiteOpenMode = 'merchant' | 'master'

export interface SiteOpenPageProps {
  mode?: SiteOpenMode
}

interface SiteRow {
  key: string
  mainSite: string
  siteType: string
  siteId: string
  siteName: string
  source?: '商户申请' | '总控创建'
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
  thirdDiscount: string
  mergeStatus: string
  openStatus: string
  operator?: string
  operateTime?: string
  cancelTime?: string
  reviewer?: string
  reviewTime?: string
}

const SUB_TABS = [
  { key: 'creating', label: '创建中' },
  { key: 'configuring', label: '配置中' },
  { key: 'pending-audit', label: '待审核' },
  { key: 'pending-pay', label: '待付款' },
  { key: 'online', label: '已上线' },
  { key: 'cancelled', label: '已注销' },
  { key: 'all', label: '全部站点' },
]

const ID_FIELD_OPTIONS = [
  { value: 'siteId', label: '站点ID' },
  { value: 'siteName', label: '站点名称' },
  { value: 'company', label: '所属公司' },
  { value: 'mainSite', label: '所属主站' },
  { value: 'remark', label: '备注' },
  { value: 'owner', label: '持有人' },
  { value: 'business', label: '对接商务' },
]

const ID_FIELD_PLACEHOLDER: Record<string, string> = {
  siteId: '多个ID用逗号分隔',
  siteName: '请输入站点名称',
  company: '请输入所属公司',
  mainSite: '请输入所属主站',
  remark: '请输入备注',
  owner: '请输入持有人',
  business: '请输入对接商务',
}

const SITE_TYPE_OPTIONS = [
  { value: 'main', label: '主站点' },
  { value: 'sub', label: '子品牌' },
]

const SITE_MODE_OPTIONS = [
  { value: 'casino', label: '娱乐城（现金网）' },
  { value: 'club', label: '俱乐部（信用模式）' },
]

const REFERRAL_OPTIONS = [
  { value: 'personal', label: '个人' },
  { value: 'site', label: '站点' },
  { value: 'group', label: '集团' },
  { value: 'business', label: '商务' },
  { value: 'none', label: '无' },
]

const LANG_OPTIONS = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en', label: '英文' },
  { value: 'th', label: '泰语' },
  { value: 'vi', label: '越南语' },
  { value: 'id', label: '印度尼西亚语' },
  { value: 'hi', label: '印地语' },
  { value: 'ko', label: '韩语' },
  { value: 'ja', label: '日语' },
  { value: 'es', label: '西班牙语' },
  { value: 'de', label: '德语' },
  { value: 'fr', label: '法语' },
  { value: 'it', label: '意大利语' },
  { value: 'ru', label: '俄语' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'my', label: '缅甸语' },
  { value: 'ar', label: '阿拉伯语' },
]

const TZ_OPTIONS = [
  { value: 'UTC+12', label: '(UTC +12:00)新西兰, 惠灵顿, 斐济' },
  { value: 'UTC+11', label: '(UTC +11:00)新喀里多尼亚, 所罗门群岛' },
  { value: 'UTC+10', label: '(UTC +10:00)澳大利亚' },
  { value: 'UTC+9', label: '(UTC +09:00)日本' },
  { value: 'UTC+8', label: '(UTC +08:00)中国, 新加坡, 马来西亚' },
  { value: 'UTC+7', label: '(UTC +07:00)泰国, 越南, 印度尼西亚' },
  { value: 'UTC+6:30', label: '(UTC +06:30)缅甸' },
  { value: 'UTC+6', label: '(UTC +06:00)哈萨克斯坦, 孟加拉' },
  { value: 'UTC+5:30', label: '(UTC +05:30)印度, 斯里兰卡' },
  { value: 'UTC+5', label: '(UTC +05:00)巴基斯坦, 乌兹别克斯坦' },
  { value: 'UTC+4', label: '(UTC +04:00)阿联酋, 格鲁吉亚' },
  { value: 'UTC+3', label: '(UTC +03:00)莫斯科, 土耳其, 沙特' },
  { value: 'UTC+2', label: '(UTC +02:00)东欧, 南非' },
  { value: 'UTC+1', label: '(UTC +01:00)中欧, 西非' },
  { value: 'UTC+0', label: '(UTC +00:00)伦敦, 里斯本' },
  { value: 'UTC-3', label: '(UTC -03:00)巴西, 阿根廷' },
  { value: 'UTC-4', label: '(UTC -04:00)美东, 加拿大' },
  { value: 'UTC-5', label: '(UTC -05:00)美中, 哥伦比亚, 墨西哥' },
  { value: 'UTC-6', label: '(UTC -06:00)美国山区' },
  { value: 'UTC-7', label: '(UTC -07:00)美国太平洋' },
]

const CURRENCY_OPTIONS = FILTER_CURRENCY_OPTIONS

const AUDIT_STATUS_OPTIONS = [
  { value: '开站待技术审', label: '开站待技术审' },
  { value: '转让待技术审', label: '转让待技术审' },
  { value: '转让待集团审', label: '转让待集团审' },
  { value: '注销待技术审', label: '注销待技术审' },
  { value: '注销待集团审', label: '注销待集团审' },
  { value: '待外部接收', label: '待外部接收' },
]

const MERGE_STATUS_OPTIONS = [
  { value: '待合并', label: '待合并' },
  { value: '合并中', label: '合并中' },
  { value: '合并失败', label: '合并失败' },
  { value: '合并成功', label: '合并成功' },
]

const OPEN_STATUS_OPTIONS = [
  { value: '待付款', label: '待付款' },
  { value: '开站待技术审', label: '开站待技术审' },
  { value: '创建中', label: '创建中' },
  { value: '配置中', label: '配置中' },
  { value: '已配置', label: '已配置' },
  { value: '已上线', label: '已上线' },
  { value: '强制冻结', label: '强制冻结' },
  { value: '转让待技术审', label: '转让待技术审' },
  { value: '注销待技术审', label: '注销待技术审' },
  { value: '转让待集团审', label: '转让待集团审' },
  { value: '注销待集团审', label: '注销待集团审' },
  { value: '已注销', label: '已注销' },
  { value: '注销中', label: '注销中' },
  { value: '已拒绝', label: '已拒绝' },
  { value: '待外部接收', label: '待外部接收' },
  { value: '待关闭', label: '待关闭' },
]

const SKIN_LAYOUT_OPTIONS = [
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

const TIME_FIELD_OPTIONS = [
  { value: 'operate', label: '操作时间' },
  { value: 'cancel', label: '注销时间' },
  { value: 'create', label: '创建时间' },
  { value: 'open', label: '开站时间' },
  { value: 'second-audit', label: '二审时间' },
]

const AUDIT_TABS = new Set(['pending-audit'])
const ONLINE_TABS = new Set(['online'])
const CANCELLED_TABS = new Set(['cancelled'])
const ALL_TABS = new Set(['all'])
const BATCH_TABS = new Set(['online', 'all'])

function copyText(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => message.success(`已复制：${text}`),
    () => message.info(`复制：${text}（原型）`),
  )
}

const domainColumn: ColumnsType<SiteRow>[number] = {
  title: '后台域名',
  dataIndex: 'backendDomain',
  width: 190,
  render: (_, row) => (
    <div className="domain-cell">
      <div>
        主：{row.primaryDomain || row.backendDomain}
        <CopyOutlined className="copy-icon" onClick={() => copyText(row.primaryDomain || row.backendDomain)} />
      </div>
      <div>
        备：{row.backupDomain || '-'}
        {row.backupDomain ? (
          <CopyOutlined className="copy-icon" onClick={() => copyText(row.backupDomain!)} />
        ) : null}
      </div>
    </div>
  ),
}

const balanceColumn: ColumnsType<SiteRow>[number] = {
  title: '站点余额(U)',
  dataIndex: 'balance',
  width: 110,
  sorter: true,
  render: (v) => <span className="amount-highlight">{v}</span>,
}

const openStatusColumn: ColumnsType<SiteRow>[number] = {
  title: '开站状态',
  dataIndex: 'openStatus',
  width: 90,
  render: (v) => {
    if (v === '已上线' || v === '已配置') return <span className="status-ok">{v}</span>
    return v
  },
}

const MASTER_ALL_SITE_ACTIONS: SiteActionType[] = ['编辑', '强制冻结', '转让', '注销', '记录', '详情']
/** 站点后台全部站点：不含强制冻结 / 转让 / 记录 */
const MERCHANT_ALL_SITE_ACTIONS: SiteActionType[] = ['编辑', '注销', '详情']

const SOURCE_OPTIONS = [
  { value: '商户申请', label: '商户申请' },
  { value: '总控创建', label: '总控创建' },
]

const sourceColumn: ColumnsType<SiteRow>[number] = {
  title: '来源',
  dataIndex: 'source',
  width: 90,
  render: (value: string) => (
    <span className={value === '总控创建' ? 'site-source-master' : 'site-source-merchant'}>{value || '-'}</span>
  ),
}

const stripActionColumn = (cols: ColumnsType<SiteRow>) => cols.filter((col) => col.key !== 'actions')

const injectSourceColumn = (cols: ColumnsType<SiteRow>) => {
  const base = stripActionColumn(cols)
  const nameIdx = base.findIndex((col) => 'dataIndex' in col && col.dataIndex === 'siteName')
  if (nameIdx === -1) return [sourceColumn, ...base]
  return [...base.slice(0, nameIdx + 1), sourceColumn, ...base.slice(nameIdx + 1)]
}

const createAllActionColumn = (
  onAction: (action: SiteActionType, row: SiteRow) => void,
  actionList: SiteActionType[] = MASTER_ALL_SITE_ACTIONS,
): ColumnsType<SiteRow>[number] => ({
  title: '操作',
  key: 'actions',
  width: actionList.length > 4 ? 320 : 180,
  render: (_, row) => {
    const actions =
      row.openStatus === '已上线' ? actionList : actionList.filter((label) => label !== '注销')
    return (
      <div className="action-links">
        {actions.map((label) => (
          <Button
            key={label}
            type="link"
            size="small"
            className="action-link"
            onClick={() => onAction(label, row)}
          >
            {label}
          </Button>
        ))}
      </div>
    )
  },
})

const actionColumn = (label = '详情'): ColumnsType<SiteRow>[number] => ({
  title: '操作',
  key: 'actions',
  width: 80,
  render: () => (
    <Button type="link" size="small" className="action-link" onClick={() => message.info('操作（原型）')}>
      {label}
    </Button>
  ),
})

const CREATING_COLUMNS: ColumnsType<SiteRow> = [
  { title: '所属主站', dataIndex: 'mainSite', width: 100 },
  { title: '站点类型', dataIndex: 'siteType', width: 90 },
  { title: '站点ID', dataIndex: 'siteId', width: 90, sorter: true },
  { title: '站点名称', dataIndex: 'siteName', width: 100 },
  { title: '所属集团(ID)', dataIndex: 'groupId', width: 110 },
  { title: '所属公司(ID)', dataIndex: 'companyId', width: 110 },
  { title: '站点模式', dataIndex: 'siteMode', width: 90 },
  { title: '持有人', dataIndex: 'owner', width: 80 },
  {
    title: '对接商务',
    dataIndex: 'business',
    width: 90,
    render: (value?: string) => (value && value.trim() ? value : '-'),
  },
  { title: '推荐方式', dataIndex: 'referralMethod', width: 90 },
  { title: '推荐人/推荐单位', dataIndex: 'referrer', width: 130 },
  { title: '客户端皮肤', dataIndex: 'clientSkin', width: 100 },
  { title: '币种', dataIndex: 'currency', width: 70 },
  { title: '时区', dataIndex: 'timezone', width: 80 },
  { title: '后台域名', dataIndex: 'backendDomain', width: 160 },
  { title: '线路维护费(U)', dataIndex: 'lineFee', width: 120 },
  { title: '三方优惠(%)', dataIndex: 'thirdDiscount', width: 110 },
  { title: '合并状态', dataIndex: 'mergeStatus', width: 90 },
  { title: '开站状态', dataIndex: 'openStatus', width: 90 },
  actionColumn(),
]

const CONFIGURING_COLUMNS: ColumnsType<SiteRow> = [
  { title: '所属主站', dataIndex: 'mainSite', width: 100 },
  { title: '站点类型', dataIndex: 'siteType', width: 90 },
  { title: '站点ID', dataIndex: 'siteId', width: 90, sorter: true },
  { title: '站点名称', dataIndex: 'siteName', width: 100 },
  { title: '所属集团(ID)', dataIndex: 'groupId', width: 110 },
  { title: '所属公司(ID)', dataIndex: 'companyId', width: 110 },
  { title: '站点模式', dataIndex: 'siteMode', width: 90 },
  { title: '持有人', dataIndex: 'owner', width: 80 },
  {
    title: '对接商务',
    dataIndex: 'business',
    width: 90,
    render: (value?: string) => (value && value.trim() ? value : '-'),
  },
  { title: '推荐方式', dataIndex: 'referralMethod', width: 90 },
  { title: '推荐人/推荐单位', dataIndex: 'referrer', width: 130 },
  { title: '客户端皮肤', dataIndex: 'clientSkin', width: 100 },
  { title: '币种', dataIndex: 'currency', width: 70 },
  { title: '时区', dataIndex: 'timezone', width: 80 },
  { title: '后台域名', dataIndex: 'backendDomain', width: 160 },
  { title: '站点余额(U)', dataIndex: 'balance', width: 110, sorter: true },
  { title: '站点押金(U)', dataIndex: 'deposit', width: 110, sorter: true },
  { title: '线路维护费(U)', dataIndex: 'lineFee', width: 120 },
  { title: '三方优惠(%)', dataIndex: 'thirdDiscount', width: 110 },
  { title: '合并状态', dataIndex: 'mergeStatus', width: 90 },
  {
    title: '开站状态',
    dataIndex: 'openStatus',
    width: 90,
    render: (v: string) => (v === '已上线' || v === '已配置' ? <span className="status-ok">{v}</span> : v),
  },
]

const PENDING_AUDIT_COLUMNS: ColumnsType<SiteRow> = [
  ...CONFIGURING_COLUMNS,
  { title: '操作人', dataIndex: 'operator', width: 90 },
  { title: '操作时间', dataIndex: 'operateTime', width: 150 },
  actionColumn('审核'),
]

const PENDING_PAY_COLUMNS: ColumnsType<SiteRow> = [
  ...CONFIGURING_COLUMNS,
  actionColumn('付款'),
]

const ONLINE_COLUMNS: ColumnsType<SiteRow> = [
  ...CONFIGURING_COLUMNS,
  actionColumn('详情'),
]

const CANCELLED_COLUMNS: ColumnsType<SiteRow> = [
  ...CONFIGURING_COLUMNS,
  { title: '操作人', dataIndex: 'operator', width: 90 },
  { title: '注销时间', dataIndex: 'cancelTime', width: 150 },
  { title: '审核人', dataIndex: 'reviewer', width: 90 },
  { title: '审核时间', dataIndex: 'reviewTime', width: 150 },
  actionColumn('详情'),
]

const ALL_COLUMNS_BASE: ColumnsType<SiteRow> = [
  ...CONFIGURING_COLUMNS.map((col) => {
    if ('dataIndex' in col && col.dataIndex === 'backendDomain') return domainColumn
    if ('dataIndex' in col && col.dataIndex === 'balance') return balanceColumn
    if ('dataIndex' in col && col.dataIndex === 'openStatus') return openStatusColumn
    return col
  }),
  { title: '操作人', dataIndex: 'operator', width: 90 },
  { title: '操作时间', dataIndex: 'operateTime', width: 150 },
]

const ALL_SITES_TIMEZONE = '(UTC -03:00)格陵兰, 巴西, 阿根廷, 智利'

const ALL_SITES_MOCK_DATA: SiteRow[] = [
  {
    key: '7252',
    mainSite: '7252',
    siteType: '主站点',
    siteId: '7252',
    siteName: 'am-2.bet',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Anna Sui紫',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'am-2.cg.ink',
    primaryDomain: 'am-2.cg.ink',
    backupDomain: 'am-2.offib.com',
    balance: '185.98',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:30:18',
  },
  {
    key: '7213',
    mainSite: '7213',
    siteType: '主站点',
    siteId: '7213',
    siteName: 'am-1.bet',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-USDT绿',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'am-1.cg.ink',
    primaryDomain: 'am-1.cg.ink',
    backupDomain: 'am-1.offib.com',
    balance: '156.41',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:28:05',
  },
  {
    key: '6153',
    mainSite: '6153',
    siteType: '主站点',
    siteId: '6153',
    siteName: 'cianopg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Estee Lauder蓝',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'cianopg.cg.ink',
    primaryDomain: 'cianopg.cg.ink',
    backupDomain: 'cianopg.offib.com',
    balance: '142.67',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:25:42',
  },
  {
    key: '6152',
    mainSite: '6152',
    siteType: '主站点',
    siteId: '6152',
    siteName: 'azulpg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Facebook蓝',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'azulpg.cg.ink',
    primaryDomain: 'azulpg.cg.ink',
    backupDomain: 'azulpg.offib.com',
    balance: '128.35',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:22:16',
  },
  {
    key: '6132',
    mainSite: '6132',
    siteType: '主站点',
    siteId: '6132',
    siteName: 'baronesapg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-3CE提香红',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'baronesapg.cg.ink',
    primaryDomain: 'baronesapg.cg.ink',
    backupDomain: 'baronesapg.offib.com',
    balance: '115.20',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:18:33',
  },
  {
    key: '6131',
    mainSite: '6131',
    siteType: '主站点',
    siteId: '6131',
    siteName: 'verdepg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Chanel黑',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'verdepg.cg.ink',
    primaryDomain: 'verdepg.cg.ink',
    backupDomain: 'verdepg.offib.com',
    balance: '98.54',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:15:07',
  },
  {
    key: '6128',
    mainSite: '6128',
    siteType: '主站点',
    siteId: '6128',
    siteName: 'rosapg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Dior粉',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'rosapg.cg.ink',
    primaryDomain: 'rosapg.cg.ink',
    backupDomain: 'rosapg.offib.com',
    balance: '87.32',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:12:51',
  },
  {
    key: '6125',
    mainSite: '6125',
    siteType: '主站点',
    siteId: '6125',
    siteName: 'ouropg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Gucci绿',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'ouropg.cg.ink',
    primaryDomain: 'ouropg.cg.ink',
    backupDomain: 'ouropg.offib.com',
    balance: '76.18',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:09:24',
  },
  {
    key: '6120',
    mainSite: '6120',
    siteType: '主站点',
    siteId: '6120',
    siteName: 'prata777',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Hermes橙',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'prata777.cg.ink',
    primaryDomain: 'prata777.cg.ink',
    backupDomain: 'prata777.offib.com',
    balance: '65.90',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:06:38',
  },
  {
    key: '6118',
    mainSite: '6118',
    siteType: '主站点',
    siteId: '6118',
    siteName: 'brancopg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-LV棕',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'brancopg.cg.ink',
    primaryDomain: 'brancopg.cg.ink',
    backupDomain: 'brancopg.offib.com',
    balance: '54.73',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:03:12',
  },
  {
    key: '6115',
    mainSite: '6115',
    siteType: '主站点',
    siteId: '6115',
    siteName: 'fortunapg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Prada黑',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'fortunapg.cg.ink',
    primaryDomain: 'fortunapg.cg.ink',
    backupDomain: 'fortunapg.offib.com',
    balance: '48.26',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 14:00:45',
  },
  {
    key: '6112',
    mainSite: '6112',
    siteType: '主站点',
    siteId: '6112',
    siteName: 'estrelapg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Versace金',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'estrelapg.cg.ink',
    primaryDomain: 'estrelapg.cg.ink',
    backupDomain: 'estrelapg.offib.com',
    balance: '42.15',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 13:57:29',
  },
  {
    key: '6108',
    mainSite: '6108',
    siteType: '主站点',
    siteId: '6108',
    siteName: 'solpg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-YSL黑',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'solpg.cg.ink',
    primaryDomain: 'solpg.cg.ink',
    backupDomain: 'solpg.offib.com',
    balance: '36.88',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 13:54:06',
  },
  {
    key: '6105',
    mainSite: '6105',
    siteType: '主站点',
    siteId: '6105',
    siteName: 'luapg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Burberry米',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'luapg.cg.ink',
    primaryDomain: 'luapg.cg.ink',
    backupDomain: 'luapg.offib.com',
    balance: '31.42',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 13:50:33',
  },
  {
    key: '6102',
    mainSite: '6102',
    siteType: '主站点',
    siteId: '6102',
    siteName: 'marpg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Cartier红',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'marpg.cg.ink',
    primaryDomain: 'marpg.cg.ink',
    backupDomain: 'marpg.offib.com',
    balance: '28.76',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 13:47:18',
  },
  {
    key: '6098',
    mainSite: '6098',
    siteType: '主站点',
    siteId: '6098',
    siteName: 'riopg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Tiffany蓝',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'riopg.cg.ink',
    primaryDomain: 'riopg.cg.ink',
    backupDomain: 'riopg.offib.com',
    balance: '22.53',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 13:43:55',
  },
  {
    key: '6095',
    mainSite: '6095',
    siteType: '主站点',
    siteId: '6095',
    siteName: 'festapg',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Bvlgari紫',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'festapg.cg.ink',
    primaryDomain: 'festapg.cg.ink',
    backupDomain: 'festapg.offib.com',
    balance: '18.90',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    openStatus: '已上线',
    operator: 'system',
    operateTime: '2026-08-12 13:40:22',
  },
]

function masterRow(partial: Partial<SiteRow> & Pick<SiteRow, 'key' | 'siteId' | 'siteName' | 'openStatus' | 'source'>): SiteRow {
  return {
    mainSite: partial.siteId,
    siteType: '主站点',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Sergio Rossi褐',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: 'tb27io.cg.ink',
    primaryDomain: 'tb27io.cg.ink',
    backupDomain: 'tb27io.offtb.com',
    balance: '0.00',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    operator: 'cooper',
    operateTime: '2026-08-12 16:00:00',
    ...partial,
  }
}

const MASTER_CREATING_ROWS: SiteRow[] = [
  masterRow({ key: 'mc1', siteId: '5930', siteName: 'Librapg', openStatus: '创建中', source: '商户申请', business: '' }),
  masterRow({ key: 'mc2', siteId: '5931', siteName: 'test-pg', openStatus: '创建中', source: '总控创建', owner: 'cooper', business: '' }),
]

const MASTER_CONFIGURING_ROWS: SiteRow[] = [
  masterRow({ key: 'mf1', siteId: '5928', siteName: 'novapg', openStatus: '配置中', source: '商户申请', balance: '0.00' }),
  masterRow({ key: 'mf2', siteId: '5929', siteName: 'starpg', openStatus: '配置中', source: '总控创建', balance: '0.00' }),
]

const MASTER_PENDING_AUDIT_ROWS: SiteRow[] = [
  masterRow({
    key: 'ma1',
    siteId: '5926',
    siteName: 'betwin',
    openStatus: '开站待技术审',
    source: '商户申请',
    balance: '94.90',
    operator: 'system',
    operateTime: '2026-08-12 14:20:00',
  }),
]

const MASTER_PENDING_PAY_ROWS: SiteRow[] = [
  masterRow({
    key: 'mp1',
    siteId: '5922',
    siteName: 'Librapq',
    openStatus: '待付款',
    source: '商户申请',
    balance: '94.90',
    operator: 'tempo',
    operateTime: '2026-08-12 15:10:00',
  }),
]

const MASTER_ONLINE_ROWS: SiteRow[] = ALL_SITES_MOCK_DATA.slice(0, 3).map((row, index) => ({
  ...row,
  source: index === 0 ? ('总控创建' as const) : ('商户申请' as const),
}))

const MASTER_CANCELLED_ROWS: SiteRow[] = [
  masterRow({
    key: 'mx1',
    siteId: '5801',
    siteName: 'old-pg',
    openStatus: '已注销',
    source: '商户申请',
    cancelTime: '2026-07-01 12:00:00',
    reviewer: 'cooper',
    reviewTime: '2026-07-01 11:50:00',
  }),
]

const MASTER_ALL_ROWS: SiteRow[] = ALL_SITES_MOCK_DATA.map((row, index) => ({
  ...row,
  source: index % 4 === 0 ? ('总控创建' as const) : ('商户申请' as const),
}))

function merchantRow(
  partial: Partial<SiteRow> & Pick<SiteRow, 'key' | 'siteId' | 'siteName' | 'openStatus'>,
): SiteRow {
  const domainBase = partial.siteName?.replace(/\./g, '') || partial.siteId
  return {
    mainSite: partial.siteId,
    siteType: '主站点',
    groupId: '伯乐(1179)',
    companyId: '无',
    siteMode: '娱乐城（现金网）',
    owner: 'bole888',
    business: 'tempo',
    referralMethod: '个人',
    referrer: 'tempo',
    clientSkin: '综合版2-Anna Sui紫',
    currency: 'BRL',
    timezone: ALL_SITES_TIMEZONE,
    backendDomain: `${domainBase}.cg.ink`,
    primaryDomain: `${domainBase}.cg.ink`,
    backupDomain: `${domainBase}.offib.com`,
    balance: '0.00',
    deposit: '0.00',
    lineFee: '3,000.00',
    thirdDiscount: '1',
    mergeStatus: '-',
    operator: 'system',
    operateTime: '2026-08-13 09:00:00',
    ...partial,
  }
}

const MERCHANT_CREATING_ROWS: SiteRow[] = [
  merchantRow({
    key: 'm-c1',
    siteId: '7301',
    siteName: 'nova-bet',
    openStatus: '创建中',
    business: '',
    operateTime: '2026-08-13 08:12:30',
  }),
  merchantRow({
    key: 'm-c2',
    siteId: '7302',
    siteName: 'luckypg',
    openStatus: '创建中',
    owner: 'bole',
    clientSkin: '综合版2-Sergio Rossi褐',
    operateTime: '2026-08-13 07:45:18',
  }),
]

const MERCHANT_CONFIGURING_ROWS: SiteRow[] = [
  merchantRow({
    key: 'm-f1',
    siteId: '7288',
    siteName: 'spinpg',
    openStatus: '配置中',
    balance: '0.00',
    clientSkin: '综合版2-宝蓝色底',
    operateTime: '2026-08-12 22:10:05',
  }),
  merchantRow({
    key: 'm-f2',
    siteId: '7289',
    siteName: 'royalpg',
    openStatus: '配置中',
    balance: '0.00',
    owner: 'bole',
    referralMethod: '商务',
    operateTime: '2026-08-12 20:33:41',
  }),
]

const MERCHANT_PENDING_AUDIT_ROWS: SiteRow[] = [
  merchantRow({
    key: 'm-a1',
    siteId: '7260',
    siteName: 'betwin',
    openStatus: '开站待技术审',
    balance: '94.90',
    operator: 'system',
    operateTime: '2026-08-12 18:20:00',
  }),
  merchantRow({
    key: 'm-a2',
    siteId: '7261',
    siteName: 'firepg',
    openStatus: '开站待技术审',
    balance: '0.00',
    clientSkin: '综合版2-紫金',
    operator: 'tempo',
    operateTime: '2026-08-12 17:05:22',
  }),
]

const MERCHANT_PENDING_PAY_ROWS: SiteRow[] = [
  merchantRow({
    key: 'm-p1',
    siteId: '7240',
    siteName: 'Librapq',
    openStatus: '待付款',
    balance: '94.90',
    clientSkin: '综合版2-Sergio Rossi褐',
    operator: 'tempo',
    operateTime: '2026-08-12 16:40:00',
  }),
  merchantRow({
    key: 'm-p2',
    siteId: '7241',
    siteName: 'goldpg',
    openStatus: '待付款',
    balance: '200.00',
    deposit: '0.00',
    operator: 'system',
    operateTime: '2026-08-12 15:18:33',
  }),
]

const MERCHANT_ONLINE_ROWS: SiteRow[] = ALL_SITES_MOCK_DATA.slice(0, 5).map((row) => ({
  ...row,
  openStatus: '已上线',
}))

const MERCHANT_CANCELLED_ROWS: SiteRow[] = [
  merchantRow({
    key: 'm-x1',
    siteId: '6801',
    siteName: 'old-nova',
    openStatus: '已注销',
    balance: '0.00',
    operator: 'bole888',
    cancelTime: '2026-07-20 14:22:10',
    reviewer: 'tempo',
    reviewTime: '2026-07-20 14:10:00',
    operateTime: '2026-07-20 14:22:10',
  }),
  merchantRow({
    key: 'm-x2',
    siteId: '6802',
    siteName: 'sunsetpg',
    openStatus: '已注销',
    balance: '0.00',
    owner: 'bole',
    clientSkin: '综合版2-咖啡色底',
    operator: 'system',
    cancelTime: '2026-06-08 11:05:44',
    reviewer: 'cooper',
    reviewTime: '2026-06-08 10:50:12',
    operateTime: '2026-06-08 11:05:44',
  }),
]

const TAB_TABLE_CONFIG: Record<string, { columns: ColumnsType<SiteRow>; scrollX: number; rows: SiteRow[] }> = {
  creating: { columns: CREATING_COLUMNS, scrollX: 2200, rows: MERCHANT_CREATING_ROWS },
  configuring: { columns: CONFIGURING_COLUMNS, scrollX: 2500, rows: MERCHANT_CONFIGURING_ROWS },
  'pending-audit': { columns: PENDING_AUDIT_COLUMNS, scrollX: 2800, rows: MERCHANT_PENDING_AUDIT_ROWS },
  'pending-pay': { columns: PENDING_PAY_COLUMNS, scrollX: 2700, rows: MERCHANT_PENDING_PAY_ROWS },
  online: { columns: ONLINE_COLUMNS, scrollX: 2700, rows: MERCHANT_ONLINE_ROWS },
  cancelled: { columns: CANCELLED_COLUMNS, scrollX: 3100, rows: MERCHANT_CANCELLED_ROWS },
  all: { columns: ALL_COLUMNS_BASE, scrollX: 3200, rows: ALL_SITES_MOCK_DATA },
}

const MASTER_TAB_TABLE_CONFIG: Record<string, { columns: ColumnsType<SiteRow>; scrollX: number; rows: SiteRow[] }> = {
  creating: { columns: CREATING_COLUMNS, scrollX: 2300, rows: MASTER_CREATING_ROWS },
  configuring: { columns: CONFIGURING_COLUMNS, scrollX: 2600, rows: MASTER_CONFIGURING_ROWS },
  'pending-audit': { columns: PENDING_AUDIT_COLUMNS, scrollX: 2900, rows: MASTER_PENDING_AUDIT_ROWS },
  'pending-pay': { columns: PENDING_PAY_COLUMNS, scrollX: 2800, rows: MASTER_PENDING_PAY_ROWS },
  online: { columns: ONLINE_COLUMNS, scrollX: 2800, rows: MASTER_ONLINE_ROWS },
  cancelled: { columns: CANCELLED_COLUMNS, scrollX: 3200, rows: MASTER_CANCELLED_ROWS },
  all: { columns: ALL_COLUMNS_BASE, scrollX: 3300, rows: MASTER_ALL_ROWS },
}

export default function SiteOpenPage({ mode = 'merchant' }: SiteOpenPageProps) {
  const isMaster = mode === 'master'
  const [subTab, setSubTab] = useState('creating')
  const [idField, setIdField] = useState('siteId')
  const [idValue, setIdValue] = useState('')
  const [siteType, setSiteType] = useState<string>()
  const [siteMode, setSiteMode] = useState<string>()
  const [referral, setReferral] = useState<string>()
  const [lang, setLang] = useState<string>()
  const [timezone, setTimezone] = useState<string>()
  const [currency, setCurrency] = useState<string[]>([])
  const [auditStatus, setAuditStatus] = useState<string>()
  const [mergeStatus, setMergeStatus] = useState<string>()
  const [skinLayout, setSkinLayout] = useState<string>()
  const [clientSkinFilter, setClientSkinFilter] = useState<string>()
  const [openStatusFilter, setOpenStatusFilter] = useState<string>()
  const [timeField, setTimeField] = useState('operate')
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day')
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [filterOpen, setFilterOpen] = useState(true)
  const [addSiteOpen, setAddSiteOpen] = useState(false)
  const [siteAction, setSiteAction] = useState<{ type: SiteActionType; site: SiteRow } | null>(null)
  const [masterState, setMasterState] = useState<{ action: MasterStateAction; site: SiteRow } | null>(null)
  const [sourceFilter, setSourceFilter] = useState<string>()
  const [masterCreatingRows, setMasterCreatingRows] = useState<SiteRow[]>(MASTER_CREATING_ROWS)
  const [masterConfiguringRows, setMasterConfiguringRows] = useState<SiteRow[]>(MASTER_CONFIGURING_ROWS)
  const [masterPendingAuditRows, setMasterPendingAuditRows] = useState<SiteRow[]>(MASTER_PENDING_AUDIT_ROWS)
  const [masterPendingPayRows, setMasterPendingPayRows] = useState<SiteRow[]>(MASTER_PENDING_PAY_ROWS)
  const [masterOnlineRows, setMasterOnlineRows] = useState<SiteRow[]>(MASTER_ONLINE_ROWS)

  const isAuditTab = AUDIT_TABS.has(subTab)
  const isOnlineTab = ONLINE_TABS.has(subTab)
  const isCancelledTab = CANCELLED_TABS.has(subTab)
  const isAllTab = ALL_TABS.has(subTab)
  const isBatchTab = BATCH_TABS.has(subTab)

  const reset = () => {
    setIdField('siteId')
    setIdValue('')
    setSiteType(undefined)
    setSiteMode(undefined)
    setReferral(undefined)
    setLang(undefined)
    setTimezone(undefined)
    setCurrency([])
    setAuditStatus(undefined)
    setMergeStatus(undefined)
    setSkinLayout(undefined)
    setClientSkinFilter(undefined)
    setOpenStatusFilter(undefined)
    setSourceFilter(undefined)
    setTimeField('operate')
    setTimeRange('day')
    setSelectedRowKeys([])
    message.success('已重置筛选条件')
  }

  const search = () => {
    message.success('已按条件筛选（原型本地数据）')
  }

  const configMap = isMaster ? MASTER_TAB_TABLE_CONFIG : TAB_TABLE_CONFIG
  const tableConfig = configMap[subTab] || configMap.creating
  const { scrollX } = tableConfig
  const rows =
    isMaster && subTab === 'creating'
      ? masterCreatingRows
      : isMaster && subTab === 'configuring'
        ? masterConfiguringRows
        : isMaster && subTab === 'pending-audit'
          ? masterPendingAuditRows
          : isMaster && subTab === 'pending-pay'
            ? masterPendingPayRows
            : isMaster && subTab === 'online'
              ? masterOnlineRows
              : tableConfig.rows

  const stamp = () => new Date().toISOString().slice(0, 19).replace('T', ' ')

  const handleMasterAction = (label: MasterStateAction, row: SiteRow) => {
    if (label === '提交审核' && !hasSiteConfigured(row)) {
      message.warning('请先完成站点配置')
      return
    }
    setMasterState({ action: label, site: row })
  }

  const columns = useMemo(() => {
    if (isMaster) {
      if (subTab === 'all') {
        return [
          ...injectSourceColumn(ALL_COLUMNS_BASE),
          createAllActionColumn((type, site) => setSiteAction({ type, site }), MASTER_ALL_SITE_ACTIONS),
        ]
      }
      const base = injectSourceColumn(stripActionColumn(tableConfig.columns))
      const actions = getMasterTabActions(subTab)
      if (!actions.length) return base
      return [
        ...base,
        {
          title: '操作',
          key: 'actions',
          width:
            subTab === 'creating'
              ? 240
              : subTab === 'configuring'
                ? 340
                : subTab === 'pending-audit'
                  ? 320
                  : subTab === 'pending-pay'
                    ? 300
                    : subTab === 'online'
                      ? 120
                      : 260,
          render: (_: unknown, row: SiteRow) => (
            <div className="action-links">
              {actions.map((label) => (
                <Button
                  key={label}
                  type="link"
                  size="small"
                  className="action-link"
                  onClick={() => handleMasterAction(label, row)}
                >
                  {label}
                </Button>
              ))}
            </div>
          ),
        },
      ]
    }
    if (subTab !== 'all') {
      const base = stripActionColumn(tableConfig.columns)
      const merchantActions =
        subTab === 'pending-pay'
          ? (['付款', '详情'] as const)
          : subTab === 'online'
            ? (['注销', '详情'] as const)
            : (['详情'] as const)
      return [
        ...base,
        {
          title: '操作',
          key: 'actions',
          width: merchantActions.length > 1 ? 120 : 80,
          render: (_: unknown, row: SiteRow) => (
            <div className="action-links">
              {merchantActions.map((actionLabel) => (
                <Button
                  key={actionLabel}
                  type="link"
                  size="small"
                  className="action-link"
                  onClick={() => {
                    if (actionLabel === '详情' || actionLabel === '注销') {
                      setSiteAction({ type: actionLabel, site: row })
                      return
                    }
                    if (actionLabel === '付款') {
                      message.success(`${row.siteName} 付款成功，进入配置中（原型）`)
                      return
                    }
                    message.info(`${actionLabel}（原型）`)
                  }}
                >
                  {actionLabel}
                </Button>
              ))}
            </div>
          ),
        },
      ]
    }
    return [
      ...ALL_COLUMNS_BASE,
      createAllActionColumn((type, site) => setSiteAction({ type, site }), MERCHANT_ALL_SITE_ACTIONS),
    ]
  }, [
    isMaster,
    subTab,
    tableConfig.columns,
    masterCreatingRows,
    masterConfiguringRows,
    masterPendingAuditRows,
    masterPendingPayRows,
    masterOnlineRows,
  ])
  const total = useMemo(() => rows.length, [rows])

  return (
    <div className={`org-page-panel site-open-page ${isMaster ? 'site-open-page-master' : ''}`}>
      <Tabs
        className="site-open-tabs"
        activeKey={subTab}
        onChange={(key) => {
          setSubTab(key)
          setSelectedRowKeys(key === 'all' ? ['7252'] : [])
        }}
        items={SUB_TABS.map((t) => ({ key: t.key, label: t.label }))}
      />

      {filterOpen ? (
        <div className="site-open-filter">
          {isAuditTab ? (
            <>
              <div className="site-open-filter-row">
                <span className="site-open-filter-label">操作时间</span>
                <Space.Compact>
                  <Button size="small" type={timeRange === 'day' ? 'primary' : 'default'} onClick={() => setTimeRange('day')}>
                    日
                  </Button>
                  <Button size="small" type={timeRange === 'week' ? 'primary' : 'default'} onClick={() => setTimeRange('week')}>
                    周
                  </Button>
                  <Button size="small" type={timeRange === 'month' ? 'primary' : 'default'} onClick={() => setTimeRange('month')}>
                    月
                  </Button>
                </Space.Compact>
                <FilterRangePicker style={{ width: 340 }} />
                <Select
                  value={idField}
                  onChange={setIdField}
                  options={ID_FIELD_OPTIONS}
                  style={{ width: 120 }}
                />
                <Input
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                  placeholder={ID_FIELD_PLACEHOLDER[idField] || '请输入搜索内容'}
                  allowClear
                  style={{ width: 180 }}
                />
                <Select placeholder="站点类型" allowClear value={siteType} onChange={setSiteType} options={SITE_TYPE_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="站点模式" allowClear value={siteMode} onChange={setSiteMode} options={SITE_MODE_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="推荐方式" allowClear value={referral} onChange={setReferral} options={REFERRAL_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="开站审核状态" allowClear value={auditStatus} onChange={setAuditStatus} options={AUDIT_STATUS_OPTIONS} style={{ width: 130 }} />
                <Select placeholder="语言" allowClear value={lang} onChange={setLang} options={LANG_OPTIONS} style={{ width: 110 }} />
              </div>
              <div className="site-open-filter-row">
                <Select
                  placeholder="时区"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={timezone}
                  onChange={setTimezone}
                  options={TZ_OPTIONS}
                  style={{ width: 260 }}
                  popupMatchSelectWidth={false}
                />
                <CurrencyMultiSelect
                  value={currency}
                  onChange={setCurrency}
                  options={CURRENCY_OPTIONS}
                  style={{ width: 150 }}
                />
                <Button type="primary" onClick={search}>
                  搜索
                </Button>
                <Button onClick={reset}>重置</Button>
              </div>
            </>
          ) : isCancelledTab ? (
            <>
              <div className="site-open-filter-row">
                <span className="site-open-filter-label">注销时间</span>
                <Space.Compact>
                  <Button size="small" type={timeRange === 'day' ? 'primary' : 'default'} onClick={() => setTimeRange('day')}>
                    日
                  </Button>
                  <Button size="small" type={timeRange === 'week' ? 'primary' : 'default'} onClick={() => setTimeRange('week')}>
                    周
                  </Button>
                  <Button size="small" type={timeRange === 'month' ? 'primary' : 'default'} onClick={() => setTimeRange('month')}>
                    月
                  </Button>
                </Space.Compact>
                <FilterRangePicker style={{ width: 340 }} />
                <Select value={idField} onChange={setIdField} options={ID_FIELD_OPTIONS} style={{ width: 120 }} />
                <Input
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                  placeholder={ID_FIELD_PLACEHOLDER[idField] || '请输入搜索内容'}
                  allowClear
                  style={{ width: 180 }}
                />
                <Select placeholder="站点类型" allowClear value={siteType} onChange={setSiteType} options={SITE_TYPE_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="站点模式" allowClear value={siteMode} onChange={setSiteMode} options={SITE_MODE_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="推荐方式" allowClear value={referral} onChange={setReferral} options={REFERRAL_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="语言" allowClear value={lang} onChange={setLang} options={LANG_OPTIONS} style={{ width: 110 }} />
              </div>
              <div className="site-open-filter-row">
                <Select
                  placeholder="时区"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={timezone}
                  onChange={setTimezone}
                  options={TZ_OPTIONS}
                  style={{ width: 260 }}
                  popupMatchSelectWidth={false}
                />
                <CurrencyMultiSelect
                  value={currency}
                  onChange={setCurrency}
                  options={CURRENCY_OPTIONS}
                  style={{ width: 150 }}
                />
                <Button type="primary" onClick={search}>
                  搜索
                </Button>
                <Button onClick={reset}>重置</Button>
              </div>
            </>
          ) : isAllTab ? (
            <div className="site-open-filter-all">
              <div className="site-open-filter-row site-open-filter-row-first">
                <Select value={timeField} onChange={setTimeField} options={TIME_FIELD_OPTIONS} style={{ width: 100 }} />
                <Space.Compact>
                  <Button size="small" type={timeRange === 'day' ? 'primary' : 'default'} onClick={() => setTimeRange('day')}>
                    日
                  </Button>
                  <Button size="small" type={timeRange === 'week' ? 'primary' : 'default'} onClick={() => setTimeRange('week')}>
                    周
                  </Button>
                  <Button size="small" type={timeRange === 'month' ? 'primary' : 'default'} onClick={() => setTimeRange('month')}>
                    月
                  </Button>
                </Space.Compact>
                <FilterRangePicker style={{ width: 280 }} />
                <Select value={idField} onChange={setIdField} options={ID_FIELD_OPTIONS} style={{ width: 100 }} />
                <Input
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                  placeholder={ID_FIELD_PLACEHOLDER[idField] || '请输入搜索内容'}
                  allowClear
                  style={{ width: 150 }}
                />
                <Select placeholder="站点类型" allowClear value={siteType} onChange={setSiteType} options={SITE_TYPE_OPTIONS} style={{ width: 100 }} />
                <Select placeholder="站点模式" allowClear value={siteMode} onChange={setSiteMode} options={SITE_MODE_OPTIONS} style={{ width: 100 }} />
                <Select placeholder="推荐方式" allowClear value={referral} onChange={setReferral} options={REFERRAL_OPTIONS} style={{ width: 100 }} />
                <Select placeholder="开站状态" allowClear value={openStatusFilter} onChange={setOpenStatusFilter} options={OPEN_STATUS_OPTIONS} style={{ width: 100 }} />
                <Select placeholder="合并状态" allowClear value={mergeStatus} onChange={setMergeStatus} options={MERGE_STATUS_OPTIONS} style={{ width: 100 }} />
                <Select placeholder="语言" allowClear value={lang} onChange={setLang} options={LANG_OPTIONS} style={{ width: 90 }} />
              </div>
              <div className="site-open-filter-row site-open-filter-row-second">
                <div className="site-open-filter-row site-open-filter-row-left">
                  <Select placeholder="皮肤版式" allowClear value={skinLayout} onChange={setSkinLayout} options={SKIN_LAYOUT_OPTIONS} style={{ width: 100 }} />
                  <Select placeholder="客户端皮肤" allowClear value={clientSkinFilter} onChange={setClientSkinFilter} options={CLIENT_SKIN_OPTIONS} style={{ width: 100 }} />
                  <Select
                    placeholder="时区"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    value={timezone}
                    onChange={setTimezone}
                    options={TZ_OPTIONS}
                    style={{ width: 100 }}
                    popupMatchSelectWidth={false}
                  />
                  <CurrencyMultiSelect
                    value={currency}
                    onChange={setCurrency}
                    options={CURRENCY_OPTIONS}
                    style={{ width: 100 }}
                  />
                  <Button type="primary" onClick={search}>
                    搜索
                  </Button>
                  <Button onClick={reset}>重置</Button>
                </div>
                <div className="site-open-filter-actions">
                  <Button type="primary" onClick={() => setAddSiteOpen(true)}>
                    {isMaster ? '新增开站' : '新增站点'}
                  </Button>
                  <Button type="primary" disabled>
                    新增子品牌
                  </Button>
                  <Button type="primary" disabled>
                    站点合并
                  </Button>
                  <Button icon={<UploadOutlined />} onClick={() => message.info('导出报表（原型）')}>
                    导出报表
                  </Button>
                </div>
              </div>
            </div>
          ) : isOnlineTab ? (
            <>
              <div className="site-open-filter-row">
                <Select value={idField} onChange={setIdField} options={ID_FIELD_OPTIONS} style={{ width: 120 }} />
                <Input
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                  placeholder={ID_FIELD_PLACEHOLDER[idField] || '请输入搜索内容'}
                  allowClear
                  style={{ width: 180 }}
                />
                <Select placeholder="站点类型" allowClear value={siteType} onChange={setSiteType} options={SITE_TYPE_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="站点模式" allowClear value={siteMode} onChange={setSiteMode} options={SITE_MODE_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="推荐方式" allowClear value={referral} onChange={setReferral} options={REFERRAL_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="合并状态" allowClear value={mergeStatus} onChange={setMergeStatus} options={MERGE_STATUS_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="语言" allowClear value={lang} onChange={setLang} options={LANG_OPTIONS} style={{ width: 110 }} />
                <Select placeholder="皮肤版式" allowClear value={skinLayout} onChange={setSkinLayout} options={SKIN_LAYOUT_OPTIONS} style={{ width: 120 }} />
                <Select placeholder="客户端皮肤" allowClear value={clientSkinFilter} onChange={setClientSkinFilter} options={CLIENT_SKIN_OPTIONS} style={{ width: 120 }} />
              </div>
              <div className="site-open-filter-row site-open-filter-row-between">
                <div className="site-open-filter-row">
                  <Select
                    placeholder="时区"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    value={timezone}
                    onChange={setTimezone}
                    options={TZ_OPTIONS}
                    style={{ width: 260 }}
                    popupMatchSelectWidth={false}
                  />
                  <CurrencyMultiSelect
                    value={currency}
                    onChange={setCurrency}
                    options={CURRENCY_OPTIONS}
                    style={{ width: 150 }}
                  />
                  <Button type="primary" onClick={search}>
                    搜索
                  </Button>
                  <Button onClick={reset}>重置</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="site-open-filter-row">
              <Select
                value={idField}
                onChange={setIdField}
                options={ID_FIELD_OPTIONS}
                style={{ width: 120 }}
              />
              <Input
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
                placeholder={ID_FIELD_PLACEHOLDER[idField] || '请输入搜索内容'}
                allowClear
                style={{ width: 180 }}
              />
              <Select
                placeholder="站点类型"
                allowClear
                value={siteType}
                onChange={setSiteType}
                options={SITE_TYPE_OPTIONS}
                style={{ width: 120 }}
              />
              <Select
                placeholder="站点模式"
                allowClear
                value={siteMode}
                onChange={setSiteMode}
                options={SITE_MODE_OPTIONS}
                style={{ width: 120 }}
              />
              <Select
                placeholder="推荐方式"
                allowClear
                value={referral}
                onChange={setReferral}
                options={REFERRAL_OPTIONS}
                style={{ width: 120 }}
              />
              <Select
                placeholder="语言"
                allowClear
                value={lang}
                onChange={setLang}
                options={LANG_OPTIONS}
                style={{ width: 110 }}
              />
              <Select
                placeholder="时区"
                allowClear
                showSearch
                optionFilterProp="label"
                value={timezone}
                onChange={setTimezone}
                options={TZ_OPTIONS}
                style={{ width: 260 }}
                popupMatchSelectWidth={false}
              />
              <CurrencyMultiSelect
                value={currency}
                onChange={setCurrency}
                options={CURRENCY_OPTIONS}
                style={{ width: 150 }}
              />
              {isMaster ? (
                <Select placeholder="来源" allowClear value={sourceFilter} onChange={setSourceFilter} options={SOURCE_OPTIONS} style={{ width: 110 }} />
              ) : null}
              <Button type="primary" onClick={search}>
                搜索
              </Button>
              <Button onClick={reset}>重置</Button>
              {isMaster ? (
                <>
                  <span className="site-open-filter-spacer" />
                  <Button icon={<UploadOutlined />} onClick={() => message.info('导出报表（原型）')}>
                    导出报表
                  </Button>
                </>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      <div className="site-open-filter-toggle" onClick={() => setFilterOpen((v) => !v)}>
        <CaretUpOutlined rotate={filterOpen ? 0 : 180} />
      </div>

      <div className="org-table-wrap">
        <Table<SiteRow>
          size="small"
          bordered
          columns={columns}
          dataSource={rows}
          pagination={false}
          scroll={{ x: scrollX }}
          className="org-group-table"
          locale={{ emptyText: '暂无数据' }}
          rowSelection={
            isBatchTab
              ? {
                  selectedRowKeys,
                  onChange: (keys) => setSelectedRowKeys(keys),
                }
              : undefined
          }
        />
      </div>
      {isBatchTab ? (
        <div className="site-open-table-footer">
          <Checkbox
            checked={rows.length > 0 && selectedRowKeys.length === rows.length}
            indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < rows.length}
            onChange={(e) => setSelectedRowKeys(e.target.checked ? rows.map((r) => r.key) : [])}
          >
            全选当前页
          </Checkbox>
          <Dropdown
            menu={{
              items: [
                { key: 'export', label: '批量导出', onClick: () => message.info('批量导出（原型）') },
                { key: 'offline', label: '批量下线', onClick: () => message.info('批量下线（原型）') },
              ],
            }}
          >
            <Button size="small">
              批量操作 <DownOutlined />
            </Button>
          </Dropdown>
          <span className="site-open-footer-stat">已选择 {selectedRowKeys.length} 条数据</span>
          <span className="site-open-footer-total">共 {total} 条</span>
        </div>
      ) : (
        <div className="org-table-footer">共 {total} 条</div>
      )}

      <AddSiteModal open={addSiteOpen} onClose={() => setAddSiteOpen(false)} variant={isMaster ? 'master' : 'merchant'} />
      <SiteActionModals
        action={siteAction?.type ?? null}
        site={siteAction?.site ?? null}
        onClose={() => setSiteAction(null)}
        editMode={isMaster ? 'full' : 'merchant'}
      />
      <MasterStateModals
        action={masterState?.action ?? null}
        site={masterState?.site ?? null}
        onClose={() => setMasterState(null)}
        onSupplementSave={(siteKey, values) => {
          const target = masterCreatingRows.find((row) => row.key === siteKey)
          if (!target) return
          setMasterCreatingRows((prev) => prev.filter((row) => row.key !== siteKey))
          setMasterPendingPayRows((prev) => [
            {
              ...target,
              business: values.business,
              referralMethod: values.referralMethod || target.referralMethod,
              lineFee: values.lineFee?.trim() ? values.lineFee : target.lineFee,
              openStatus: '待付款',
              operator: 'cooper',
              operateTime: stamp(),
            },
            ...prev,
          ])
          setSubTab('pending-pay')
        }}
        onConfigSave={(siteKey) => {
          setMasterConfiguringRows((prev) =>
            prev.map((row) => (row.key === siteKey ? { ...row, openStatus: '已配置' } : row)),
          )
        }}
        onSubmitAudit={(siteKey) => {
          const target = masterConfiguringRows.find((row) => row.key === siteKey)
          if (!target) return
          setMasterConfiguringRows((prev) => prev.filter((row) => row.key !== siteKey))
          setMasterPendingAuditRows((prev) => [
            {
              ...target,
              openStatus: '开站待技术审',
              operator: 'cooper',
              operateTime: stamp(),
            },
            ...prev,
          ])
          setSubTab('pending-audit')
        }}
        onReturnToConfiguring={(siteKey) => {
          const target = masterPendingAuditRows.find((row) => row.key === siteKey)
          if (!target) return
          setMasterPendingAuditRows((prev) => prev.filter((row) => row.key !== siteKey))
          setMasterConfiguringRows((prev) => [
            {
              ...target,
              openStatus: '配置中',
              operator: 'cooper',
              operateTime: stamp(),
            },
            ...prev,
          ])
          setSubTab('configuring')
        }}
        onConfirmPay={(siteKey) => {
          const target = masterPendingPayRows.find((row) => row.key === siteKey)
          if (!target) return
          setMasterPendingPayRows((prev) => prev.filter((row) => row.key !== siteKey))
          setMasterConfiguringRows((prev) => [
            {
              ...target,
              openStatus: '配置中',
              operator: 'cooper',
              operateTime: stamp(),
            },
            ...prev,
          ])
          setSubTab('configuring')
        }}
        onAuditPass={(siteKey) => {
          const target = masterPendingAuditRows.find((row) => row.key === siteKey)
          if (!target) return
          setMasterPendingAuditRows((prev) => prev.filter((row) => row.key !== siteKey))
          setMasterOnlineRows((prev) => [
            {
              ...target,
              openStatus: '已上线',
              operator: 'cooper',
              operateTime: stamp(),
            },
            ...prev,
          ])
          setSubTab('online')
        }}
      />
    </div>
  )
}
