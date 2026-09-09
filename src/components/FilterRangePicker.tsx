import { DatePicker } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import dayjs, { type Dayjs } from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)

type RangeValue = [Dayjs, Dayjs]

function todayRange(): RangeValue {
  return [dayjs().startOf('day'), dayjs().endOf('day')]
}

function yesterdayRange(): RangeValue {
  const d = dayjs().subtract(1, 'day')
  return [d.startOf('day'), d.endOf('day')]
}

function thisWeekRange(): RangeValue {
  return [dayjs().startOf('isoWeek'), dayjs().endOf('day')]
}

function lastWeekRange(): RangeValue {
  const start = dayjs().subtract(1, 'week').startOf('isoWeek')
  return [start, start.endOf('isoWeek')]
}

function thisMonthRange(): RangeValue {
  return [dayjs().startOf('month'), dayjs().endOf('day')]
}

function lastMonthRange(): RangeValue {
  const start = dayjs().subtract(1, 'month').startOf('month')
  return [start, start.endOf('month')]
}

/** 筛选栏时间范围：今日 / 昨日 / 本周 / 上周 / 本月 / 上月 */
export const FILTER_RANGE_PRESETS: NonNullable<RangePickerProps['presets']> = [
  { label: '今日', value: todayRange },
  { label: '昨日', value: yesterdayRange },
  { label: '本周', value: thisWeekRange },
  { label: '上周', value: lastWeekRange },
  { label: '本月', value: thisMonthRange },
  { label: '上月', value: lastMonthRange },
]

/** 原型统一时间范围选择器（含左侧快捷项 + 时分秒 + 清空/确定） */
export default function FilterRangePicker(props: RangePickerProps) {
  return (
    <DatePicker.RangePicker
      showTime
      needConfirm
      allowClear
      placeholder={['开始时间', '结束时间']}
      presets={FILTER_RANGE_PRESETS}
      {...props}
    />
  )
}
