export const ACTIVITY_TEMPLATE_OPTIONS = [
  '首存活动',
  '次存活动',
  '免费旋转',
  '指定日期存款',
  '游戏负盈利',
  '大转盘',
  '红包雨',
  '每日竞赛',
]

export const PAY_CURRENCY_TABS = ['CNY', 'MYR', 'PHP', 'USDT', 'USD', 'KVND', 'VND', 'PKR', 'INR', 'KRW']

export const VENUE_TYPE_OPTIONS = [
  { value: '彩票', label: '彩票' },
  { value: '电子', label: '电子' },
  { value: '真人', label: '真人' },
  { value: '体育', label: '体育' },
  { value: '棋牌', label: '棋牌' },
]

export const STATUS_OPTIONS = [
  { value: '启用', label: '启用' },
  { value: '禁用', label: '禁用' },
]

export const VENUE_ROWS = Array.from({ length: 10 }, (_, i) => ({
  key: `venue-${i + 1}`,
  venueId: `1821072244047${131314 + i}`,
  venueName: 'WinTo彩票',
  venueType: '彩票',
  accessType: ['数据源', '场馆', '游戏'][i % 3],
  venueCode: 'ACELT',
  authGames: 86,
  negRate: '12.00%',
  turnoverRate: '12.00%',
  status: '启用',
  operateTime: '2025-04-14 06:04:53',
  operator: 'superAdmin02',
}))

export const DEPOSIT_ROWS = Array.from({ length: 10 }, (_, i) => ({
  key: `deposit-${i + 1}`,
  depositType: '电子钱包',
  depositMethod: '扫码支付',
  percentFee: '10.00%',
  fixedFee: '15.0000',
  icon: 'alipay',
  remark: '备注文案123456',
  status: '启用',
  operateTime: '2025-04-14 06:04:53',
  operator: 'superAdmin02',
}))

export const WITHDRAW_ROWS = Array.from({ length: 10 }, (_, i) => ({
  key: `withdraw-${i + 1}`,
  withdrawType: '电子钱包',
  withdrawMethod: '扫码支付',
  percentFee: '10.00%',
  fixedFee: '15.0000',
  icon: 'alipay',
  remark: '备注文案123456',
  status: '启用',
  operateTime: '2025-04-14 06:04:53',
  operator: 'superAdmin02',
}))

export const SMS_ROWS = Array.from({ length: 10 }, (_, i) => ({
  key: `sms-${i + 1}`,
  region: '越南',
  areaCode: '84',
  channelId: '10001',
  channelName: '短信云',
  channelCode: 'VNSCL',
  remark: '备注123123213',
  status: '启用',
  operateTime: '2025-04-14 06:04:53',
  operator: 'superAdmin02',
}))

export const MAIL_ROWS = Array.from({ length: 10 }, (_, i) => ({
  key: `mail-${i + 1}`,
  channelName: '越南',
  channelCode: '84',
  channelAddress: '10001',
  status: '启用',
  operateTime: '2025-04-14 06:04:53',
  operator: 'superAdmin02',
}))

export const CS_ROWS = Array.from({ length: 10 }, (_, i) => ({
  key: `cs-${i + 1}`,
  channelId: '421559',
  channelName: `SaleSmartly${6 + i}`,
  channelCode: `SaleSmartly${61 + i}`,
  csType: '在线客服',
  channelAddress: '<script src="https://assets.salesmartly.com/js/project_168995_174947_1731638676.js"></script>',
  remark: '备注123123213',
  status: '启用',
  operateTime: '2025-04-14 06:04:53',
  operator: 'superAdmin02',
}))
