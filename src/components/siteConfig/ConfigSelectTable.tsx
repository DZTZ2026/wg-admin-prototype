import { useMemo, useState, type Key } from 'react'
import { Button, Input, Select, Table, Pagination } from 'antd'
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface'

export interface FilterField {
  key: string
  kind: 'input' | 'select'
  placeholder: string
  options?: { value: string; label: string }[]
  width?: number
}

interface ConfigSelectTableProps<T extends { key: string }> {
  filters: FilterField[]
  columns: ColumnsType<T>
  dataSource: T[]
  selectedKeys?: Key[]
  onChange?: (keys: Key[]) => void
  matchRow?: (row: T, values: Record<string, string | undefined>) => boolean
  scrollX?: number
  pageSize?: number
  /** 只读展示：无勾选 */
  readonly?: boolean
}

export default function ConfigSelectTable<T extends { key: string }>({
  filters,
  columns,
  dataSource,
  selectedKeys = [],
  onChange,
  matchRow,
  scrollX = 1100,
  pageSize = 10,
  readonly = false,
}: ConfigSelectTableProps<T>) {
  const [draft, setDraft] = useState<Record<string, string | undefined>>({})
  const [applied, setApplied] = useState<Record<string, string | undefined>>({})
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(pageSize)

  const filtered = useMemo(() => {
    if (!matchRow) return dataSource
    return dataSource.filter((row) => matchRow(row, applied))
  }, [applied, dataSource, matchRow])

  const pageData = useMemo(() => {
    const start = (page - 1) * size
    return filtered.slice(start, start + size)
  }, [filtered, page, size])

  const rowSelection: TableRowSelection<T> | undefined = readonly
    ? undefined
    : {
        type: 'checkbox',
        selectedRowKeys: selectedKeys,
        onChange: (keys) => onChange?.(keys),
        preserveSelectedRowKeys: true,
      }

  return (
    <div className={`site-config-select-panel${readonly ? ' is-readonly' : ''}`}>
      <div className="site-config-select-filters">
        {filters.map((f) =>
          f.kind === 'select' ? (
            <Select
              key={f.key}
              allowClear
              placeholder={f.placeholder}
              options={f.options}
              value={draft[f.key]}
              onChange={(v) => setDraft((prev) => ({ ...prev, [f.key]: v }))}
              style={{ width: f.width || 160 }}
            />
          ) : (
            <Input
              key={f.key}
              allowClear
              placeholder={f.placeholder}
              value={draft[f.key]}
              onChange={(e) => setDraft((prev) => ({ ...prev, [f.key]: e.target.value }))}
              style={{ width: f.width || 160 }}
            />
          ),
        )}
        <Button
          type="primary"
          onClick={() => {
            setApplied({ ...draft })
            setPage(1)
          }}
        >
          查询
        </Button>
        <Button
          onClick={() => {
            setDraft({})
            setApplied({})
            setPage(1)
          }}
        >
          重置
        </Button>
      </div>

      <Table<T>
        size="small"
        rowKey="key"
        columns={columns}
        dataSource={pageData}
        pagination={false}
        rowSelection={rowSelection}
        scroll={{ x: scrollX }}
        className="site-config-select-table"
      />

      <div className="site-config-select-pagination">
        <span>
          总计{filtered.length}条记录 第{page}/{Math.max(1, Math.ceil(filtered.length / size) || 1)}页
        </span>
        <Pagination
          size="small"
          current={page}
          pageSize={size}
          total={filtered.length}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={['10', '20', '50']}
          onChange={(p, s) => {
            setPage(p)
            setSize(s)
          }}
        />
      </div>
    </div>
  )
}
