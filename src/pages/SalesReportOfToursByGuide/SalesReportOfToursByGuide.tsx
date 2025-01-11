/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import { lighten } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import statisticApi from 'src/apis/statistic.api'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { PaginationParams } from 'src/types/pagination-params.type'
import { TourInStatistic } from 'src/types/statistic.type'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { months } from 'src/constants/months.constant'
import dayjs, { Dayjs } from 'dayjs'
import { chartData, chartOptions, generateChartData } from 'src/utils/chart'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import GradeIcon from '@mui/icons-material/Grade'
import PersonIcon from '@mui/icons-material/Person'
import { useTranslation } from 'react-i18next'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const SalesReportOfToursByGuide: React.FC = () => {
  const { profile } = useContext(AppContext)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentYear, setCurrentYear] = useState<Dayjs>(dayjs())
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    limit: 10
  })
  const { data: statisticsData, isLoading } = useQuery({
    queryKey: [`sales report of tour by guide with id ${profile?.id} in page ${pagination?.page}`, pagination],
    queryFn: () => statisticApi.getStatisticOfTourByGuide(pagination),
    staleTime: 10 * 1000
  })
  const { data: statisticsByYearData } = useQuery({
    queryKey: [`statistic of tour in year ${currentYear} by guide ${profile?.id}`, currentYear, profile?.id],
    queryFn: () => statisticApi.getYearStatisticOfTourByGuide(currentYear.year()),
    staleTime: 10 * 1000
  })

  const columns = useMemo<MRT_ColumnDef<TourInStatistic>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 10
      },
      {
        accessorKey: 'name',
        header: t('pages.salesReport.name'),
        size: 200
      },
      {
        accessorKey: 'limitTraveler',
        header: t('pages.salesReport.limitTravelers'),
        Cell: ({ cell }) => (
          <div className='flex items-center gap-1'>
            <PersonIcon className='text-blue-400' fontSize='small' />
            {cell.getValue<number>()}
          </div>
        ),
        size: 30
      },
      {
        accessorKey: 'totalRevenue',
        header: t('pages.salesReport.totalRevenue'),
        size: 30,
        Cell: ({ cell }) => <span>${cell.getValue<number>()?.toLocaleString()}</span>
      },
      {
        accessorKey: 'overallRating',
        header: t('pages.salesReport.overallRating'),
        Cell: ({ cell }) => (
          <div className='flex items-center gap-1'>
            <GradeIcon className='text-yellow-400' fontSize='small' />
            {cell.getValue<number>()}
          </div>
        ),
        size: 30
      },
      {
        accessorKey: 'totalTravelerNumber',
        header: t('pages.salesReport.totalBooked'),
        size: 30
      }
    ],
    []
  )

  const table = useMaterialReactTable<TourInStatistic>({
    columns,
    data: statisticsData?.data.data.statisticalTourDTOS ?? [],
    state: {
      isLoading
    },
    enablePagination: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      variant: 'outlined'
    },
    paginationDisplayMode: 'pages',
    muiSkeletonProps: {
      animation: 'wave'
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => navigate(`${PATH.tourDetail.replace(':id', row.original.id.toString())}`),

      sx: { cursor: 'pointer' }
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: '650px'
      }
    },
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
    )
  })

  return (
    <>
      <h2 className='border-b-1 mb-6 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
        {t('pages.salesReport.salesReport')}
      </h2>
      <Box className='flex flex-col gap-2'>
        <Card className='col-span-12 flex flex-col gap-2 p-3 lg:col-span-6'>
          <Box className='flex items-center gap-4'>
            <strong>{t('pages.salesReport.selectYear')}: </strong>
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
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Line
                className='w-1/2'
                options={chartOptions(t('pages.salesReport.revenueByYear'))}
                data={chartData(
                  months,
                  t('pages.salesReport.revenue'),
                  generateChartData(statisticsByYearData?.data.data.monthDTOS, 'revenue'),
                  'rgb(255, 99, 132)',
                  'rgba(255, 99, 132, 0.5)'
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Bar
                className='w-1/2'
                options={chartOptions(t('pages.salesReport.numberOfBookingsByYear'))}
                data={chartData(
                  months,
                  t('pages.salesReport.numberOfBookings'),
                  generateChartData(statisticsByYearData?.data.data.monthDTOS, 'bookingOfNumber'),
                  'rgb(53, 162, 235)',
                  'rgba(53, 162, 235, 0.5)'
                )}
              />
            </Grid>
          </Grid>
        </Card>
        <MaterialReactTable table={table} />
      </Box>
    </>
  )
}

export default SalesReportOfToursByGuide
