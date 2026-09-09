import { useState, type ReactNode } from 'react'
import { QuestionCircleFilled, ReloadOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Select, Space, Table, Tooltip, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { FILTER_CURRENCY_OPTIONS } from './CurrencyMultiSelect'

export interface SiteBillDetailSource {
  brandName: string
  groupName: string
  billMonth: string
  status: string
  ownerRemark: string
  payTotal: string
}

interface DetailLine {
  key: string
  brandName: string
  billMonth: string
  currency: string
  gameType: string
  vendorName: string
  betAmount: string
  validBet: string
  profitLoss: string
  commissionRate: string
  billAmount: string
  vendorDiscount: string
  afterRate: string
  commissionAmount: string
  exchangeRate: string
  gameBillU: string
  status: string
}

const GAME_TYPE_OPTIONS = [
  { value: '电子', label: '电子' },
  { value: '真人', label: '真人' },
  { value: '体育', label: '体育' },
  { value: '棋牌', label: '棋牌' },
]

const DETAIL_LINES: DetailLine[] = [
  {
    key: '1',
    brandName: 'am-2.bet(7252)',
    billMonth: '2026-08',
    currency: 'BRL',
    gameType: '电子',
    vendorName: 'PP电子(301)',
    betAmount: '480.05',
    validBet: '399.09',
    profitLoss: '177.09',
    commissionRate: '10.00%',
    billAmount: '17.70',
    vendorDiscount: '0.00%',
    afterRate: '10.00%',
    commissionAmount: '17.70',
    exchangeRate: '5.07',
    gameBillU: '3.49',
    status: '正常',
  },
  {
    key: '2',
    brandName: 'am-2.bet(7252)',
    billMonth: '2026-08',
    currency: 'BRL',
    gameType: '电子',
    vendorName: 'WG电子(13)',
    betAmount: '5,396.34',
    validBet: '5,396.34',
    profitLoss: '-57.50',
    commissionRate: '4.00%',
    billAmount: '0.00',
    vendorDiscount: '0.00%',
    afterRate: '4.00%',
    commissionAmount: '0.00',
    exchangeRate: '5.07',
    gameBillU: '0.00',
    status: '正常',
  },
  {
    key: '3',
    brandName: 'am-2.bet(7252)',
    billMonth: '2026-08',
    currency: 'BRL',
    gameType: '电子',
    vendorName: 'TADA电子(302)',
    betAmount: '458.30',
    validBet: '433.66',
    profitLoss: '117.03',
    commissionRate: '8.00%',
    billAmount: '9.36',
    vendorDiscount: '0.00%',
    afterRate: '8.00%',
    commissionAmount: '9.36',
    exchangeRate: '5.07',
    gameBillU: '1.84',
    status: '正常',
  },
  {
    key: '4',
    brandName: 'am-2.bet(7252)',
    billMonth: '2026-08',
    currency: 'BRL',
    gameType: '电子',
    vendorName: 'CQ9电子(316)',
    betAmount: '281.40',
    validBet: '251.78',
    profitLoss: '120.28',
    commissionRate: '8.00%',
    billAmount: '9.62',
    vendorDiscount: '0.00%',
    afterRate: '8.00%',
    commissionAmount: '9.62',
    exchangeRate: '5.07',
    gameBillU: '1.89',
    status: '正常',
  },
  {
    key: '5',
    brandName: 'am-2.bet(7252)',
    billMonth: '2026-08',
    currency: 'BRL',
    gameType: '电子',
    vendorName: 'JDB电子(310)',
    betAmount: '69.20',
    validBet: '65.91',
    profitLoss: '17.21',
    commissionRate: '8.00%',
    billAmount: '1.37',
    vendorDiscount: '0.00%',
    afterRate: '8.00%',
    commissionAmount: '1.37',
    exchangeRate: '5.07',
    gameBillU: '0.27',
    status: '正常',
  },
  {
    key: '6',
    brandName: 'am-2.bet(7252)',
    billMonth: '2026-08',
    currency: 'BRL',
    gameType: '电子',
    vendorName: 'PG电子(200)',
    betAmount: '52,739.75',
    validBet: '52,739.75',
    profitLoss: '6,127.10',
    commissionRate: '8.00%',
    billAmount: '490.16',
    vendorDiscount: '0.00%',
    afterRate: '8.00%',
    commissionAmount: '490.16',
    exchangeRate: '5.07',
    gameBillU: '96.67',
    status: '正常',
  },
]

function TipLabel({ label, tip }: { label: string; tip: ReactNode }) {
  return (
    <span className="site-bill-detail-metric-label">
      <Tooltip title={tip} placement="top">
        <QuestionCircleFilled className="site-bill-q-icon" />
      </Tooltip>
      {label}：
    </span>
  )
}

const TIP_CDN = 'CDN上限值=当月游戏账单*10%，超出自动免除；解析数/节点等级等资源名额不参与封顶'
const TIP_OTHER = (
  <div className="site-bill-q-tip-lines">
    <div>CDN(解析数+节点+IP):0.00</div>
    <div>埋点归因费用(ADJ可享受x折):0.00</div>
    <div>极光费用:0.00</div>
    <div>CPF验证费:0.00</div>
    <div>KYC验证费:0.00</div>
  </div>
)
const TIP_ADJUST = '数据来源:由财务每月5号前人工导入模板生成'
const TIP_TOTAL = '游戏账单+CDN流量费+线路维护费+其他费用+费用调整'
const TIP_REFERRAL = '按总计的金额计算推荐折扣:0.00'
const TIP_PAYABLE = '账单合计 + 推荐折扣'

interface Props {
  open: boolean
  record: SiteBillDetailSource | null
  onClose: () => void
}

export default function SiteBillDetailModal({ open, record, onClose }: Props) {
  const [brandId, setBrandId] = useState('')
  const [currency, setCurrency] = useState<string>()
  const [gameType, setGameType] = useState<string>()
  const [vendorName, setVendorName] = useState('')
  const [balance, setBalance] = useState('185.98')

  if (!record) return null

  const columns: ColumnsType<DetailLine> = [
    { title: '品牌名称(ID)', dataIndex: 'brandName', width: 140, align: 'center' },
    { title: '账单月份', dataIndex: 'billMonth', width: 100, align: 'center' },
    { title: '币种', dataIndex: 'currency', width: 80, align: 'center' },
    { title: '游戏类型', dataIndex: 'gameType', width: 90, align: 'center' },
    { title: '厂商名称(ID)', dataIndex: 'vendorName', width: 130, align: 'center' },
    { title: '投注金额', dataIndex: 'betAmount', width: 110, align: 'center' },
    { title: '有效投注', dataIndex: 'validBet', width: 110, sorter: true, align: 'center' },
    {
      title: '盈亏金额',
      dataIndex: 'profitLoss',
      width: 110,
      align: 'center',
      render: (v: string) => (v.startsWith('-') ? <span style={{ color: '#ff4d4f' }}>{v}</span> : v),
    },
    { title: '抽佣比例', dataIndex: 'commissionRate', width: 100, align: 'center' },
    { title: '账单金额', dataIndex: 'billAmount', width: 110, align: 'center' },
    { title: '厂商专属优惠', dataIndex: 'vendorDiscount', width: 120, align: 'center' },
    { title: '优惠后比例', dataIndex: 'afterRate', width: 110, align: 'center' },
    { title: '抽佣金额', dataIndex: 'commissionAmount', width: 110, align: 'center' },
    { title: '折算汇率', dataIndex: 'exchangeRate', width: 100, align: 'center' },
    { title: '游戏账单U', dataIndex: 'gameBillU', width: 110, align: 'center' },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      render: (v) => <span className="status-ok">{v}</span>,
    },
  ]

  const reset = () => {
    setBrandId('')
    setCurrency(undefined)
    setGameType(undefined)
    setVendorName('')
  }

  return (
    <Modal
      title="详情"
      open={open}
      onCancel={onClose}
      width="96%"
      style={{ maxWidth: 1560 }}
      centered
      destroyOnClose
      className="site-bill-detail-modal"
      footer={
        <div className="site-bill-detail-modal-footer">
          <Button onClick={onClose}>取消</Button>
        </div>
      }
    >
      <div className="site-bill-detail-meta">
        <span>
          <em>所属集团：</em>
          {record.groupName}
        </span>
        <span>
          <em>主站名称(ID)：</em>
          {record.brandName}
        </span>
        <span>
          <em>账单月份：</em>
          {record.billMonth}
        </span>
        <span>
          <em>账单状态：</em>
          {record.status}
        </span>
        <span className="site-bill-detail-balance">
          <em>站点余额：</em>
          {balance}
          <ReloadOutlined
            onClick={() => {
              setBalance('185.98')
              message.success('已刷新站点余额')
            }}
          />
        </span>
        <span>
          <em>站长备注：</em>
          {record.ownerRemark && record.ownerRemark !== '-' ? record.ownerRemark : ''}
        </span>
      </div>

      <div className="site-bill-detail-metrics">
        <span className="site-bill-detail-metric-line">
          游戏账单：<strong>104.16</strong>
        </span>
        <span className="site-bill-detail-metric site-bill-detail-metric-cdn">
          <span className="site-bill-detail-metric-line">
            <TipLabel label="CDN流量费" tip={TIP_CDN} />
            <strong>0.00</strong>
          </span>
          <small>(封顶规则本月已为您节约0.00)</small>
        </span>
        <span className="site-bill-detail-metric-line">
          线路维护费：<strong>3,000.00</strong>
        </span>
        <span className="site-bill-detail-metric-line">
          <TipLabel label="其他费用" tip={TIP_OTHER} />
          <strong>0.00</strong>
        </span>
        <span className="site-bill-detail-metric-line">
          <TipLabel label="费用调整" tip={TIP_ADJUST} />
          <strong>0.00</strong>
        </span>
        <span className="site-bill-detail-metric-line">
          <TipLabel label="账单合计" tip={TIP_TOTAL} />
          <strong>{record.payTotal || '3,104.16'}</strong>
        </span>
        <span className="site-bill-detail-metric-line">
          <TipLabel label="推荐折扣" tip={TIP_REFERRAL} />
          <strong>0.00(0.00%)</strong>
        </span>
        <span className="site-bill-detail-metric-line">
          <TipLabel label="实际需支付总额U" tip={TIP_PAYABLE} />
          <strong>{record.payTotal || '3,104.16'}</strong>
        </span>
      </div>

      <div className="site-bill-detail-filter">
        <div className="site-bill-detail-filter-left">
          <Space.Compact>
            <Select defaultValue="brandId" style={{ width: 100 }} options={[{ value: 'brandId', label: '品牌ID' }]} />
            <Input
              placeholder="请输入品牌ID"
              allowClear
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              style={{ width: 150 }}
            />
          </Space.Compact>
          <Select
            placeholder="币种"
            allowClear
            value={currency}
            onChange={setCurrency}
            options={FILTER_CURRENCY_OPTIONS}
            style={{ width: 120 }}
          />
          <Select
            placeholder="游戏类型"
            allowClear
            value={gameType}
            onChange={setGameType}
            options={GAME_TYPE_OPTIONS}
            style={{ width: 120 }}
          />
          <Space.Compact>
            <Select defaultValue="vendor" style={{ width: 100 }} options={[{ value: 'vendor', label: '厂商名称' }]} />
            <Input
              placeholder="请输入厂商名称"
              allowClear
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              style={{ width: 150 }}
            />
          </Space.Compact>
          <Button type="primary" onClick={() => message.success('已按条件筛选（原型）')}>
            搜索
          </Button>
          <Button onClick={reset}>重置</Button>
        </div>
        <Button icon={<UploadOutlined />} onClick={() => message.info('导出报表（原型）')}>
          导出报表
        </Button>
      </div>

      <Table
        size="middle"
        rowKey="key"
        className="site-bill-table"
        columns={columns}
        dataSource={DETAIL_LINES}
        scroll={{ x: 1900, y: 280 }}
        pagination={false}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row className="site-bill-detail-summary-row">
              <Table.Summary.Cell index={0} colSpan={7} align="center">
                小计
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center">
                <strong>6,501.21</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} colSpan={4} />
              <Table.Summary.Cell index={12} align="center">
                <strong>528.21</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={13} />
              <Table.Summary.Cell index={14} align="center">
                <strong>104.16</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={15} />
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <div className="site-bill-detail-note">*报表金额单位转换时可能存在尾数误差</div>
    </Modal>
  )
}
