import { months } from 'src/constants/months.constant'
import { MonthStatisticResult } from 'src/types/statistic.type'

export const chartOptions = (text: string) => {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text
      }
    }
  }
}

export const chartData = (
  labels: string[],
  datasetsLabel: string,
  data: unknown[],
  borderColor: string,
  backgroundColor: string
) => {
  return {
    labels,
    datasets: [
      {
        label: datasetsLabel,
        data,
        fill: false,
        borderColor,
        backgroundColor,
        tension: 0.4
      }
    ]
  }
}

export const generateChartData = (data: MonthStatisticResult[] | undefined, key: 'bookingOfNumber' | 'revenue') => {
  return months.map((month) => {
    const monthData = data?.find((statistic) => statistic.month === months.indexOf(month) + 1)
    return monthData ? monthData[key] : 0
  })
}
