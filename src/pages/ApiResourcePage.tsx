import { Table, Pagination } from 'antd'

const MOCK_DATA = [
  { key: '1', name: 'WG SDK 接口文档(转账钱包)0807', desc: 'WG SDK Interface Documentation(Transfer Wallet)-V1.0', size: '1.51M' },
  { key: '2', name: '游戏币种信息清单-转账钱包', desc: '游戏币种信息清单-转账钱包(gamelist-TransferWallet0817)', size: '32.64K' },
  { key: '3', name: 'WG SDK 接口文档(单一钱包)0807', desc: 'WG SDK Interface Documentation(Seamless Wallet)-V1.0', size: '1.23M' },
  { key: '4', name: '游戏币种信息清单-单一钱包', desc: '游戏币种信息清单-单一钱包(SeamlessWallet0817)', size: '70.02K' },
  { key: '5', name: 'WG游戏有效投注及派彩说明0808', desc: 'WG游戏有效投注及派彩说明(Effective Bet and Payout Rules)', size: '11.99K' },
  { key: '6', name: '200x200-psd英文(English)0729', desc: '200x200-psd英文(English)0729', size: '297.58M' },
  { key: '7', name: '200x200-psd中文( Chinese)0729', desc: '200x200-psd中文( Chinese)0729', size: '290.96M' },
  { key: '8', name: '美术资源V6.9', desc: '美术资源V6.9', size: '37.52M' },
  { key: '9', name: '宣传资料(Promotional materials)0729', desc: '宣传资料(Promotional materials)', size: '155.51M' },
  { key: '10', name: '美术资源-龙之连环系列', desc: '美术资源-龙之连环系列(Art resources-Dragon Link)', size: '184.36M' },
  { key: '11', name: '加密调试工具', desc: '加密调试工具(Encrypted Debugging Tool)', size: '1.10K' },
  { key: '12', name: '512x512-psd-电子(Slot)-1', desc: '512x512-psd-电子(Slot)-1', size: '416.83M' },
  { key: '13', name: '512x512-psd-电子(Slot)-2-0715', desc: '512x512-psd-电子(Slot)-2-0715', size: '190.66M' },
  { key: '14', name: '512x512-psd-电子(Slot)-3-0729', desc: '512x512-psd-电子(Slot)-3', size: '1.52M' },
  { key: '15', name: '512x512-psd-棋牌(Cards)-1', desc: '512x512-psd-棋牌(Cards)-1', size: '430.51M' },
  { key: '16', name: '512x512-psd-棋牌(Cards)-2', desc: '512x512-psd-棋牌(Cards)-2', size: '15.30M' },
  { key: '17', name: '512x512-psd-区块链(Blockchain)0715', desc: '512x512-psd-区块链(Blockchain)0715', size: '125.64M' },
  { key: '18', name: '512x512-psd-捕鱼(Fishing)', desc: '512x512-psd-捕鱼(Fishing)', size: '23.97M' },
  { key: '19', name: '320x427-psd-电子(Slot)0715', desc: '320x427-psd-电子(Slot)0715', size: '378.17M' },
  { key: '20', name: '320x427-psd-电子(Slot)-2-0729', desc: '320x427-psd-电子(Slot)-2-0729', size: '1.96M' },
  { key: '21', name: '320x427-电子Slot-EN-logo0715', desc: '320x427-电子Slot-EN-logo0715', size: '464.08M' },
  { key: '22', name: '320x427-电子Slot-EN-logo-2-0729', desc: '320x427-电子Slot-EN-logo-2-0729', size: '1.96M' },
  { key: '23', name: '320x427-psd-棋牌(Cards)', desc: '320x427-psd-棋牌(Cards)', size: '267.68M' },
  { key: '24', name: '320x427-棋牌Cards-EN-logo', desc: '320x427-棋牌Cards-EN-logo', size: '276.66M' },
  { key: '25', name: '320x427-psd-区块链(Blockchain)0715', desc: '320x427-psd-区块链(Blockchain)0715', size: '75.53M' },
  { key: '26', name: '320x427-区块链Blockchain-EN-logo0715', desc: '320x427-区块链Blockchain-EN-logo0715', size: '76.74M' },
  { key: '27', name: '320x427-psd-捕鱼(Fishing)', desc: '320x427-psd-捕鱼(Fishing)', size: '16.27M' },
  { key: '28', name: '320x427-捕鱼Fishing-EN-logo', desc: '320x427-捕鱼Fishing-EN-logo', size: '16.96M' },
  { key: '29', name: '对接示例V1.1( Docking Example V1.1)', desc: '包含go, java, php, js四种语言的对接示例代码(Contains docking sample codes in four languages: go, java, php, an...', size: '2.82M' },
]

const columns = [
  { title: '文件名称', dataIndex: 'name', key: 'name' },
  { title: '文件描述', dataIndex: 'desc', key: 'desc' },
  { title: '文件大小', dataIndex: 'size', key: 'size', width: 120 },
  {
    title: '操作', key: 'action', width: 80,
    render: () => <a style={{ color: '#1890ff' }}>下载</a>,
  },
]

export default function ApiResourcePage() {
  return (
    <div style={{ padding: 16, background: '#fff', height: '100%' }}>
      <Table
        dataSource={MOCK_DATA}
        columns={columns}
        pagination={false}
        size="middle"
        bordered
      />
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>共29条</span><Pagination size="small" total={29} pageSize={100} pageSizeOptions={['100']} showSizeChanger />
      </div>
    </div>
  )
}
