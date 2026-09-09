import { Tag } from 'antd'
import { col, makeRows, type ListPageConfig } from './pageTypes'

const dwm = { kind: 'dayWeekMonth' as const, key: 'dwm' }
const dr = { kind: 'daterange' as const, key: 'dr' }
const kw = (ph: string, width = 180) => ({
  kind: 'input' as const,
  key: 'keyword',
  placeholder: ph,
  width,
})

export const PAGE_CONFIGS: Record<string, ListPageConfig> = {
  'owner-notice': {
    key: 'owner-notice',
    title: '厅主公告',
    filters: [dr, kw('公告标题')],
    actions: [{ key: 'add', label: '+ 新增', type: 'primary' }],
    columns: [
      col('标题', 'title'),
      col('状态', 'status'),
      col('开始时间', 'start'),
      col('结束时间', 'end'),
      col('操作人', 'op'),
      col('操作时间', 'at'),
    ],
    rows: makeRows(
      ['title', 'status', 'start', 'end', 'op', 'at'],
      [
        ['周末维护通知', '生效中', '2026-03-28 00:00', '2026-03-30 23:59', 'Lee', '2026-03-27 18:00'],
        ['充值通道升级', '已过期', '2026-03-01 00:00', '2026-03-07 23:59', 'Ops', '2026-02-28 10:00'],
      ],
    ),
    batch: true,
  },

  'sys-message': {
    key: 'sys-message',
    title: '消息通知',
    subTabs: [
      { key: 'notice', label: '通知消息' },
      { key: 'marquee', label: '跑马灯' },
      { key: 'announce', label: '公告消息' },
      { key: 'banner', label: '大厅Banner' },
      { key: 'loading', label: '加载页轮播' },
      { key: 'lobby_pop', label: '大厅弹窗' },
      { key: 'smart', label: '智能参数通知', badge: '新' },
    ],
    defaultSubTab: 'lobby_pop',
    filters: [
      dr,
      { kind: 'input', key: 'id', placeholder: '请输入ID', width: 140 },
      {
        kind: 'select',
        key: 'status',
        placeholder: '状态',
        options: [
          { value: 'on', label: '生效中' },
          { value: 'off', label: '已过期' },
        ],
      },
      {
        kind: 'select',
        key: 'lang',
        placeholder: '语言',
        options: [
          { value: 'zh', label: '中文' },
          { value: 'en', label: 'English' },
          { value: 'vi', label: 'Tiếng Việt' },
        ],
      },
      {
        kind: 'select',
        key: 'loop',
        placeholder: '循环方式',
        options: [
          { value: 'once', label: '仅一次' },
          { value: 'daily', label: '每日' },
        ],
      },
      {
        kind: 'select',
        key: 'pop',
        placeholder: '弹窗方式',
        options: [
          { value: 'login', label: '登录后' },
          { value: 'always', label: '每次进入' },
        ],
      },
      {
        kind: 'select',
        key: 'pos',
        placeholder: '展示位置',
        options: [
          { value: 'center', label: '居中' },
          { value: 'bottom', label: '底部' },
        ],
      },
    ],
    actions: [{ key: 'add', label: '+ 新增', type: 'primary' }],
    columns: [
      col('收件人', 'to', 160),
      col('展示入口', 'entry', 220),
      col('跳转', 'jump', 80),
      col('开始时间', 'start', 160),
      col('结束时间', 'end', 160),
      {
        title: '状态',
        dataIndex: 'status',
        render: (v: string) => (
          <span style={{ color: v === '生效中' ? '#52c41a' : '#8c8c8c' }}>{v}</span>
        ),
      },
      {
        title: '操作',
        render: (_: unknown, r: Record<string, unknown>) =>
          r.status === '生效中' ? '停止 / 复制创建 / 详情 / 删除' : '详情 / 复制创建 / 删除',
        width: 220,
      },
      col('后台备注', 'remark'),
      col('操作人', 'op'),
      col('操作时间', 'at'),
    ],
    rows: [
      {
        key: '1',
        to: '娱乐城(全部会员)',
        entry: '娱乐城-登录前(游客), 登录后(会员)',
        jump: '无',
        start: '2026-03-28 00:00:00',
        end: '2026-04-01 23:59:59',
        status: '生效中',
        remark: '-',
        op: 'gata123',
        at: '2026-03-28 09:12:01',
      },
      {
        key: '2',
        to: '娱乐城(全部会员)',
        entry: '娱乐城-登录前(游客), 登录后(会员)',
        jump: '无',
        start: '2025-04-12 00:00:00',
        end: '2025-05-31 23:59:59',
        status: '已过期',
        remark: '-',
        op: 'lu88',
        at: '2025-04-11 16:20:00',
      },
    ],
    batch: true,
  },

  'app-package': {
    key: 'app-package',
    title: 'APP包管理',
    filters: [kw('包名 / 版本号'), { kind: 'select', key: 'plat', placeholder: '平台', options: [{ value: 'ios', label: 'iOS' }, { value: 'android', label: 'Android' }] }],
    actions: [{ key: 'add', label: '+ 上传包', type: 'primary' }],
    columns: [col('平台', 'plat'), col('版本号', 'ver'), col('强制更新', 'force'), col('下载地址', 'url'), col('状态', 'status'), col('更新时间', 'at')],
    rows: makeRows(['plat', 'ver', 'force', 'url', 'status', 'at'], [['Android', '3.2.1', '否', 'https://dl.example/a.apk', '启用', '2026-03-20 11:00'], ['iOS', '3.1.8', '是', 'https://apps.apple.com/...', '启用', '2026-03-18 09:30']]),
  },

  'ops-game': {
    key: 'ops-game',
    title: '游戏管理',
    filters: [kw('游戏名称'), { kind: 'select', key: 'cat', placeholder: '分类', options: [{ value: 'live', label: '真人' }, { value: 'slot', label: '电子' }, { value: 'sport', label: '体育' }] }],
    actions: [{ key: 'add', label: '+ 新增游戏', type: 'primary' }],
    columns: [col('游戏ID', 'id'), col('名称', 'name'), col('厂商', 'vendor'), col('状态', 'status'), col('排序', 'sort'), col('操作人', 'op')],
    rows: makeRows(['id', 'name', 'vendor', 'status', 'sort', 'op'], [['G-100', '百家乐', 'AG', '上架', 1, 'Lee'], ['G-210', '德州扑克', '自研', '上架', 2, 'Lee'], ['G-330', '龙虎', 'AG', '维护', 3, 'Ops']]),
  },

  brand: {
    key: 'brand',
    title: '品牌设置',
    filters: [kw('品牌名')],
    actions: [{ key: 'save', label: '保存配置', type: 'primary' }],
    columns: [col('配置项', 'item'), col('当前值', 'value'), col('更新时间', 'at')],
    rows: makeRows(['item', 'value', 'at'], [['品牌名称', 'NEW88', '2026-03-01'], ['主题色', '#0B3A82', '2026-03-01'], ['客服入口', '开启', '2026-03-10']]),
  },

  personalize: {
    key: 'personalize',
    title: '个性化配置',
    filters: [kw('配置键')],
    actions: [{ key: 'add', label: '+ 新增', type: 'primary' }],
    columns: [col('配置键', 'k'), col('说明', 'desc'), col('值', 'v'), col('状态', 'status')],
    rows: makeRows(['k', 'desc', 'v', 'status'], [['home.layout', '首页布局', 'A', '启用'], ['theme.dark', '暗色模式', 'false', '启用']]),
  },

  'match-data': {
    key: 'match-data',
    title: '赛事数据',
    filters: [dwm, dr, kw('赛事名称')],
    columns: [col('赛事ID', 'id'), col('赛事名称', 'name'), col('开始时间', 'start'), col('状态', 'status'), col('投注额', 'bet')],
    rows: makeRows(['id', 'name', 'start', 'status', 'bet'], [['M-01', '周末杯', '2026-03-29 20:00', '未开始', 0], ['M-02', '春季联赛', '2026-03-20 19:00', '进行中', 128800]]),
  },

  'promo-square': {
    key: 'promo-square',
    title: '宣传广场(发现)',
    subTabs: [
      { key: 'public', label: '全部公开' },
      { key: 'articles', label: '全部文章' },
      { key: 'draft', label: '后台草稿' },
      { key: 'special', label: '后台特展示' },
      { key: 'backend_public', label: '后台公开' },
      { key: 'hidden', label: '后台已隐藏' },
      { key: 'authors', label: '后台作者' },
      { key: 'member_hidden', label: '会员发布(默认隐藏)' },
      { key: 'member_public', label: '会员公开' },
      { key: 'tip', label: '打赏记录' },
      { key: 'discover_cfg', label: '发现配置' },
      { key: 'sensitive', label: '敏感词配置' },
    ],
    defaultSubTab: 'draft',
    filters: [dwm, dr, { kind: 'select', key: 'currency', placeholder: '币种', mode: 'multiple', options: [{ value: 'USDT', label: 'USDT' }, { value: 'VND', label: 'VND' }, { value: 'BRL', label: '巴西(BRL)' }, { value: 'MXN', label: '墨西哥(MXN)' }] }, kw('请输入文章ID')],
    actions: [{ key: 'add', label: '+ 新建文章', type: 'primary' }],
    columns: [
      col('文章ID', 'id'),
      col('创建时间', 'created'),
      col('作者ID', 'aid'),
      col('作者账号', 'account'),
      col('作者昵称', 'nick'),
      col('粉丝数(真实)', 'fans'),
      col('币种', 'currency'),
      col('描述性内容', 'content'),
      col('点赞数(真实)', 'likes'),
    ],
    rows: [],
    batch: true,
  },

  attribution: {
    key: 'attribution',
    title: '埋点归因',
    filters: [dwm, dr, kw('事件名 / 渠道')],
    columns: [col('事件', 'event'), col('渠道', 'channel'), col('次数', 'count'), col('转化', 'cv'), col('日期', 'date')],
    rows: makeRows(['event', 'channel', 'count', 'cv', 'date'], [['register', 'FB-A', 1200, '8.2%', '2026-03-28'], ['first_pay', 'GG-B', 86, '3.1%', '2026-03-28']]),
  },

  avatar: {
    key: 'avatar',
    title: '头像管理',
    filters: [kw('头像ID')],
    actions: [{ key: 'add', label: '+ 上传', type: 'primary' }],
    columns: [col('ID', 'id'), col('预览', 'preview'), col('分组', 'group'), col('状态', 'status'), col('更新时间', 'at')],
    rows: makeRows(['id', 'preview', 'group', 'status', 'at'], [['AV-1', '[图]', '默认', '启用', '2026-03-01'], ['AV-2', '[图]', '活动', '启用', '2026-03-12']]),
  },

  cs: {
    key: 'cs',
    title: '客服管理',
    filters: [kw('客服账号'), { kind: 'select', key: 'status', placeholder: '状态', options: [{ value: 'on', label: '在线' }, { value: 'off', label: '离线' }] }],
    actions: [{ key: 'add', label: '+ 新增客服', type: 'primary' }],
    columns: [col('客服账号', 'account'), col('昵称', 'nick'), col('渠道', 'channel'), col('状态', 'status'), col('接待量', 'cnt')],
    rows: makeRows(['account', 'nick', 'channel', 'status', 'cnt'], [['cs01', '小美', 'LiveChat', '在线', 12], ['cs02', '阿强', 'Telegram', '离线', 0]]),
  },

  'download-site': {
    key: 'download-site',
    title: '下载站管理',
    filters: [kw('站点域名')],
    actions: [{ key: 'add', label: '+ 新增站点', type: 'primary' }],
    columns: [col('站点域名', 'domain'), col('状态', 'status'), col('默认包', 'pkg'), col('更新时间', 'at')],
    rows: makeRows(['domain', 'status', 'pkg', 'at'], [['dl.example.com', '正常', 'Android 3.2.1', '2026-03-20'], ['get.example.net', '正常', 'PWA', '2026-03-18']]),
  },

  channel: {
    key: 'channel',
    title: '渠道管理',
    subTabs: [
      { key: 'links', label: '渠道链接' },
      { key: 'stats', label: '渠道转化统计' },
    ],
    filters: [dwm, dr, kw('渠道名称 / ID')],
    actions: [
      { key: 'add', label: '+ 新增', type: 'primary', opens: 'channel-add' },
      { key: 'batchAdd', label: '批量新增' },
      { key: 'public', label: '渠道公共设置' },
    ],
    columns: [
      col('渠道ID', 'id'),
      col('渠道名称', 'name'),
      col('推广链接', 'link'),
      col('注册', 'reg'),
      col('首充', 'first'),
      col('状态', 'status'),
      col('创建时间', 'at'),
    ],
    rows: makeRows(
      ['id', 'name', 'link', 'reg', 'first', 'status', 'at'],
      [
        ['CH-1001', 'FB投放A', 'https://go.example/a', 320, 28, '启用', '2026-03-01'],
        ['CH-1002', 'GG品牌', 'https://go.example/b', 188, 15, '启用', '2026-03-10'],
      ],
    ),
    batch: true,
  },

  'reward-feedback': {
    key: 'reward-feedback',
    title: '有奖反馈',
    filters: [dr, kw('会员账号'), { kind: 'select', key: 'status', placeholder: '状态', options: [{ value: 'pending', label: '待处理' }, { value: 'done', label: '已处理' }] }],
    columns: [col('反馈ID', 'id'), col('会员账号', 'account'), col('内容', 'content'), col('奖励', 'reward'), col('状态', 'status'), col('提交时间', 'at')],
    rows: makeRows(['id', 'account', 'content', 'reward', 'status', 'at'], [['FB-1', 'vip_alpha', '充值偶发失败', '8 USDT', '待处理', '2026-03-28 10:00']]),
    batch: true,
  },

  ads: {
    key: 'ads',
    title: '营销广告',
    filters: [kw('广告位 / 名称')],
    actions: [{ key: 'add', label: '+ 新增广告', type: 'primary' }],
    columns: [col('广告位', 'slot'), col('名称', 'name'), col('状态', 'status'), col('曝光', 'pv'), col('点击', 'click')],
    rows: makeRows(['slot', 'name', 'status', 'pv', 'click'], [['首页Banner', '春季充值', '投放中', 12000, 860], ['弹窗', '下载引导', '暂停', 0, 0]]),
  },

  'bet-records': {
    key: 'bet-records',
    title: '投注记录',
    filters: [dwm, dr, kw('会员账号 / 注单号')],
    actions: [{ key: 'export', label: '导出' }],
    columns: [col('注单号', 'id'), col('会员账号', 'account'), col('游戏', 'game'), col('投注额', 'bet'), col('输赢', 'wl'), col('时间', 'at')],
    rows: makeRows(['id', 'account', 'game', 'bet', 'wl', 'at'], [['B-9001', 'vip_alpha', '百家乐', 100, -100, '2026-03-28 12:01'], ['B-9002', 'beta_ok', '德州', 50, 80, '2026-03-28 12:05']]),
  },

  'member-bet-detail': {
    key: 'member-bet-detail',
    title: '会员投注细目',
    filters: [dwm, dr, kw('会员账号')],
    columns: [col('会员账号', 'account'), col('游戏', 'game'), col('局数', 'rounds'), col('投注', 'bet'), col('有效投注', 'valid'), col('输赢', 'wl')],
    rows: makeRows(['account', 'game', 'rounds', 'bet', 'valid', 'wl'], [['vip_alpha', '百家乐', 42, 8200, 7800, -420]]),
  },

  'game-stats': {
    key: 'game-stats',
    title: '游戏统计',
    filters: [dwm, dr, { kind: 'select', key: 'game', placeholder: '子游戏', options: [{ value: 'all', label: '全部' }] }],
    columns: [col('游戏', 'game'), col('投注人数', 'users'), col('投注额', 'bet'), col('抽水', 'rake'), col('平台盈亏', 'pl')],
    rows: makeRows(['game', 'users', 'bet', 'rake', 'pl'], [['百家乐', 86, 220000, 4400, 12800], ['德州扑克', 42, 98000, 2100, -3200]]),
  },

  'virtual-pool': {
    key: 'virtual-pool',
    title: '虚拟彩金池',
    filters: [kw('彩池名称')],
    actions: [{ key: 'add', label: '+ 新增彩池', type: 'primary' }],
    columns: [col('彩池ID', 'id'), col('名称', 'name'), col('当前金额', 'amount'), col('状态', 'status'), col('更新时间', 'at')],
    rows: makeRows(['id', 'name', 'amount', 'status', 'at'], [['JP-1', '大厅大奖', 1258000, '开启', '2026-03-28 16:00']]),
  },

  'win-carousel': {
    key: 'win-carousel',
    title: '中奖记录轮播',
    filters: [kw('会员账号')],
    actions: [{ key: 'add', label: '+ 新增轮播', type: 'primary' }],
    columns: [col('会员', 'account'), col('游戏', 'game'), col('中奖金额', 'win'), col('展示状态', 'status'), col('时间', 'at')],
    rows: makeRows(['account', 'game', 'win', 'status', 'at'], [['vip***a', '电子', 8888, '展示中', '2026-03-28 15:00']]),
  },

  'all-members': {
    key: 'all-members',
    title: '所有会员',
    filters: [
      dwm,
      dr,
      {
        kind: 'select',
        key: 'social',
        placeholder: '社交账号类型',
        options: [
          { value: 'tg', label: 'Telegram' },
          { value: 'zalo', label: 'Zalo' },
          { value: 'line', label: 'Line' },
          { value: 'x', label: 'X(Twitter)' },
          { value: 'wx', label: '微信' },
          { value: 'threads', label: 'Threads' },
          { value: 'ig', label: 'Instagram' },
          { value: 'inviter', label: '邀请人ID' },
        ],
      },
      kw('请输入精准会员账号', 200),
      {
        kind: 'select',
        key: 'type',
        placeholder: '请选择账号类型',
        options: [
          { value: 'formal', label: '正式' },
          { value: 'test', label: '测试' },
        ],
      },
    ],
    actions: [
      { key: 'add', label: '+ 新增会员', type: 'primary' },
      { key: 'import', label: '导入' },
      { key: 'export', label: '导出报表' },
      { key: 'ops', label: '操作' },
      { key: 'advanced', label: '高级搜索' },
    ],
    columns: [
      {
        title: '会员ID',
        dataIndex: 'id',
        render: (v: string) => (
          <span>
            {v} <Tag color="success">M0</Tag>
          </span>
        ),
      },
      col('会员账号(层级)', 'account', 180),
      col('总充值金额(次数)', 'recharge', 140),
      col('总充提差额(首充)', 'diff', 140),
      col('注册方式(验证)', 'reg', 150),
      col('注册时间(来源)', 'regAt', 180),
      col('登录方式', 'login'),
      col('最后登录IP/地区/时间', 'last', 220),
      { title: '操作', render: () => '详情 / 删除', width: 120 },
    ],
    rows: [
      {
        key: '1',
        id: '384362032',
        account: 'vip_alpha ([MD-1])',
        recharge: '0.00 (0次)',
        diff: '0.00 (0.00)',
        reg: '账号注册 (无验证)',
        regAt: '2026-03-28 10:00:38 (官网)',
        login: '账号登录',
        last: '103.22.11.8 / Singapore / 2026-03-28 15:01',
      },
      {
        key: '2',
        id: '384362088',
        account: 'beta_ok ([MD-1])',
        recharge: '120.00 (2次)',
        diff: '80.00 (50.00)',
        reg: '账号注册 (短信)',
        regAt: '2026-03-27 18:22:01 (代理链接)',
        login: '账号登录',
        last: '14.188.22.9 / Vietnam / 2026-03-28 14:20',
      },
    ],
  },

  'remove-members': {
    key: 'remove-members',
    title: '待剔除会员',
    filters: [kw('会员账号')],
    actions: [{ key: 'batch', label: '批量剔除', type: 'primary' }],
    columns: [col('会员ID', 'id'), col('账号', 'account'), col('原因', 'reason'), col('标记时间', 'at')],
    rows: makeRows(['id', 'account', 'reason', 'at'], [['384399001', 'spam_01', '批量注册', '2026-03-28 09:00']]),
    batch: true,
  },

  streamers: {
    key: 'streamers',
    title: '主播号',
    filters: [kw('主播账号')],
    actions: [{ key: 'add', label: '+ 新增主播号', type: 'primary' }],
    columns: [col('主播ID', 'id'), col('账号', 'account'), col('状态', 'status'), col('绑定会员', 'member')],
    rows: makeRows(['id', 'account', 'status', 'member'], [['S-1', 'live_anna', '启用', '384362032']]),
  },

  'member-tags': {
    key: 'member-tags',
    title: '会员标签',
    filters: [kw('标签名')],
    actions: [{ key: 'add', label: '+ 新增标签', type: 'primary' }],
    columns: [col('标签', 'tag'), col('人数', 'count'), col('说明', 'desc'), col('更新时间', 'at')],
    rows: makeRows(['tag', 'count', 'desc', 'at'], [['新用户标签', 243, '默认', '2026-03-01'], ['秒杀活动', 7, '活动', '2026-03-20']]),
  },

  'vip-level': {
    key: 'vip-level',
    title: 'VIP等级',
    filters: [kw('等级名')],
    actions: [{ key: 'add', label: '+ 新增等级', type: 'primary' }],
    columns: [col('等级', 'level'), col('升级条件', 'cond'), col('权益', 'benefit'), col('人数', 'count')],
    rows: makeRows(['level', 'cond', 'benefit', 'count'], [['VIP0', '默认', '基础', 200], ['VIP1', '累计充值≥100', '周礼包', 40], ['VIP2', '累计充值≥1000', '专属客服', 15]]),
  },

  'register-verify': {
    key: 'register-verify',
    title: '注册和验证',
    subTabs: [
      { key: 'login', label: '登录注册配置' },
      { key: 'security', label: '安全中心配置' },
      { key: 'bind', label: '绑定三方配置' },
      { key: 'sms', label: '短信配置' },
      { key: 'email', label: '邮箱验证' },
      { key: 'kyc', label: 'KYC验证配置' },
      { key: 'basic', label: '会员基本信息设置' },
      { key: 'anti', label: '防刷风控' },
      { key: 'api', label: '外部注册API配置' },
    ],
    defaultSubTab: 'kyc',
    filters: [
      dwm,
      dr,
      kw('请输入KYC厂商名称'),
      { kind: 'input', key: 'op', placeholder: '请输入操作人', width: 140 },
      {
        kind: 'select',
        key: 'status',
        placeholder: '全部状态',
        options: [
          { value: 'on', label: '启用' },
          { value: 'off', label: '停用' },
        ],
      },
    ],
    actions: [
      { key: 'public', label: '公共配置', type: 'primary' },
      { key: 'add', label: '+', type: 'primary' },
    ],
    columns: [
      col('优先级排序', 'priority'),
      col('KYC厂商来源', 'source'),
      col('KYC厂商名称', 'name'),
      col('联系方式', 'contact'),
      col('收费说明', 'fee'),
      col('厂商支持国家', 'support'),
      col('启用国家', 'enabled'),
      col('每日封顶', 'cap'),
      col('今日剩余', 'remain'),
      col('今日验证数', 'today'),
      col('今日成功数量', 'ok'),
      col('今日失败数量', 'fail'),
      col('今日通过率', 'rate'),
      { title: '操作', render: () => '编辑 / 停用' },
    ],
    rows: [],
  },

  device: {
    key: 'device',
    title: '设备管理',
    filters: [kw('设备ID / 会员账号')],
    columns: [col('设备ID', 'id'), col('会员账号', 'account'), col('系统', 'os'), col('风险分', 'score'), col('最后活跃', 'at')],
    rows: makeRows(['id', 'account', 'os', 'score', 'at'], [['DEV-88', 'vip_alpha', 'Android', 12, '2026-03-28 15:00']]),
  },

  'big-player': {
    key: 'big-player',
    title: '大R报表',
    filters: [dwm, dr, kw('会员账号')],
    columns: [col('会员账号', 'account'), col('累计充值', 'recharge'), col('累计投注', 'bet'), col('等级', 'level')],
    rows: makeRows(['account', 'recharge', 'bet', 'level'], [['vip_alpha', 128000, 560000, '大R']]),
  },

  'sms-rank': {
    key: 'sms-rank',
    title: '短信排名',
    filters: [dwm, dr],
    columns: [col('通道', 'channel'), col('发送量', 'send'), col('成功率', 'rate'), col('成本', 'cost')],
    rows: makeRows(['channel', 'send', 'rate', 'cost'], [['Twilio', 12000, '98.2%', 420], ['本地A', 8600, '96.1%', 210]]),
  },
}
