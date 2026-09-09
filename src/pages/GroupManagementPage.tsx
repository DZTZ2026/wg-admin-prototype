import { CopyOutlined } from '@ant-design/icons'
import { Button, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface GroupRow {
  key: string
  id: number
  name: string
  owner: string
  billDiscount: string
  referrer: string
  referralMethod: string
  balance: string
  creditLimit: string
  mainDeposit: string
  subDeposit: string
  mainOpenFee: string
  subOpenFee: string
  mainMaintainFee: string
  subMaintainFee: string
  maintainWaiver: string
  subSites: number
  subApis: number
  subCompanies: number
  apiRealPrice: string
  oldGameDiscount: string
  newGameDiscount: string
  businessContact: string
  remark: string
  primaryDomain: string
  backupDomain: string
  status: string
  feeStatus: string
}

const mockData: GroupRow[] = [
  {
    key: '1179',
    id: 1179,
    name: '伯乐',
    owner: 'bole',
    billDiscount: '2.50%',
    referrer: 'tempo',
    referralMethod: '个人',
    balance: '4,436.34',
    creditLimit: '10,000.00',
    mainDeposit: '0.00',
    subDeposit: '0.00',
    mainOpenFee: '20,000.00',
    subOpenFee: '1,000.00',
    mainMaintainFee: '3,000.00',
    subMaintainFee: '0.00',
    maintainWaiver: '不免除',
    subSites: 13,
    subApis: 0,
    subCompanies: 1,
    apiRealPrice: '5.0%',
    oldGameDiscount: '1.0%',
    newGameDiscount: '1.0%',
    businessContact: 'tempo',
    remark: '',
    primaryDomain: 'bole666.cg.ink',
    backupDomain: 'bole666.offib.com',
    status: '正常',
    feeStatus: '已生效',
  },
]

function copyText(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => message.success(`已复制：${text}`),
    () => message.info(`复制：${text}（原型）`),
  )
}

export default function GroupManagementPage() {
  const columns: ColumnsType<GroupRow> = [
    { title: '集团ID', dataIndex: 'id', width: 72, fixed: 'left' },
    { title: '集团名称', dataIndex: 'name', width: 80, fixed: 'left' },
    { title: '持有人', dataIndex: 'owner', width: 72 },
    { title: '账单折扣', dataIndex: 'billDiscount', width: 80 },
    { title: '推荐人', dataIndex: 'referrer', width: 72 },
    { title: '推荐方式', dataIndex: 'referralMethod', width: 80 },
    { title: '集团余额(U)', dataIndex: 'balance', width: 100 },
    { title: '主站点授信额度', dataIndex: 'creditLimit', width: 120 },
    { title: '主站点默认押金', dataIndex: 'mainDeposit', width: 120 },
    { title: '子品牌默认押金', dataIndex: 'subDeposit', width: 120 },
    { title: '主站点默认开站费', dataIndex: 'mainOpenFee', width: 130 },
    { title: '子品牌默认开站费', dataIndex: 'subOpenFee', width: 130 },
    { title: '主站点维护费', dataIndex: 'mainMaintainFee', width: 110 },
    { title: '子品牌维护费', dataIndex: 'subMaintainFee', width: 110 },
    { title: '主站自定义免除维护费月数', dataIndex: 'maintainWaiver', width: 180 },
    { title: '下级站点', dataIndex: 'subSites', width: 80 },
    { title: '下级API', dataIndex: 'subApis', width: 80 },
    { title: '下级公司', dataIndex: 'subCompanies', width: 80 },
    { title: '自营外接API真实价格(非优惠)', dataIndex: 'apiRealPrice', width: 200 },
    { title: '旧三方游戏优惠', dataIndex: 'oldGameDiscount', width: 120 },
    { title: '新三方游戏优惠', dataIndex: 'newGameDiscount', width: 120 },
    { title: '对接商务', dataIndex: 'businessContact', width: 80 },
    { title: '集团备注', dataIndex: 'remark', width: 80 },
    {
      title: '后台域名',
      dataIndex: 'primaryDomain',
      width: 190,
      render: (_, row) => (
        <div className="domain-cell">
          <div>
            主：{row.primaryDomain}
            <CopyOutlined className="copy-icon" onClick={() => copyText(row.primaryDomain)} />
          </div>
          <div>
            备：{row.backupDomain}
            <CopyOutlined className="copy-icon" onClick={() => copyText(row.backupDomain)} />
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 64,
      render: (v) => <span className="status-ok">{v}</span>,
    },
    {
      title: '费率状态',
      dataIndex: 'feeStatus',
      width: 80,
      render: (v) => <span className="status-ok">{v}</span>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: () => (
        <div className="action-links">
          <Button type="link" size="small" className="action-link" onClick={() => message.info('修改（原型）')}>
            修改
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => message.info('详情（原型）')}>
            详情
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => message.info('转账（原型）')}>
            转账
          </Button>
          <Button type="link" size="small" className="action-link" onClick={() => message.info('充值（原型）')}>
            充值
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="org-page-panel">
      <div className="org-section-title">集团列表</div>
      <div className="org-table-wrap">
        <Table<GroupRow>
          size="small"
          bordered
          columns={columns}
          dataSource={mockData}
          pagination={false}
          scroll={{ x: 3000 }}
          className="org-group-table"
        />
      </div>
      <div className="org-table-footer">共 {mockData.length} 条</div>
    </div>
  )
}
