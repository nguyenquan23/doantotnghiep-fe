/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { lighten } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'
import tourApi from 'src/apis/tour.api'
import { PaginationParams } from 'src/types/pagination-params.type'
import { Tour } from 'src/types/tour.type'
import TourDetailsDialog from '../../components/TourDetailsDialog/TourDetailsDialog'
import PersonIcon from '@mui/icons-material/Person'
import { useTranslation } from 'react-i18next'

const TourConfirmation: React.FC = () => {
  const [openTourDetailDialog, setOpenTourDetailDialog] = useState(false)
  const [selectedTourId, setSelectedTourId] = useState<number | undefined>(undefined)
  const { t } = useTranslation()
  const [pagination] = useState<PaginationParams>({
    page: 0,
    limit: 8
  })
  const {
    data: tourRequestsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: [`tour requests in page ${pagination.page}`, pagination],
    queryFn: () => tourApi.getPendingTours()
  })
  const { data: pendingTourDetailsData, isPending: isPendingTourDetail } = useQuery({
    queryKey: [`pending tour details with id ${selectedTourId}`, selectedTourId],
    queryFn: () => tourApi.getTourById(selectedTourId as number),
    staleTime: 60 * 1000,
    enabled: selectedTourId != undefined
  })

  const handleCloseTourDetailDialog = () => {
    setSelectedTourId(undefined)
    setOpenTourDetailDialog(false)
  }

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 30
      },
      {
        accessorKey: 'name',
        header: t('pages.tourList.name'),
        size: 200
      },
      {
        accessorKey: 'guide',
        accessorFn: (originalRow) => originalRow.guide.fullName || originalRow.guide.email,
        header: t('pages.tourList.guide'),
        size: 100
      },
      {
        accessorKey: 'address',
        accessorFn: (originalRow) => originalRow.locations[0].name,
        header: t('pages.tourList.address'),
        size: 100
      },
      {
        accessorKey: 'duration',
        accessorFn: (originalRow) => originalRow.duration,
        header: t('pages.tourList.duration'),
        size: 30
      },
      {
        accessorKey: 'unit',
        accessorFn: (originalRow) => originalRow.unit,
        header: t('pages.tourList.unit'),
        size: 30
      },
      {
        accessorKey: 'pricePerTraveler',
        header: t('pages.tourList.pricePerTraveler'),
        size: 30,
        Cell: ({ cell }) => <span>${cell.getValue<number>()?.toLocaleString()}</span>
      },
      {
        accessorKey: 'limitTraveler',
        header: t('pages.tourList.limitTravelers'),
        Cell: ({ cell }) => (
          <div className='flex items-center gap-1'>
            <PersonIcon className='text-blue-400' fontSize='small' />
            {cell.getValue<number>()}
          </div>
        ),
        size: 30
      }
    ],
    []
  )

  const table = useMaterialReactTable<any>({
    columns,
    data: tourRequestsData?.data.data ?? [],
    state: {
      isLoading
    },
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setOpenTourDetailDialog(true)
        setSelectedTourId(row.original.id)
      },
      sx: {
        cursor: 'pointer'
      }
    }),
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined'
    },
    paginationDisplayMode: 'pages',
    renderTopToolbarCustomActions: () => <h2 className='pt-3 text-xl'>Tour Confirmation</h2>
  })

  return (
    <>
      <MaterialReactTable table={table} />
      {openTourDetailDialog && (
        <TourDetailsDialog
          tourData={pendingTourDetailsData?.data.data as Tour}
          isPendingTourDetail={isPendingTourDetail}
          handleCloseTourDetailDialog={handleCloseTourDetailDialog}
          refetch={refetch}
        />
      )}
    </>
  )
}

export default TourConfirmation
