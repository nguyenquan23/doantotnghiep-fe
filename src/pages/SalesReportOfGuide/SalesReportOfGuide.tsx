/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import Pagination from '@mui/material/Pagination'
import { lighten } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import statisticApi from 'src/apis/statistic.api'
import { PaginationParams } from 'src/types/pagination-params.type'
import { GuideInStatistic } from 'src/types/statistic.type'
import GradeIcon from '@mui/icons-material/Grade'
import { useTranslation } from 'react-i18next'

ChartJS.register(ArcElement, Tooltip, Legend)

const SalesReportOfGuide: React.FC = () => {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    limit: 8
  })
  const { data: statisticsData, isLoading } = useQuery({
    queryKey: [`sales report of guide in page ${pagination.page}`, pagination],
    queryFn: () => statisticApi.getStatisticOfGuide(pagination),
    staleTime: 10 * 1000
  })
  const { data: popularGuidesData } = useQuery({
    queryKey: [`statistic of popular guides`],
    queryFn: () => statisticApi.getStatisticOfPopularGuide()
  })

  const columns = useMemo<MRT_ColumnDef<GuideInStatistic>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 10
      },
      {
        accessorKey: 'fullName',
        header: t('pages.salesReportOfGuide.name'),
        size: 30
      },
      {
        accessorKey: 'email',
        header: t('pages.salesReportOfGuide.email'),
        size: 30
      },
      {
        accessorKey: 'address',
        header: t('pages.salesReportOfGuide.address'),
        size: 30
      },
      {
        accessorKey: 'overallRating',
        header: t('pages.salesReportOfGuide.rating'),
        Cell: ({ cell }) => (
          <div className='flex items-center gap-1'>
            <GradeIcon className='text-yellow-400' fontSize='small' />
            {cell.getValue<number>()}
          </div>
        ),
        size: 30
      },
      {
        accessorKey: 'totalBooking',
        header: t('pages.salesReportOfGuide.totalBookings'),
        size: 30
      },
      {
        accessorKey: 'totalTravelerNumber',
        header: t('pages.salesReportOfGuide.totalTravelers'),
        size: 30
      },
      {
        accessorKey: 'totalRevenue',
        header: t('pages.salesReportOfGuide.revenue'),
        Cell: ({ cell }) => <span>${cell.getValue<number>()?.toLocaleString()}</span>,
        size: 30
      }
    ],
    []
  )

  const table = useMaterialReactTable<GuideInStatistic>({
    columns,
    data: statisticsData?.data.data.statisticalGuideDTOS ?? [],
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
      animation: 'pulse',
      height: '12px'
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
    ),
    renderTopToolbarCustomActions: () => (
      <h2 className='pt-3 text-xl'>{t('pages.salesReportOfGuide.salesReportOfGuide')}</h2>
    )
  })

  return (
    <Box className='grid grid-cols-12 gap-4'>
      <Box className='col-span-12 lg:col-span-6'>
        <MaterialReactTable table={table} />
      </Box>
      <Card className='col-span-12 flex flex-col gap-2 px-3 pb-3 lg:col-span-6'>
        <h2 className='mb-8 pt-3 text-xl'>{t('pages.salesReportOfGuide.top5Guide')}</h2>
        <Pie
          options={{
            aspectRatio: 2
          }}
          data={{
            labels: popularGuidesData?.data.data.map((data) => (data.fullName ? data.fullName : data.email)),
            datasets: [
              {
                label: 'Total booking',
                data: popularGuidesData?.data.data.map((data) => data.totalBooking),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }
            ]
          }}
        />
      </Card>
    </Box>
  )
}

export default SalesReportOfGuide
