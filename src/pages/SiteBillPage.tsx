import { useMemo, useState } from 'react'
import { InfoCircleOutlined, UploadOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Checkbox, DatePicker, Form, Input, Modal, Select, Space, Table, Tabs, Tooltip, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Key } from 'react'
import { FILTER_CURRENCY_OPTIONS } from '../components/CurrencyMultiSelect'
import SiteBillDetailModal, { type SiteBillDetailSource } from '../components/SiteBillDetailModal'
import dayjs from 'dayjs'

type BillTab =
  | 'pending-issue'
  | 'pending-check'
  | 'pending-pay'
  | 'dispute'
  | 'overdue'
  | 'paid'
  | 'bad-debt'
  | 'all'
  | 'detail'

interface BillRow {
  key: string
  brandName: string
  brandCount: number
  groupName: string
  companyName: string
  billMonth: string
  billType: string
  feeDetail: string
  payTotal: string
  badDebtTotal?: string
  lateFee: string
  fixedDiscount: string
  tierDiscount: string
  effectiveDiscount: string
  referralDiscount: string
  status: string
  overdueCountdown?: string
  autoConfirmCountdown?: string
  overdueDays?: string
  ownerRemark: string
  operateTime: string
  operator: string
}

interface DetailRow {
  key: string
  mainSite: string
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

const BILL_TABS: { key: BillTab; label: string }[] = [
  { key: 'pending-issue', label: '待下发' },
  { key: 'pending-check', label: '待核对' },
  { key: 'pending-pay', label: '待支付' },
  { key: 'dispute', label: '存在异议' },
  { key: 'overdue', label: '已逾期' },
  { key: 'paid', label: '已支付' },
  { key: 'bad-debt', label: '已坏账' },
  { key: 'all', label: '全部账单' },
  { key: 'detail', label: '账单明细' },
]

const BILL_STATUS_OPTIONS = [
  { value: '待下发', label: '待下发' },
  { value: '待核对', label: '待核对' },
  { value: '待支付', label: '待支付' },
  { value: '存在异议', label: '存在异议' },
  { value: '已逾期', label: '已逾期' },
  { value: '已支付', label: '已支付' },
  { value: '已坏账', label: '已坏账' },
]

const BRAND_FIELD_OPTIONS = [
  { value: 'brandId', label: '品牌ID' },
  { value: 'company', label: '所属公司' },
  { value: 'brandName', label: '品牌名称' },
]

const BILL_TYPE_OPTIONS = [
  { value: '每月账单', label: '每月账单' },
  { value: '一次性费用', label: '一次性费用' },
]

const BRAND_FIELD_PLACEHOLDER: Record<string, string> = {
  brandId: '请输入品牌ID',
  company: '请输入所属公司',
  brandName: '请输入品牌名称',
}

const GAME_TYPE_OPTIONS = [
  { value: '电子', label: '电子' },
  { value: '真人', label: '真人' },
  { value: '体育', label: '体育' },
  { value: '棋牌', label: '棋牌' },
]

const tipLateFee =
  '当月账单超过次月月底视为逾期，逾期每多1天则加收账单总额0.05%/天，上不封顶。(暂不收取)'
const tipCheck = '待核对: 每月月初6号 00:00:00 之后可点击直接确认无误'
const tipStatus = '待核对:每月月初6号 00:00:00 之后可点击直接确认无误'

const PENDING_ISSUE_ROWS: BillRow[] = [
  {
    key: 'pi1',
    brandName: 'am-2.bet(7252)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-08',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '3,104.16',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '待下发',
    ownerRemark: '-',
    operateTime: '2026-08-13 15:42:33',
    operator: 'system',
  },
  {
    key: 'pi2',
    brandName: 'am-1.bet(7213)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-08',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '3,238.22',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '待下发',
    ownerRemark: '-',
    operateTime: '2026-08-13 15:42:33',
    operator: 'system',
  },
  {
    key: 'pi3',
    brandName: 'cianopg(6153)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-08',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '3,050.74',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '待下发',
    ownerRemark: '-',
    operateTime: '2026-08-13 15:42:33',
    operator: 'system',
  },
  {
    key: 'pi4',
    brandName: 'azulpg(6152)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-08',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '3,018.09',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '待下发',
    ownerRemark: '-',
    operateTime: '2026-08-13 15:42:33',
    operator: 'system',
  },
  {
    key: 'pi5',
    brandName: 'baronesapg(6132)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-08',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '3,141.53',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '待下发',
    ownerRemark: '-',
    operateTime: '2026-08-13 15:42:33',
    operator: 'system',
  },
]

const PENDING_CHECK_ROWS: BillRow[] = [
  {
    key: 'pc1',
    brandName: 'am-2.bet(7252)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-07',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '2,980.45',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '待核对',
    autoConfirmCountdown: '2天 14:22:08',
    ownerRemark: '-',
    operateTime: '2026-08-06 00:00:12',
    operator: 'system',
  },
  {
    key: 'pc2',
    brandName: 'winmax(8831)',
    brandCount: 2,
    groupName: '伯乐',
    companyName: '星辉公司',
    billMonth: '2026-07',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '5,612.80',
    lateFee: '0.00',
    fixedDiscount: '1.50%',
    tierDiscount: '0.80%',
    effectiveDiscount: '1.50%',
    referralDiscount: '0',
    status: '待核对',
    autoConfirmCountdown: '2天 14:22:08',
    ownerRemark: '金额待确认',
    operateTime: '2026-08-06 00:01:05',
    operator: 'system',
  },
]

const PENDING_PAY_ROWS: BillRow[] = [
  {
    key: 'pp1',
    brandName: 'am-2.bet(7252)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-06',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '2,756.33',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '待支付',
    overdueCountdown: '18天 06:12:40',
    ownerRemark: '-',
    operateTime: '2026-07-06 10:22:15',
    operator: 'cooper',
  },
  {
    key: 'pp2',
    brandName: 'novapg(5928)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-06',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '4,102.90',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '100',
    status: '待支付',
    overdueCountdown: '18天 06:12:40',
    ownerRemark: '本月有推荐折扣',
    operateTime: '2026-07-06 11:05:48',
    operator: 'cooper',
  },
  {
    key: 'pp3',
    brandName: 'luck7(4410)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '远航公司',
    billMonth: '2026-05',
    billType: '开站账单',
    feeDetail: '开站费用',
    payTotal: '1,000.00',
    lateFee: '0.00',
    fixedDiscount: '0.00%',
    tierDiscount: '0.00%',
    effectiveDiscount: '0.00%',
    referralDiscount: '0',
    status: '待支付',
    overdueCountdown: '3天 02:40:11',
    ownerRemark: '-',
    operateTime: '2026-06-20 16:33:02',
    operator: 'yidaoam2',
  },
]

const DISPUTE_ROWS: BillRow[] = [
  {
    key: 'ds1',
    brandName: 'am-2.bet(7252)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-05',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '3,455.12',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '存在异议',
    autoConfirmCountdown: '-',
    ownerRemark: '厂商抽佣比例有误',
    operateTime: '2026-06-18 09:41:27',
    operator: 'cooper',
  },
  {
    key: 'ds2',
    brandName: 'royalpg(7701)',
    brandCount: 3,
    groupName: '伯乐',
    companyName: '星辉公司',
    billMonth: '2026-04',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '8,920.66',
    lateFee: '12.50',
    fixedDiscount: '1.20%',
    tierDiscount: '0.60%',
    effectiveDiscount: '1.20%',
    referralDiscount: '0',
    status: '存在异议',
    autoConfirmCountdown: '-',
    ownerRemark: '阶梯优惠未生效',
    operateTime: '2026-05-22 14:18:03',
    operator: 'yidaoam2',
  },
]

const OVERDUE_ROWS: BillRow[] = [
  {
    key: 'od1',
    brandName: 'novapg(5928)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-03',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '2,210.45',
    lateFee: '33.16',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '已逾期',
    overdueDays: '30天',
    ownerRemark: '-',
    operateTime: '2026-05-01 00:00:01',
    operator: 'system',
  },
  {
    key: 'od2',
    brandName: 'winmax(8831)',
    brandCount: 2,
    groupName: '伯乐',
    companyName: '星辉公司',
    billMonth: '2026-02',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '6,780.00',
    lateFee: '203.40',
    fixedDiscount: '1.50%',
    tierDiscount: '0.80%',
    effectiveDiscount: '1.50%',
    referralDiscount: '0',
    status: '已逾期',
    overdueDays: '60天',
    ownerRemark: '催收中',
    operateTime: '2026-04-01 00:00:01',
    operator: 'system',
  },
]

const PAID_ROWS: BillRow[] = [
  {
    key: 'pd1',
    brandName: 'am-2.bet(7252)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-07',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '3,120.71',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '已支付',
    ownerRemark: '-',
    operateTime: '2026-08-12 13:47:26',
    operator: 'yidaoam2',
  },
  {
    key: 'pd2',
    brandName: 'novapg(5928)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2026-06',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '2,856.40',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.50%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '已支付',
    ownerRemark: '-',
    operateTime: '2026-07-10 09:12:08',
    operator: 'cooper',
  },
  {
    key: 'pd3',
    brandName: 'luck7(4410)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '远航公司',
    billMonth: '2026-05',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '1,532.18',
    lateFee: '0.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.30%',
    effectiveDiscount: '1.00%',
    referralDiscount: '50',
    status: '已支付',
    ownerRemark: '-',
    operateTime: '2026-06-15 18:20:44',
    operator: 'yidaoam2',
  },
]

const BAD_DEBT_ROWS: BillRow[] = [
  {
    key: 'bd1',
    brandName: 'oldsite(2205)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '-',
    billMonth: '2025-12',
    billType: '每月账单',
    feeDetail: '三方游戏费用',
    payTotal: '1,860.00',
    badDebtTotal: '1,860.00',
    lateFee: '279.00',
    fixedDiscount: '1.00%',
    tierDiscount: '0.00%',
    effectiveDiscount: '1.00%',
    referralDiscount: '0',
    status: '已坏账',
    ownerRemark: '长期未支付转入坏账',
    operateTime: '2026-04-30 23:59:59',
    operator: 'system',
  },
  {
    key: 'bd2',
    brandName: 'sunset(1188)',
    brandCount: 1,
    groupName: '伯乐',
    companyName: '远航公司',
    billMonth: '2025-11',
    billType: '开站账单',
    feeDetail: '开站费用',
    payTotal: '1,000.00',
    badDebtTotal: '1,000.00',
    lateFee: '150.00',
    fixedDiscount: '0.00%',
    tierDiscount: '0.00%',
    effectiveDiscount: '0.00%',
    referralDiscount: '0',
    status: '已坏账',
    ownerRemark: '站点已注销',
    operateTime: '2026-03-31 23:59:59',
    operator: 'cooper',
  },
]

const ALL_ROWS: BillRow[] = [
  ...PENDING_ISSUE_ROWS,
  ...PENDING_CHECK_ROWS,
  ...PENDING_PAY_ROWS,
  ...DISPUTE_ROWS,
  ...OVERDUE_ROWS,
  ...PAID_ROWS,
  ...BAD_DEBT_ROWS,
]

const DETAIL_ROWS: DetailRow[] = [
  {
    key: 'd1',
    mainSite: 'am-2.bet(7252)',
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
    key: 'd2',
    mainSite: 'am-2.bet(7252)',
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
    key: 'd3',
    mainSite: 'am-2.bet(7252)',
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
    key: 'd4',
    mainSite: 'am-2.bet(7252)',
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
    gameBillU: '1.90',
    status: '正常',
  },
  {
    key: 'd5',
    mainSite: 'am-2.bet(7252)',
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
    key: 'd6',
    mainSite: 'am-2.bet(7252)',
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
    gameBillU: '96.68',
    status: '正常',
  },
  {
    key: 'd7',
    mainSite: 'am-1.bet(7213)',
    brandName: 'am-1.bet(7213)',
    billMonth: '2026-08',
    currency: 'BRL',
    gameType: '电子',
    vendorName: 'TADA电子(302)',
    betAmount: '1,121.60',
    validBet: '1,033.16',
    profitLoss: '-269.64',
    commissionRate: '8.00%',
    billAmount: '0.00',
    vendorDiscount: '0.00%',
    afterRate: '8.00%',
    commissionAmount: '0.00',
    exchangeRate: '5.07',
    gameBillU: '0.00',
    status: '正常',
  },
  {
    key: 'd8',
    mainSite: 'am-1.bet(7213)',
    brandName: 'am-1.bet(7213)',
    billMonth: '2026-08',
    currency: 'BRL',
    gameType: '电子',
    vendorName: 'PP电子(301)',
    betAmount: '728.70',
    validBet: '689.19',
    profitLoss: '61.72',
    commissionRate: '10.00%',
    billAmount: '6.17',
    vendorDiscount: '0.00%',
    afterRate: '10.00%',
    commissionAmount: '6.17',
    exchangeRate: '5.07',
    gameBillU: '1.22',
    status: '正常',
  },
]

const DETAIL_GAME_BILL_TOTAL = '5,256.65'

export type SiteBillMode = 'merchant' | 'master'

type BillActionLabel = '核对无误' | '存在异议' | '确认付款' | '编辑' | '退回待核对' | '已坏账' | '详情'

const TAB_STATUS: Record<Exclude<BillTab, 'detail' | 'all'>, string> = {
  'pending-issue': '待下发',
  'pending-check': '待核对',
  'pending-pay': '待支付',
  dispute: '存在异议',
  overdue: '已逾期',
  paid: '已支付',
  'bad-debt': '已坏账',
}

const BILL_OPERATOR = 'cooper'

function getBillActions(mode: SiteBillMode, status: string): BillActionLabel[] {
  if (status === '待核对' && mode === 'merchant') {
    return ['核对无误', '存在异议', '详情']
  }
  if (status === '存在异议') {
    return ['编辑', '详情', '退回待核对']
  }
  if (mode === 'master' && status === '已逾期') {
    return ['确认付款', '已坏账', '详情']
  }
  if (mode === 'master' && (status === '待支付' || status === '已坏账')) {
    return ['确认付款', '详情']
  }
  return ['详情']
}

function nowText() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

function stampBill(row: BillRow, extra: Partial<BillRow>, operator: string): BillRow {
  return {
    ...row,
    ...extra,
    operateTime: nowText(),
    operator,
  }
}

const EXCHANGE_RATE_ROWS = [
  { key: '1', base: 'USDT', target: 'MXN', rate: '17.34' },
  { key: '2', base: 'USDT', target: 'EUR', rate: '0.86' },
  { key: '3', base: 'USDT', target: 'RUB', rate: '78.34' },
  { key: '4', base: 'USDT', target: 'MMK', rate: '4,449.00' },
  { key: '5', base: 'USDT', target: 'AED', rate: '3.67' },
  { key: '6', base: 'USDT', target: 'HKD', rate: '7.84' },
  { key: '7', base: 'USDT', target: 'PHP', rate: '61.25' },
  { key: '8', base: 'USDT', target: 'BTC 1:100000', rate: '6.75000000' },
  { key: '9', base: 'USDT', target: 'ETH 1:10000', rate: '6.75000000' },
  { key: '10', base: 'USDT', target: 'USDT 1:7', rate: '6.75000000' },
  { key: '11', base: 'USDT', target: 'BRL', rate: '5.42' },
  { key: '12', base: 'USDT', target: 'VND', rate: '25,450.00' },
  { key: '13', base: 'USDT', target: 'NGN', rate: '1,580.00' },
  { key: '14', base: 'USDT', target: 'PEN', rate: '3.72' },
  { key: '15', base: 'USDT', target: 'PYG', rate: '7,850.00' },
  { key: '16', base: 'USDT', target: 'USDC', rate: '1.00' },
  { key: '17', base: 'USDT', target: 'TRX', rate: '3.85' },
]

function InfoTitle({ title, tip }: { title: string; tip: string }) {
  return (
    <span>
      {title}{' '}
      <Tooltip title={tip}>
        <InfoCircleOutlined style={{ color: '#1677ff' }} />
      </Tooltip>
    </span>
  )
}

export default function SiteBillPage({ mode = 'merchant' }: { mode?: SiteBillMode }) {
  const [subTab, setSubTab] = useState<BillTab>('pending-issue')
  const [bills, setBills] = useState<BillRow[]>(() => ALL_ROWS.map((r) => ({ ...r })))
  const [actionKind, setActionKind] = useState<Exclude<BillActionLabel, '详情'> | null>(null)
  const [actionRows, setActionRows] = useState<BillRow[]>([])
  const [editForm] = Form.useForm()
  const [remarkForm] = Form.useForm()
  const [billMonth, setBillMonth] = useState<dayjs.Dayjs | null>(null)
  const [brandField, setBrandField] = useState('brandId')
  const [brandId, setBrandId] = useState('')
  const [billType, setBillType] = useState<string>()
  const [currency, setCurrency] = useState<string>()
  const [billStatus, setBillStatus] = useState<string>()
  const [mainSiteId, setMainSiteId] = useState('')
  const [gameType, setGameType] = useState<string>()
  const [vendorName, setVendorName] = useState('')
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])
  const [filterExpanded, setFilterExpanded] = useState(true)
  const [rateOpen, setRateOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailRecord, setDetailRecord] = useState<SiteBillDetailSource | null>(null)

  const isDetail = subTab === 'detail'
  const isPendingIssue = subTab === 'pending-issue'
  const isMaster = mode === 'master'
  const showBatch = (subTab === 'pending-check' && !isMaster) || (subTab === 'pending-pay' && isMaster)

  const billRows = useMemo(() => {
    if (subTab === 'detail') return [] as BillRow[]
    if (subTab === 'all') {
      return billStatus ? bills.filter((r) => r.status === billStatus) : bills
    }
    return bills.filter((r) => r.status === TAB_STATUS[subTab])
  }, [bills, billStatus, subTab])

  const reset = () => {
    setBillMonth(null)
    setBrandField('brandId')
    setBrandId('')
    setBillType(undefined)
    setCurrency(undefined)
    setBillStatus(undefined)
    setMainSiteId('')
    setGameType(undefined)
    setVendorName('')
  }

  const search = () => message.success('已按条件筛选（原型本地数据）')

  const openDetail = (row: BillRow) => {
    setDetailRecord({
      brandName: row.brandName,
      groupName: row.groupName,
      billMonth: row.billMonth,
      status: row.status,
      ownerRemark: row.ownerRemark,
      payTotal: row.payTotal,
    })
    setDetailOpen(true)
  }

  const closeAction = () => {
    setActionKind(null)
    setActionRows([])
    remarkForm.resetFields()
    editForm.resetFields()
  }

  const openAction = (kind: Exclude<BillActionLabel, '详情'>, rows: BillRow[]) => {
    if (!rows.length) {
      message.warning('请先选择账单')
      return
    }
    setActionKind(kind)
    setActionRows(rows)
    if (kind === '编辑' && rows[0]) {
      const row = rows[0]
      editForm.setFieldsValue({
        payTotal: row.payTotal,
        lateFee: row.lateFee,
        referralDiscount: row.referralDiscount,
        feeDetail: row.feeDetail,
        ownerRemark: row.ownerRemark === '-' ? '' : row.ownerRemark,
      })
    }
  }

  const applyAction = async () => {
    if (!actionKind || !actionRows.length) return
    const keys = new Set(actionRows.map((r) => r.key))

    if (actionKind === '编辑') {
      const values = await editForm.validateFields()
      setBills((prev) =>
        prev.map((r) =>
          keys.has(r.key)
            ? stampBill(
                r,
                {
                  payTotal: values.payTotal,
                  lateFee: values.lateFee,
                  referralDiscount: values.referralDiscount,
                  feeDetail: values.feeDetail,
                  ownerRemark: values.ownerRemark?.trim() || '-',
                },
                BILL_OPERATOR,
              )
            : r,
        ),
      )
      message.success('账单已保存')
      closeAction()
      return
    }

    let remark = ''
    if (actionKind === '存在异议' || actionKind === '已坏账') {
      const values = await remarkForm.validateFields()
      remark = String(values.remark || '').trim()
    }

    setBills((prev) =>
      prev.map((r) => {
        if (!keys.has(r.key)) return r
        if (actionKind === '核对无误') {
          return stampBill(
            r,
            { status: '待支付', autoConfirmCountdown: undefined, overdueCountdown: '30天 00:00:00' },
            BILL_OPERATOR,
          )
        }
        if (actionKind === '存在异议') {
          return stampBill(r, { status: '存在异议', ownerRemark: remark, autoConfirmCountdown: '-' }, BILL_OPERATOR)
        }
        if (actionKind === '确认付款') {
          return stampBill(
            r,
            {
              status: '已支付',
              overdueCountdown: undefined,
              overdueDays: undefined,
              badDebtTotal: undefined,
            },
            BILL_OPERATOR,
          )
        }
        if (actionKind === '退回待核对') {
          return stampBill(
            r,
            { status: '待核对', autoConfirmCountdown: '2天 14:22:08', overdueCountdown: undefined },
            BILL_OPERATOR,
          )
        }
        if (actionKind === '已坏账') {
          return stampBill(
            r,
            {
              status: '已坏账',
              badDebtTotal: r.payTotal,
              ownerRemark: remark || r.ownerRemark,
              overdueCountdown: undefined,
            },
            BILL_OPERATOR,
          )
        }
        return r
      }),
    )

    const successText: Record<Exclude<BillActionLabel, '详情' | '编辑'>, string> = {
      核对无误: '已核对无误，账单进入待支付',
      存在异议: '已提交异议，账单进入存在异议',
      确认付款: '已确认付款，账单进入已支付',
      退回待核对: '已退回待核对',
      已坏账: '已移入已坏账',
    }
    message.success(successText[actionKind])
    setSelectedKeys((prev) => prev.filter((k) => !keys.has(String(k))))
    closeAction()
  }

  const billColumns: ColumnsType<BillRow> = [
    {
      title: '品牌名称(ID)',
      dataIndex: 'brandName',
      width: 150,
      sorter: true,
      align: isPendingIssue ? 'left' : undefined,
    },
    {
      title: '品牌数',
      dataIndex: 'brandCount',
      width: 80,
      align: 'center',
      render: (v) => <a>{v}</a>,
    },
    { title: '所属集团', dataIndex: 'groupName', width: 100, align: 'center' },
    { title: '所属公司', dataIndex: 'companyName', width: 100, align: 'center' },
    { title: '账单月份', dataIndex: 'billMonth', width: 100, align: 'center' },
    { title: '账单类型', dataIndex: 'billType', width: 100, align: 'center' },
    { title: '费用明细', dataIndex: 'feeDetail', width: 120, align: 'center' },
    ...(subTab === 'bad-debt'
      ? [{ title: '坏账总额U', dataIndex: 'badDebtTotal', width: 120, align: 'center' as const } as ColumnsType<BillRow>[number]]
      : []),
    { title: '实际支付总额U', dataIndex: 'payTotal', width: 130, align: 'center' },
    {
      title: <InfoTitle title="滞纳金" tip={tipLateFee} />,
      dataIndex: 'lateFee',
      width: 100,
      align: 'center',
    },
    { title: '三方固定优惠', dataIndex: 'fixedDiscount', width: 120, align: 'center' },
    { title: '本月三方阶梯优惠', dataIndex: 'tierDiscount', width: 140, align: 'center' },
    { title: '本月三方生效优惠', dataIndex: 'effectiveDiscount', width: 140, align: 'center' },
    { title: '推荐折扣', dataIndex: 'referralDiscount', width: 100, align: 'center' },
    {
      title: <InfoTitle title="账单状态" tip={tipStatus} />,
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (v: string) => {
        if (v === '已支付' || v === '正常') return <span className="status-ok">{v}</span>
        if (v === '已逾期' || v === '已坏账' || v === '存在异议') return <span style={{ color: '#ff4d4f' }}>{v}</span>
        return v
      },
    },
    ...(subTab === 'pending-pay'
      ? [{ title: '逾期倒计时', dataIndex: 'overdueCountdown', width: 130, align: 'center' as const, render: (v?: string) => v || '-' } as ColumnsType<BillRow>[number]]
      : []),
    ...(subTab === 'pending-check' || subTab === 'dispute'
      ? [{ title: '自动无误倒数', dataIndex: 'autoConfirmCountdown', width: 130, align: 'center' as const, render: (v?: string) => v || '-' } as ColumnsType<BillRow>[number]]
      : []),
    ...(subTab === 'overdue'
      ? [{ title: '已逾期天数', dataIndex: 'overdueDays', width: 110, align: 'center' as const, render: (v?: string) => v || '-' } as ColumnsType<BillRow>[number]]
      : []),
    { title: '站长备注', dataIndex: 'ownerRemark', width: 110, align: 'center' },
    { title: '操作时间', dataIndex: 'operateTime', width: 160, align: 'center' },
    { title: '操作人', dataIndex: 'operator', width: 100, align: 'center' },
    {
      title: '操作',
      key: 'action',
      width: 220,
      align: 'center',
      render: (_, row) => {
        const actions = getBillActions(mode, row.status)
        return (
          <div className="action-links">
            {actions.map((label) => (
              <Button
                key={label}
                type="link"
                size="small"
                className="action-link"
                onClick={() => {
                  if (label === '详情') {
                    openDetail(row)
                    return
                  }
                  openAction(label, [row])
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        )
      },
    },
  ]

  const detailColumns: ColumnsType<DetailRow> = [
    { title: '主站名称(ID)', dataIndex: 'mainSite', width: 140, align: 'center' },
    { title: '品牌名称(ID)', dataIndex: 'brandName', width: 140, align: 'center' },
    { title: '账单月份', dataIndex: 'billMonth', width: 100, sorter: true, align: 'center' },
    { title: '币种', dataIndex: 'currency', width: 80, align: 'center' },
    { title: '游戏类型', dataIndex: 'gameType', width: 90, align: 'center' },
    { title: '厂商名称(ID)', dataIndex: 'vendorName', width: 130, align: 'center' },
    { title: '投注金额', dataIndex: 'betAmount', width: 110, align: 'center' },
    { title: '有效投注', dataIndex: 'validBet', width: 110, align: 'center' },
    {
      title: '盈亏金额',
      dataIndex: 'profitLoss',
      width: 110,
      sorter: true,
      align: 'center',
      render: (v: string) => (v.startsWith('-') ? <span style={{ color: '#ff4d4f' }}>{v}</span> : v),
    },
    { title: '抽佣比例', dataIndex: 'commissionRate', width: 100, sorter: true, align: 'center' },
    { title: '账单金额', dataIndex: 'billAmount', width: 110, sorter: true, align: 'center' },
    { title: '厂商专属优惠', dataIndex: 'vendorDiscount', width: 120, sorter: true, align: 'center' },
    { title: '优惠后比例', dataIndex: 'afterRate', width: 110, sorter: true, align: 'center' },
    { title: '抽佣金额', dataIndex: 'commissionAmount', width: 110, sorter: true, align: 'center' },
    { title: '折算汇率', dataIndex: 'exchangeRate', width: 100, sorter: true, align: 'center' },
    { title: '游戏账单U', dataIndex: 'gameBillU', width: 110, sorter: true, align: 'center' },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      sorter: true,
      align: 'center',
      render: (v) => <span className="status-ok">{v}</span>,
    },
  ]

  return (
    <div className="org-page-panel site-bill-page">
      <Tabs
        className="site-open-tabs"
        activeKey={subTab}
        onChange={(k) => {
          setSubTab(k as BillTab)
          setSelectedKeys([])
        }}
        items={BILL_TABS.map((t) => ({
          key: t.key,
          label:
            t.key === 'pending-check' ? (
              <Tooltip title={tipCheck}>
                <span>{t.label}</span>
              </Tooltip>
            ) : (
              t.label
            ),
        }))}
      />

      <div className="site-open-filter">
        {filterExpanded || isDetail ? (
          <div className="site-open-filter-row site-open-filter-row-between">
            <div className="site-open-filter-row">
              <DatePicker
                picker="month"
                placeholder={isPendingIssue ? '选择账单月份' : isDetail ? '账单月份' : '账单月份'}
                value={billMonth}
                onChange={setBillMonth}
                style={{ width: 140 }}
              />
              {isDetail ? (
                <>
                  <Space.Compact>
                    <Select defaultValue="mainSiteId" style={{ width: 100 }} options={[{ value: 'mainSiteId', label: '主站ID' }]} />
                    <Input
                      placeholder="请输入主站ID"
                      allowClear
                      value={mainSiteId}
                      onChange={(e) => setMainSiteId(e.target.value)}
                      style={{ width: 150 }}
                    />
                  </Space.Compact>
                  <Select
                    placeholder="币种"
                    allowClear
                    value={currency}
                    onChange={setCurrency}
                    options={FILTER_CURRENCY_OPTIONS}
                    style={{ width: 140 }}
                  />
                  <Select
                    placeholder="游戏类型"
                    allowClear
                    value={gameType}
                    onChange={setGameType}
                    options={GAME_TYPE_OPTIONS}
                    style={{ width: 120 }}
                  />
                  <Input
                    placeholder="请输入厂商名称"
                    allowClear
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    style={{ width: 160 }}
                  />
                </>
              ) : (
                <>
                  <Space.Compact>
                    <Select
                      value={brandField}
                      onChange={setBrandField}
                      style={{ width: 110 }}
                      options={BRAND_FIELD_OPTIONS}
                    />
                    <Input
                      placeholder={BRAND_FIELD_PLACEHOLDER[brandField]}
                      allowClear
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      style={{ width: 150 }}
                    />
                  </Space.Compact>
                  {(subTab === 'paid' || subTab === 'all') && (
                    <Select
                      placeholder="每月账单"
                      allowClear
                      value={billType}
                      onChange={setBillType}
                      options={BILL_TYPE_OPTIONS}
                      style={{ width: 130 }}
                    />
                  )}
                  <Select
                    placeholder={isPendingIssue ? '币种' : '站点币种'}
                    allowClear
                    value={currency}
                    onChange={setCurrency}
                    options={FILTER_CURRENCY_OPTIONS}
                    style={{ width: 140 }}
                  />
                  {subTab === 'all' && (
                    <Select
                      placeholder="账单状态"
                      allowClear
                      value={billStatus}
                      onChange={setBillStatus}
                      options={BILL_STATUS_OPTIONS}
                      style={{ width: 120 }}
                    />
                  )}
                </>
              )}
              <Button type="primary" onClick={search}>
                搜索
              </Button>
              <Button onClick={reset}>重置</Button>
            </div>
            <div className="site-open-filter-actions">
              <Button type="primary" onClick={() => setRateOpen(true)}>
                查看汇率
              </Button>
              {(subTab === 'all' || isDetail || subTab === 'paid') && (
                <Button icon={<UploadOutlined />} onClick={() => message.info('导出报表（原型）')}>
                  导出报表
                </Button>
              )}
            </div>
          </div>
        ) : null}
        {!isDetail ? (
          <div
            className="site-open-filter-toggle"
            onClick={() => setFilterExpanded((v) => !v)}
            title={filterExpanded ? '收起筛选' : '展开筛选'}
          >
            <DownOutlined style={{ transform: filterExpanded ? 'rotate(180deg)' : undefined }} />
          </div>
        ) : null}
      </div>

      {isDetail ? (
        <Table
          size="middle"
          rowKey="key"
          className="site-bill-table site-bill-detail-table"
          columns={detailColumns}
          dataSource={DETAIL_ROWS}
          scroll={{ x: 2100 }}
          pagination={false}
          locale={{ emptyText: '暂无数据' }}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row className="site-bill-detail-summary-row">
                <Table.Summary.Cell index={0} colSpan={15} />
                <Table.Summary.Cell index={15} align="center">
                  <strong>{DETAIL_GAME_BILL_TOTAL}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={16} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      ) : (
        <Table
          size="middle"
          rowKey="key"
          className="site-bill-table"
          columns={billColumns}
          dataSource={billRows}
          scroll={{ x: 2000 }}
          pagination={false}
          rowSelection={
            showBatch
              ? {
                  selectedRowKeys: selectedKeys,
                  onChange: setSelectedKeys,
                }
              : undefined
          }
          locale={{ emptyText: '暂无数据' }}
        />
      )}

      <div className={`org-table-footer site-bill-footer${isPendingIssue ? ' site-bill-footer-issue' : ''}${isDetail ? ' site-bill-footer-detail' : ''}`}>
        {showBatch ? (
          <div className="site-open-batch-bar">
            <Checkbox
              checked={selectedKeys.length > 0 && selectedKeys.length === billRows.length && billRows.length > 0}
              indeterminate={selectedKeys.length > 0 && selectedKeys.length < billRows.length}
              onChange={(e) => setSelectedKeys(e.target.checked ? billRows.map((r) => r.key) : [])}
            >
              全选当前页
            </Checkbox>
            <Button
              size="small"
              onClick={() => {
                const rows = billRows.filter((r) => selectedKeys.includes(r.key))
                openAction(subTab === 'pending-check' ? '核对无误' : '确认付款', rows)
              }}
            >
              {subTab === 'pending-check' ? '批量核对无误' : '批量确认付款'}
            </Button>
            <span className="site-open-footer-stat">
              已选择 {selectedKeys.length} 条数据 共 {billRows.length} 条
            </span>
          </div>
        ) : isPendingIssue || isDetail ? null : (
          <span>共 {billRows.length} 条</span>
        )}
        {!isDetail && (subTab === 'paid' || subTab === 'all' || isPendingIssue) ? (
          <span className="site-bill-note">注：账单金额为详情弹窗中本账单合计，单位U</span>
        ) : null}
        {isDetail ? (
          <div className="site-bill-detail-notes">
            <span className="site-bill-note">*报表金额单位转换时可能存在尾数误差</span>
            <span className="site-bill-note">注：账单金额为抽佣金额按折算汇率换算后的游戏账单，单位U</span>
          </div>
        ) : null}
      </div>

      <Modal
        title="查看汇率"
        open={rateOpen}
        onCancel={() => setRateOpen(false)}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={() => setRateOpen(false)}>
              关闭
            </Button>
          </div>
        }
        width={560}
        centered
        destroyOnClose
        className="site-bill-rate-modal"
      >
        <Table
          size="middle"
          rowKey="key"
          pagination={false}
          scroll={{ y: 360 }}
          dataSource={EXCHANGE_RATE_ROWS}
          columns={[
            { title: '基础币种', dataIndex: 'base', align: 'center' },
            { title: '兑换币种', dataIndex: 'target', align: 'center' },
            { title: '站点汇率', dataIndex: 'rate', align: 'center' },
          ]}
        />
      </Modal>

      <SiteBillDetailModal
        open={detailOpen}
        record={detailRecord}
        onClose={() => {
          setDetailOpen(false)
          setDetailRecord(null)
        }}
      />

      <Modal
        title={actionKind || '操作'}
        open={!!actionKind}
        onCancel={closeAction}
        centered
        destroyOnClose
        className="site-action-modal"
        footer={
          <div className="site-action-modal-footer">
            <Button onClick={closeAction}>取消</Button>
            <Button type="primary" onClick={() => void applyAction()}>
              确认
            </Button>
          </div>
        }
      >
        {actionKind === '编辑' ? (
          <Form form={editForm} layout="vertical" className="site-action-form">
            <div className="site-action-confirm-text">
              品牌：{actionRows[0]?.brandName}，账单月份：{actionRows[0]?.billMonth}
            </div>
            <Form.Item name="feeDetail" label="费用明细" rules={[{ required: true, message: '请输入费用明细' }]}>
              <Input placeholder="请输入费用明细" />
            </Form.Item>
            <Form.Item name="payTotal" label="实际支付总额U" rules={[{ required: true, message: '请输入实际支付总额' }]}>
              <Input placeholder="请输入实际支付总额U" />
            </Form.Item>
            <Form.Item name="lateFee" label="滞纳金" rules={[{ required: true, message: '请输入滞纳金' }]}>
              <Input placeholder="请输入滞纳金" />
            </Form.Item>
            <Form.Item name="referralDiscount" label="推荐折扣" rules={[{ required: true, message: '请输入推荐折扣' }]}>
              <Input placeholder="请输入推荐折扣" />
            </Form.Item>
            <Form.Item name="ownerRemark" label="站长备注">
              <Input.TextArea placeholder="请输入备注" maxLength={200} showCount rows={3} />
            </Form.Item>
          </Form>
        ) : (
          <>
            <div className="site-action-confirm-text">
              {actionRows.length > 1
                ? `已选择 ${actionRows.length} 条账单`
                : `品牌：${actionRows[0]?.brandName}，账单月份：${actionRows[0]?.billMonth}，当前状态：${actionRows[0]?.status}`}
              {actionKind === '核对无误' ? '。确认后账单将进入「待支付」。' : ''}
              {actionKind === '存在异议' ? '。提交后账单将进入「存在异议」。' : ''}
              {actionKind === '确认付款' ? '。确认后账单状态将变更为「已支付」，并进入已支付列表。' : ''}
              {actionKind === '退回待核对' ? '。确认后账单将退回「待核对」，站点需重新核对。' : ''}
              {actionKind === '已坏账' ? '。确认后账单将移入「已坏账」列表。' : ''}
            </div>
            {actionKind === '存在异议' || actionKind === '已坏账' ? (
              <Form form={remarkForm} layout="vertical" className="site-action-form">
                <Form.Item
                  name="remark"
                  label={actionKind === '已坏账' ? '备注' : '异议说明'}
                  rules={[{ required: true, message: actionKind === '已坏账' ? '请输入备注' : '请输入异议说明' }]}
                >
                  <Input.TextArea
                    placeholder={actionKind === '已坏账' ? '请输入移入已坏账的备注' : '请输入异议原因，将写入站长备注'}
                    maxLength={200}
                    showCount
                    rows={3}
                  />
                </Form.Item>
              </Form>
            ) : null}
          </>
        )}
      </Modal>
    </div>
  )
}
