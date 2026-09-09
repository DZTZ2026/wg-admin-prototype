import type { ColumnsType } from 'antd/es/table'

export type FilterKind =
  | 'daterange'
  | 'dayWeekMonth'
  | 'input'
  | 'select'
  | 'numberRange'

export interface FilterDef {
  kind: FilterKind
  key: string
  label?: string
  placeholder?: string
  width?: number
  options?: { value: string; label: string }[]
  /** 下拉是否多选（如币种） */
  mode?: 'multiple'
}

export interface SubTabDef {
  key: string
  label: string
  badge?: string
}

export interface ListPageConfig {
  key: string
  title: string
  subTabs?: SubTabDef[]
  defaultSubTab?: string
  filters?: FilterDef[]
  actions?: { key: string; label: string; type?: 'primary' | 'default'; opens?: string }[]
  columns: ColumnsType<Record<string, unknown>>
  rows?: Record<string, unknown>[]
  batch?: boolean
  emptyHint?: string
}

export function makeRows(
  cols: string[],
  data: (string | number)[][],
): Record<string, unknown>[] {
  return data.map((row, i) => {
    const obj: Record<string, unknown> = { key: String(i + 1) }
    cols.forEach((c, idx) => {
      obj[c] = row[idx]
    })
    return obj
  })
}

export function col(title: string, dataIndex: string, width?: number) {
  return { title, dataIndex, key: dataIndex, width, ellipsis: true }
}
