import { QueryObserverResult, useMutation, useQuery } from '@tanstack/react-query'
import tourApi from 'src/apis/tour.api'
import TourForm, { TourFormData } from '../TourForm'
import { toast } from 'react-toastify'
import Loading from 'src/pages/Loading/Loading'

export type TourUpdateFormData = TourFormData & { id: string }

interface UpdateTourFormProps {
  onCancel: () => void
  tourId: string
  setUpdateMode: React.Dispatch<React.SetStateAction<boolean>>
  refetch: () => Promise<QueryObserverResult>
}

const UpdateTourForm: React.FC<UpdateTourFormProps> = ({
  onCancel,
  tourId,
  setUpdateMode,
  refetch
}: UpdateTourFormProps) => {
  const { data: tourQuery } = useQuery({
    queryKey: [`Get tour by id ${tourId}`],
    queryFn: () => tourApi.getTourById(tourId as string)
  })

  const updateTourMutation = useMutation({
    mutationFn: (body: TourUpdateFormData) => {
      return tourApi.updateTour(body)
    }
  })

  const handleUpdateTourForm = (body: TourFormData) => {
    const formattedBody = { id: tourId, ...body }

    updateTourMutation.mutate(formattedBody, {
      onSuccess: () => {
        setUpdateMode(false)
        refetch()
        toast.success('Update the tour successfully.')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  return (
    <>
      {tourQuery?.data.data ? (
        <TourForm
          onSubmit={handleUpdateTourForm}
          onCancel={onCancel}
          defaultValue={tourQuery.data.data}
          isMutation={updateTourMutation.isPending}
        />
      ) : (
        <Loading />
      )}
    </>
  )
}

export default UpdateTourForm
