import { useMemo, useState, type Key } from 'react'
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Tabs,
  message,
} from 'antd'
import dayjs from 'dayjs'
import FilterRangePicker from './FilterRangePicker'
import type { ListPageConfig } from '../pageTypes'

interface Props {
  config: ListPageConfig
  onAction?: (actionKey: string) => void
  extra?: React.ReactNode
}

export default function GenericListPage({ config, onAction, extra }: Props) {
  const [sub, setSub] = useState(config.defaultSubTab || config.subTabs?.[0]?.key || '')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Key[]>([])
  const [filters, setFilters] = useState<Record<string, string | string[]>>({})

  const rows = useMemo(() => {
    const source = config.rows || []
    if (!keyword.trim()) return source
    const q = keyword.trim().toLowerCase()
    return source.filter((r) =>
      Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(q)),
    )
  }, [config.rows, keyword])

  const search = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('已按条件筛选（原型本地数据）')
    }, 280)
  }

  return (
    <div className="page-panel">
      {config.subTabs?.length ? (
        <Tabs
          className="sub-tabs"
          activeKey={sub}
          onChange={setSub}
          items={config.subTabs.map((t) => ({
            key: t.key,
            label: t.badge ? (
              <span>
                {t.label}{' '}
                <span style={{ color: '#52c41a', fontSize: 11 }}>{t.badge}</span>
              </span>
            ) : (
              t.label
            ),
          }))}
        />
      ) : null}

      <div className="filter-bar">
        {(config.filters || []).map((f) => {
          if (f.kind === 'dayWeekMonth') {
            return (
              <Space.Compact key={f.key}>
                <Button size="small">日</Button>
                <Button size="small">周</Button>
                <Button size="small">月</Button>
              </Space.Compact>
            )
          }
          if (f.kind === 'daterange') {
            return (
              <FilterRangePicker
                key={f.key}
                defaultValue={[dayjs().startOf('day'), dayjs().endOf('day')]}
              />
            )
          }
          if (f.kind === 'select') {
            const isMulti = f.mode === 'multiple' || /币种/.test(f.placeholder || f.label || '')
            if (isMulti) {
              return (
                <Select
                  key={f.key}
                  mode="multiple"
                  placeholder={f.placeholder || f.label}
                  style={{ width: f.width || 140 }}
                  allowClear
                  maxTagCount={1}
                  showSearch
                  optionFilterProp="label"
                  options={f.options}
                  menuItemSelectedIcon={null}
                  popupClassName="currency-multi-select-dropdown"
                  value={(filters[f.key] as string[]) || []}
                  onChange={(v) => setFilters((s) => ({ ...s, [f.key]: v }))}
                  optionRender={(option) => {
                    const selected = ((filters[f.key] as string[]) || []).includes(String(option.value))
                    return (
                      <div className="currency-multi-select-option">
                        <Checkbox checked={selected} />
                        <span>{option.label}</span>
                      </div>
                    )
                  }}
                />
              )
            }
            return (
              <Select
                key={f.key}
                placeholder={f.placeholder || f.label}
                style={{ width: f.width || 140 }}
                allowClear
                options={f.options}
                value={(filters[f.key] as string) || undefined}
                onChange={(v) => setFilters((s) => ({ ...s, [f.key]: v || '' }))}
              />
            )
          }
          if (f.kind === 'numberRange') {
            return (
              <Space key={f.key}>
                <InputNumber placeholder="最小值" />
                <InputNumber placeholder="最大值" />
              </Space>
            )
          }
          return (
            <Input
              key={f.key}
              placeholder={f.placeholder || f.label}
              style={{ width: f.width || 180 }}
              allowClear
              value={f.key === 'keyword' ? keyword : typeof filters[f.key] === 'string' ? (filters[f.key] as string) : ''}
              onChange={(e) => {
                if (f.key === 'keyword') setKeyword(e.target.value)
                else setFilters((s) => ({ ...s, [f.key]: e.target.value }))
              }}
            />
          )
        })}
        <Space>
          <Button type="primary" loading={loading} onClick={search}>
            搜索
          </Button>
          <Button
            onClick={() => {
              setKeyword('')
              setFilters({})
            }}
          >
            重置
          </Button>
          {(config.actions || []).map((a) => (
            <Button
              key={a.key}
              type={a.type || 'default'}
              onClick={() => {
                if (onAction) onAction(a.key)
                else message.info(`${a.label}（原型可继续细化）`)
              }}
            >
              {a.label}
            </Button>
          ))}
        </Space>
      </div>

      {extra}

      <Table
        size="middle"
        loading={loading}
        rowSelection={
          config.batch
            ? { selectedRowKeys: selected, onChange: setSelected }
            : undefined
        }
        dataSource={rows}
        columns={config.columns}
        scroll={{ x: Math.max(1000, (config.columns.length || 8) * 120) }}
        pagination={false}
        locale={{ emptyText: config.emptyHint || '暂无数据' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        {config.batch ? (
          <>
            <Checkbox>全选当前页</Checkbox>
            <Select
              placeholder="批量操作"
              style={{ width: 140 }}
              options={[
                { value: 'export', label: '导出' },
                { value: 'delete', label: '删除' },
              ]}
            />
          </>
        ) : null}
        <span className="table-footer" style={{ marginTop: 0 }}>
          {config.batch ? `已选择 ${selected.length} 条数据 ` : null}共 {rows.length} 条
        </span>
      </div>
    </div>
  )
}
