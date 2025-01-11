/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { lighten } from '@mui/material/styles'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MRT_Cell, MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import tourApi from 'src/apis/tour.api'
import ConfirmDialog from 'src/components/ConfirmDialog/ConfirmDialog'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { StatusRequest } from 'src/enums/status-request.enum'
import { TourStatus } from 'src/enums/tour-status.enum'
import { Unit } from 'src/enums/unit.enum'
import { UserRole } from 'src/enums/user-role.enum'
import { Request } from 'src/types/request.type'
import { Tour } from 'src/types/tour.type'
import { TourSchema } from 'src/utils/rules'
import TourForm from '../components/TourForm'
import UpdateTourForm from '../components/TourForm/UpdateTourForm/UpdateTourForm'

type TourFormData = TourSchema
export type UpdateTourFormData = TourSchema & {
  id: number
}

interface Props {
  guideId?: string
}

export default function TourManagement({ guideId }: Props) {
  const { profile } = useContext(AppContext)
  const { t } = useTranslation()
  const [createMode, setCreateMode] = useState<boolean>(false)
  const [updateMode, setUpdateMode] = useState<boolean>(false)
  const [deleteMode, setDeleteMode] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>('')
  const isOwner = !guideId
  const location = useLocation()
  const navigate = useNavigate()
  const [request, setRequest] = useState<Request>({
    id: 0,
    transportation: [],
    duration: 0,
    unit: Unit.DAYS,
    maxPricePerPerson: 0,
    numberOfTravelers: 0,
    destination: '',
    message: '',
    phone: '',
    guide: {
      id: 0,
      email: '',
      fullName: '',
      dateOfBirth: new Date(),
      phone: '',
      address: '',
      biography: '',
      credential: '',
      overallRating: 0,
      avatar: '',
      numberOfReviews: 0,
      languageSkill: []
    },
    traveler: {
      id: '',
      email: '',
      role: UserRole.TRAVELER
    },
    status: StatusRequest.PENDING,
    tour: {
      id: 0,
      name: '',
      description: '',
      transportation: '',
      includeService: '',
      duration: 0,
      unit: '',
      startTimes: [],
      overallRating: 0,
      estimatedLocalCashNeeded: '',
      pricePerTraveler: 0,
      limitTraveler: 0,
      province: '',
      itinerary: '',
      categories: [],
      guide: {
        id: '',
        email: '',
        role: UserRole.GUIDER
      },
      images: [],
      locations: [],
      status: TourStatus.PENDING
    }
  })

  useEffect(() => {
    if (location.state?.request) {
      setCreateMode(true)
      setRequest(location.state?.request)
    }
  }, [location.state?.request])

  const {
    data: guideToursData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: [`tours of guide ${guideId ? guideId : profile?.id}`],
    queryFn: () => tourApi.getToursOfGuide(guideId ? guideId : profile?.id ? profile.id : ''),
    staleTime: 6 * 1000
  })

  const createTourMutation = useMutation({
    mutationFn: (body: TourFormData) => tourApi.createTour(body)
  })

  const createRequestTourMutation = useMutation({
    mutationFn: (body: TourFormData) => tourApi.createRequestTour(location.state?.request.id, body)
  })

  const deleteTourMutation = useMutation({
    mutationFn: (selectedId: string) => tourApi.deleteTour(selectedId)
  })

  const handleCreateTourForm = (tourForm: TourFormData) => {
    const formattedTourForm: TourFormData & { guide: { id: string } } = {
      ...tourForm,
      startTimes: tourForm.startTimes?.map((time) => time?.toLocaleTimeString('en-US', { hour12: false })),
      guide: {
        id: profile!.id
      }
    }

    if (!location.state?.request.id) {
      createTourMutation.mutate(formattedTourForm, {
        onSuccess: () => {
          setCreateMode(false)
          refetch()
          toast.success('Create the tour successfully.')
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
      return
    }

    createRequestTourMutation.mutate(formattedTourForm, {
      onSuccess: () => {
        setCreateMode(false)
        refetch()
        toast.success('Create the tour successfully.')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  const handleCancelTourForm = () => {
    setCreateMode(false)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleUpdateTourForm = (id: string) => {
    setSelectedId(id)
    setUpdateMode(true)
  }

  const handleCancelUpdateTourForm = () => {
    setUpdateMode(false)
    setSelectedId('')
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleDelete = (id: string) => {
    setSelectedId(id)
    setDeleteMode(true)
  }

  const handleCloseDelete = () => {
    setDeleteMode(false)
  }

  const handleConfirmDelete = () => {
    deleteTourMutation.mutate(selectedId, {
      onSuccess: () => {
        setDeleteMode(false)
        refetch()
        toast.success('Delete the tour successfully.')
      },
      onError: (error) => {
        setDeleteMode(false)
        toast.error(error.message)
      }
    })
  }

  const baseColumns = useMemo<MRT_ColumnDef<Tour>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'id',
        size: 10
      },
      {
        accessorKey: 'name',
        header: t('pages.tourManagement.name'),
        size: 200
      },
      {
        accessorKey: 'transportation',
        header: t('pages.tourManagement.trans'),
        size: 50
      },
      {
        accessorKey: 'duration',
        header: t('pages.tourManagement.duration'),
        size: 20
      },
      {
        accessorKey: 'unit',
        header: t('pages.tourManagement.unit'),
        size: 20,
        Cell: ({ cell }) => <span>{t(`pages.tourManagement.${cell.getValue<string>()}`)}</span>
      },
      {
        accessorKey: 'pricePerTraveler',
        header: t('pages.tourManagement.price'),
        size: 100,
        Cell: ({ cell }) => <span>${cell.getValue<number>()?.toLocaleString()}</span>
      }
    ],
    []
  )

  const statusColumn = {
    accessorKey: 'status',
    header: t('pages.tourManagement.status'),
    size: 20,
    Cell: ({ cell }: { cell: MRT_Cell<Tour> }) => {
      switch (cell.getValue() as string) {
        case 'PENDING':
          return <Chip label={t('enums.tourStatus.PENDING')} color='warning' size='small' />
        case 'ACCEPT':
          return <Chip label={t('enums.tourStatus.ACCEPT')} color='success' size='small' />
        case 'DENY':
          return <Chip label={t('enums.tourStatus.DENY')} color='error' size='small' />
        default:
          return
      }
    }
  }

  const actionColumn = {
    accessorKey: 'action',
    header: t('pages.tourManagement.actions'),
    size: 100,
    Cell: ({ cell }: { cell: MRT_Cell<Tour> }) => (
      <>
        <IconButton
          color='primary'
          aria-label='update tour'
          className='cursor-pointer'
          onClick={(event) => {
            event.stopPropagation(), handleUpdateTourForm(cell.row.original.id.toString())
          }}
        >
          <ModeEditOutlineOutlinedIcon />
        </IconButton>
        <IconButton
          color='error'
          aria-label='delete tour'
          className='cursor-pointer'
          onClick={(event) => {
            event.stopPropagation(), handleDelete(cell.row.original.id.toString())
          }}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </>
    )
  }

  const columns = useMemo<MRT_ColumnDef<Tour>[]>(() => {
    if (isOwner) {
      return [...baseColumns, statusColumn, actionColumn]
    }
    return baseColumns
  }, [isOwner])

  const [displayData, setDisplayData] = useState<Tour[]>()
  useEffect(() => {
    if (isOwner) return setDisplayData(guideToursData?.data.data)
    return setDisplayData(guideToursData?.data.data.filter((item) => item.status === TourStatus.ACCEPT))
  }, [guideToursData])

  const table = useMaterialReactTable<Tour>({
    columns,
    data: displayData ?? [],
    state: {
      isLoading
    },
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => navigate(`${PATH.tourDetail.replace(':id', row.original.id.toString())}`),
      sx: { cursor: 'pointer' }
    }),
    renderTopToolbarCustomActions: () =>
      isOwner ? (
        <Button startIcon={<AddIcon />} variant='contained' className='w-fit' onClick={() => setCreateMode(true)}>
          {t('pages.tourManagement.createTour')}
        </Button>
      ) : (
        ''
      )
  })

  return (
    <div className='flex h-full w-full flex-col'>
      {!createMode && !updateMode && (
        <>
          {isOwner && (
            <h2 className='account-profile__header border-b-1 mb-6 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
              {t('pages.tourManagement.tourManagement')}
            </h2>
          )}
          <MaterialReactTable table={table} />
        </>
      )}
      {createMode && (
        <>
          <h2 className='account-profile__header border-b-1 mb-6 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
            {t('pages.tourManagement.createTour')}
          </h2>
          <TourForm
            onSubmit={handleCreateTourForm}
            onCancel={handleCancelTourForm}
            isMutation={createTourMutation.isPending}
            request={request}
          />
        </>
      )}
      {updateMode && (
        <>
          <h2 className='account-profile__header border-b-1 mb-6 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1 capitalize'>
            {t('pages.tourManagement.updateTour')}
          </h2>
          <UpdateTourForm
            tourId={selectedId}
            onCancel={handleCancelUpdateTourForm}
            setUpdateMode={setUpdateMode}
            refetch={refetch}
          />
        </>
      )}
      {deleteMode && (
        <ConfirmDialog
          title='Confirm Delete'
          content='Are you sure you want to delete this tour?'
          handleClose={handleCloseDelete}
          handleConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
