/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import Pagination from '@mui/material/Pagination'
import { lighten } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useQuery } from '@tanstack/react-query'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import dayjs, { Dayjs } from 'dayjs'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import statisticApi from 'src/apis/statistic.api'
import tourApi from 'src/apis/tour.api'
import { months } from 'src/constants/months.constant'
import { PaginationParams } from 'src/types/pagination-params.type'
import { TourInStatistic } from 'src/types/statistic.type'
import { Tour } from 'src/types/tour.type'
import { chartData, chartOptions, generateChartData } from 'src/utils/chart'
import TourDetailsDialog from '../../components/TourDetailsDialog/TourDetailsDialog'
import { useTranslation } from 'react-i18next'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const SalesReportOfTour: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<Dayjs>(dayjs())
  const [openTourDetailDialog, setOpenTourDetailDialog] = useState(false)
  const [selectedTourId, setSelectedTourId] = useState<number | undefined>(undefined)
  const { t } = useTranslation()
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    limit: 8
  })
  const { data: statisticsData, isLoading } = useQuery({
    queryKey: [`sales report of tour in page ${pagination.page}`, pagination],
    queryFn: () => statisticApi.getStatisticOfTour(pagination),
    staleTime: 10 * 1000
  })
  const { data: pendingTourDetailsData, isPending: isPendingTourDetail } = useQuery({
    queryKey: [`tour details with id ${selectedTourId}`, selectedTourId],
    queryFn: () => tourApi.getTourById(selectedTourId as number),
    staleTime: 60 * 1000,
    enabled: selectedTourId != undefined
  })
  const { data: statisticsByYearData } = useQuery({
    queryKey: [`statistic of tour in year ${currentYear} by admin`, currentYear],
    queryFn: () => statisticApi.getYearStatisticOfTourByAdmin(currentYear.year()),
    staleTime: 10 * 1000
  })

  const handleCloseTourDetailDialog = () => {
    setSelectedTourId(undefined)
    setOpenTourDetailDialog(false)
  }

  const columns = useMemo<MRT_ColumnDef<TourInStatistic>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 30
      },
      {
        accessorKey: 'name',
        header: t('pages.salesReportOfTours.name'),
        size: 200
      },
      {
        accessorKey: 'totalTravelerNumber',
        header: t('pages.salesReportOfTours.totalTravelers'),
        size: 30
      },
      {
        accessorKey: 'totalRevenue',
        header: t('pages.salesReportOfTours.revenue'),
        Cell: ({ cell }) => <span>${cell.getValue<number>()?.toLocaleString()}</span>,
        size: 30
      }
    ],
    []
  )

  const table = useMaterialReactTable<TourInStatistic>({
    columns,
    data: statisticsData?.data.data.tourDTOS ?? [],
    state: {
      isLoading
    },
    enablePagination: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    muiSkeletonProps: {
      animation: 'pulse',
      height: '12px'
    },
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      variant: 'outlined'
    },
    paginationDisplayMode: 'pages',
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setOpenTourDetailDialog(true)
        setSelectedTourId(row.original.id)
      },
      sx: { cursor: 'pointer' }
    }),
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td': {
          backgroundColor: lighten(theme.palette.primary.main, 0.9)
        }
      })
    },
    renderBottomToolbarCustomActions: () => (
      <Pagination
        showLastButton
        className='absolute right-5 top-1/4'
        onChange={(_, page) => {
          setPagination((prevPagination) => ({
            ...prevPagination,
            page: page - 1
          }))
        }}
        page={(pagination.page || 0) + 1}
        count={statisticsData?.data.data.totalOfPage || 1}
        variant='outlined'
        shape='rounded'
      />
    ),
    renderTopToolbarCustomActions: () => <h2 className='pt-3 text-xl'>Sales Report of Tours</h2>
  })

  return (
    <Box className='grid grid-cols-12 gap-4'>
      <Box className='col-span-12 lg:col-span-6'>
        <MaterialReactTable table={table} />
        {openTourDetailDialog && (
          <TourDetailsDialog
            tourData={pendingTourDetailsData?.data.data as Tour}
            isPendingTourDetail={isPendingTourDetail}
            handleCloseTourDetailDialog={handleCloseTourDetailDialog}
            readonly={true}
            refetch={() => {}}
          />
        )}
      </Box>
      <Card className='col-span-12 flex flex-col gap-2 p-3 lg:col-span-6'>
        <Box className='flex items-center gap-4'>
          <strong>{t('pages.salesReportOfTours.selectYear')}: </strong>
          <DatePicker
            views={['year']}
            className='h-fit w-fit'
            value={currentYear}
            onChange={(newYear) => {
              const year = newYear as Dayjs
              if (year.isValid()) setCurrentYear(year)
            }}
          />
        </Box>
        <Line
          options={chartOptions(t('pages.salesReportOfTours.revenueByYear'))}
          data={chartData(
            months,
            t('pages.salesReportOfTours.revenue$'),
            generateChartData(statisticsByYearData?.data.data.monthDTOS, 'revenue'),
            'rgb(255, 99, 132)',
            'rgba(255, 99, 132, 0.5)'
          )}
        />
        <Bar
          options={chartOptions(t('pages.salesReportOfTours.numberOfBookingsByYear'))}
          data={chartData(
            months,
            t('pages.salesReportOfTours.numberOfBookings'),
            generateChartData(statisticsByYearData?.data.data.monthDTOS, 'bookingOfNumber'),
            'rgb(53, 162, 235)',
            'rgba(53, 162, 235, 0.5)'
          )}
        />
      </Card>
    </Box>
  )
}

export default SalesReportOfTour
