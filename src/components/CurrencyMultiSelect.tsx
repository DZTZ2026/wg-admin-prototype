import { Checkbox, Select } from 'antd'
import type { SelectProps } from 'antd'

export const FILTER_CURRENCY_OPTIONS = [
  { value: 'USDT', label: 'USDT' },
  { value: 'BRL', label: '巴西(BRL)' },
  { value: 'MXN', label: '墨西哥(MXN)' },
  { value: 'USDC', label: 'USDC' },
  { value: 'TRX', label: 'TRX' },
  { value: 'NGN', label: '尼日利亚(NGN)' },
  { value: 'PYG', label: '巴拉圭(PYG1000:1)' },
  { value: 'PEN', label: '秘鲁(PEN)' },
]

type CurrencyMultiSelectProps = Omit<SelectProps, 'mode' | 'options' | 'optionRender' | 'menuItemSelectedIcon'> & {
  options?: { value: string; label: string }[]
}

/** 搜索栏币种多选（带复选框） */
export default function CurrencyMultiSelect({
  options = FILTER_CURRENCY_OPTIONS,
  value,
  placeholder = '币种',
  maxTagCount = 1,
  popupClassName,
  ...rest
}: CurrencyMultiSelectProps) {
  const selected = Array.isArray(value) ? (value as string[]) : []

  return (
    <Select
      {...rest}
      mode="multiple"
      allowClear
      showSearch
      optionFilterProp="label"
      placeholder={placeholder}
      maxTagCount={maxTagCount}
      value={selected}
      options={options}
      menuItemSelectedIcon={null}
      popupClassName={['currency-multi-select-dropdown', popupClassName].filter(Boolean).join(' ')}
      optionRender={(option) => {
        const val = String(option.value)
        const checked = selected.includes(val)
        return (
          <div className="currency-multi-select-option">
            <Checkbox checked={checked} />
            <span>{option.label}</span>
          </div>
        )
      }}
    />
  )
}
