export type ModuleKey =
  | 'dashboard'
  | 'ops'
  | 'games'
  | 'members'
  | 'agents'
  | 'promo'
  | 'finance'
  | 'reports'
  | 'risk'
  | 'system'

export type PageKey = string

export interface PageDef {
  key: PageKey
  title: string
  module: ModuleKey
}

export interface ModuleDef {
  key: ModuleKey
  label: string
  badge?: number | '新'
  children?: { key: PageKey; label: string }[]
}

/** 录像中出现过的完整模块树 */
export const MODULES: ModuleDef[] = [
  { key: 'dashboard', label: '仪表盘' },
  {
    key: 'ops',
    label: '运营',
    badge: 16,
    children: [
      { key: 'owner-notice', label: '厅主公告' },
      { key: 'sys-message', label: '消息通知' },
      { key: 'app-package', label: 'APP包管理' },
      { key: 'ops-game', label: '游戏管理' },
      { key: 'brand', label: '品牌设置' },
      { key: 'domain', label: '域名管理' },
      { key: 'personalize', label: '个性化配置' },
      { key: 'match-data', label: '赛事数据' },
      { key: 'promo-square', label: '宣传广场(发现)' },
      { key: 'jpush', label: '极光推送' },
      { key: 'attribution', label: '埋点归因' },
      { key: 'avatar', label: '头像管理' },
      { key: 'cs', label: '客服管理' },
      { key: 'download-site', label: '下载站管理' },
      { key: 'channel', label: '渠道管理' },
      { key: 'reward-feedback', label: '有奖反馈' },
      { key: 'ads', label: '营销广告' },
    ],
  },
  {
    key: 'games',
    label: '游戏',
    badge: '新',
    children: [
      { key: 'rooms', label: '房间游戏' },
      { key: 'bet-records', label: '投注记录' },
      { key: 'member-bet-detail', label: '会员投注细目' },
      { key: 'game-stats', label: '游戏统计' },
      { key: 'virtual-pool', label: '虚拟彩金池' },
      { key: 'win-carousel', label: '中奖记录轮播' },
    ],
  },
  {
    key: 'members',
    label: '会员',
    children: [
      { key: 'all-members', label: '所有会员' },
      { key: 'remove-members', label: '待剔除会员' },
      { key: 'streamers', label: '主播号' },
      { key: 'tiers', label: '层级设置' },
      { key: 'member-tags', label: '会员标签' },
      { key: 'vip-level', label: 'VIP等级' },
      { key: 'register-verify', label: '注册和验证' },
      { key: 'device', label: '设备管理' },
      { key: 'big-player', label: '大R报表' },
      { key: 'sms-rank', label: '短信排名' },
    ],
  },
  {
    key: 'agents',
    label: '代理',
    badge: '新',
    children: [
      { key: 'agent-mode', label: '代理模式' },
      { key: 'commission', label: '佣金管理' },
      { key: 'agent-change', label: '变更记录' },
      { key: 'agent-promo', label: '推广设置' },
      { key: 'agent-report', label: '代理报表' },
      { key: 'agent-query-old', label: '代理数据查询(旧)' },
      { key: 'agent-data1', label: '代理数据1' },
      { key: 'agents', label: '代理数据2' },
      { key: 'club-manage', label: '俱乐部管理' },
      { key: 'club-members', label: '俱乐部成员' },
      { key: 'club-loan', label: '俱乐部借还款' },
      { key: 'club-deposit', label: '俱乐部保证金' },
      { key: 'club-bills', label: '俱乐部账单' },
      { key: 'club-app', label: '俱乐部APP管理' },
    ],
  },
  {
    key: 'promo',
    label: '优惠',
    badge: '新',
    children: [
      { key: 'activity-center', label: '活动中心' },
      { key: 'task-center', label: '任务中心' },
      { key: 'lucky', label: '幸运转盘' },
      { key: 'blind-box', label: '盲盒抽奖' },
      { key: 'rebate', label: '实时返水' },
      { key: 'interest', label: '利息宝' },
      { key: 'vip-reward', label: 'VIP奖励' },
      { key: 'svip', label: '金融SVIP' },
      { key: 'provident', label: '公积金' },
      { key: 'coupon', label: '折扣券' },
      { key: 'promo-detail', label: '优惠明细' },
      { key: 'promo-review', label: '领取与审核' },
      { key: 'credit-loan', label: '信用借款' },
    ],
  },
  {
    key: 'finance',
    label: '财务',
    badge: 4,
    children: [
      { key: 'recharge-all', label: '全部充值' },
      { key: 'recharge-transfer', label: '转账充值' },
      { key: 'recharge-cs', label: '客服代充' },
      { key: 'recharge-merchant', label: '银商充值' },
      { key: 'withdraw', label: '提现管理' },
      { key: 'audit-task', label: '稽核任务' },
      { key: 'manual-fix', label: '人工拉回修正' },
      { key: 'credit-loss', label: '游戏额度丢失' },
      { key: 'fx-bank', label: '汇率和银行管理' },
      { key: 'finance-pay', label: '三方支付排名' },
      { key: 'guarantee', label: '担保与理赔' },
      { key: 'balance-change', label: '账变记录' },
    ],
  },
  {
    key: 'reports',
    label: '查询',
    children: [
      { key: 'ops-stats', label: '运营统计' },
      { key: 'import-exec', label: '导入执行' },
      { key: 'report-member', label: '会员报表' },
      { key: 'report-game', label: '游戏报表' },
      { key: 'report-finance', label: '财务报表' },
    ],
  },
  {
    key: 'risk',
    label: '风控',
    children: [
      { key: 'risk-audit', label: '风控审核' },
      { key: 'risk-rule', label: '风控规则' },
      { key: 'risk-blacklist', label: '黑名单' },
      { key: 'risk-device', label: '设备风控' },
      { key: 'risk-ip', label: 'IP风控' },
    ],
  },
  {
    key: 'system',
    label: '系统',
    badge: 1,
    children: [
      { key: 'sys-user', label: '账号权限' },
      { key: 'sys-role', label: '角色管理' },
      { key: 'sys-log', label: '操作日志' },
      { key: 'sys-config', label: '系统配置' },
      { key: 'sys-notice', label: '系统公告' },
    ],
  },
]

export const PAGES: Record<PageKey, PageDef> = Object.fromEntries(
  MODULES.flatMap((m) => {
    if (m.key === 'dashboard') {
      return [['dashboard', { key: 'dashboard', title: '仪表盘', module: 'dashboard' as ModuleKey }]]
    }
    return (m.children || []).map((c) => [c.key, { key: c.key, title: c.label, module: m.key }])
  }),
)
