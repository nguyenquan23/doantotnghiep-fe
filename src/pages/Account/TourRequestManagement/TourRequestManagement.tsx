import ButtonGroup from '@mui/material/ButtonGroup'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import requestApi from 'src/apis/request.api'
import { AppContext } from 'src/contexts/app.context'
import { StatusRequest } from 'src/enums/status-request.enum'
import Loading from 'src/pages/Loading/Loading'
import { Request } from 'src/types/request.type'
import ButtonComponent from './components/ButtonComponent'
import RequestComponent from './components/RequestComponent'
import { TourStatus } from 'src/enums/tour-status.enum'
import { useLocation } from 'react-router-dom'
import { UserRole } from 'src/enums/user-role.enum'
import { useTranslation } from 'react-i18next'

const TourRequestManagement: React.FC = () => {
  const { profile, isAuthenticated } = useContext(AppContext)
  const [isGuide, setIsGuide] = useState<boolean>(profile?.role === UserRole.GUIDER)
  const location = useLocation()
  const { t } = useTranslation()
  const { data: requestsData, refetch } = useQuery({
    queryKey: [`requests of  ${profile?.id}`],
    queryFn: () => requestApi.getRequests(),
    staleTime: 6 * 1000
  })
  const [requestStatus, setRequestStatus] = useState<StatusRequest>(StatusRequest.PENDING)
  const [displayData, setDisplayData] = useState<Request[]>([])

  useEffect(() => {
    let displayRequestsData: Request[] = []
    if (requestsData && requestsData.data.data.length > 0 && profile) {
      let checkTraveler = true
      if (parseInt(profile.id) === requestsData.data.data[0].guide.id) {
        checkTraveler = false
        setIsGuide(true)
      }
      if (profile.id === requestsData.data.data[0].traveler?.id) {
        setIsGuide(false)
      }
      displayRequestsData = checkTraveler
        ? requestsData.data.data
            .filter((item) => {
              if (requestStatus === StatusRequest.PENDING)
                return (
                  item.status === StatusRequest.PENDING.toUpperCase() ||
                  item.status === StatusRequest.ACCEPTED.toUpperCase() ||
                  (item.tour ? item.tour.status === TourStatus.PENDING : false)
                )
              if (requestStatus === StatusRequest.CANCELED)
                return (
                  item.status === StatusRequest.CANCELED.toUpperCase() ||
                  item.status === StatusRequest.DENIED.toUpperCase() ||
                  (item.tour ? item.tour.status === TourStatus.DENY : false)
                )
              if (requestStatus === StatusRequest.DONE)
                return item.tour ? item.tour.status === TourStatus.ACCEPT : false
              return item.status === requestStatus.toUpperCase()
            })
            .map((item) => item)
        : requestsData.data.data
            .filter((item) => {
              if (requestStatus === StatusRequest.PENDING) return item.status === StatusRequest.PENDING.toUpperCase()
              if (requestStatus === StatusRequest.ACCEPTED)
                return (
                  (item.tour ? item.tour.status === TourStatus.PENDING : false) ||
                  item.status === requestStatus.toUpperCase()
                )
              if (requestStatus === StatusRequest.DENIED)
                return (
                  item.status === StatusRequest.DENIED.toUpperCase() ||
                  (item.tour ? item.tour.status === TourStatus.DENY : false)
                )
              if (requestStatus === StatusRequest.DONE)
                return item.tour ? item.tour.status === TourStatus.ACCEPT : false
              return item.status === requestStatus.toUpperCase()
            })
            .map((item) => item)
    }
    setDisplayData(displayRequestsData)
  }, [requestsData, requestStatus, profile])

  useEffect(() => {
    if (location.state && location.state.statusRequest === StatusRequest.DRAFT) {
      setRequestStatus(StatusRequest.DRAFT)
    }
  }, [location])

  const handleQuantity = (item: StatusRequest) => {
    if (requestsData) {
      if (!isGuide) {
        if (item === StatusRequest.PENDING)
          return requestsData.data.data
            .filter(
              (data) =>
                data.status === item.toUpperCase() ||
                data.status === StatusRequest.ACCEPTED.toUpperCase() ||
                (data.tour ? data.tour.status === TourStatus.PENDING : false)
            )
            .map((item) => item).length
        if (item === StatusRequest.CANCELED)
          return requestsData.data.data
            .filter((data) => data.status === item.toUpperCase() || data.status === StatusRequest.DENIED.toUpperCase())
            .map((item) => item).length
        if (item === StatusRequest.DONE)
          return requestsData.data.data
            .filter((data) => (data.tour ? data.tour.status === TourStatus.ACCEPT : false))
            .map((item) => item).length
        return requestsData.data.data.filter((data) => data.status === item.toUpperCase()).map((item) => item).length
      }
      if (isGuide) {
        if (item === StatusRequest.PENDING)
          return requestsData.data.data.filter((data) => data.status === item.toUpperCase()).map((item) => item).length
        if (item === StatusRequest.ACCEPTED)
          return requestsData.data.data
            .filter(
              (data) => (data.tour && data.tour.status === TourStatus.PENDING) || data.status === item.toUpperCase()
            )
            .map((item) => item).length
        if (item === StatusRequest.DENIED)
          return requestsData.data.data
            .filter((data) => data.status === item.toUpperCase() || (data.tour && data.tour.status === TourStatus.DENY))
            .map((item) => item).length
        if (item === StatusRequest.DONE)
          return requestsData.data.data
            .filter((data) => data.tour && data.tour.status === TourStatus.ACCEPT)
            .map((item) => item).length
        return requestsData.data.data.filter((data) => data.status === item.toUpperCase()).map((item) => item).length
      }
    }
    return 0
  }

  return (
    <div className='flex flex-col gap-4'>
      {isAuthenticated && !requestsData?.data.data && <Loading />}
      {isAuthenticated && requestsData?.data.data && requestsData.data.data.length > 0 ? (
        <div className=''>
          <h2 className='border-b-1 mb-2 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
            {t('pages.tourRequestManagement.tourRequestManagement')}
          </h2>
          {isGuide && (
            <ButtonGroup
              variant='outlined'
              aria-label='Basic button group'
              sx={{
                width: '100%',
                overflowX: 'scroll',
                button: {
                  flex: 'none'
                },
                '::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {Object.values(StatusRequest)
                .filter((item) => item !== StatusRequest.CANCELED && item !== StatusRequest.DRAFT)
                .map((item) => (
                  <ButtonComponent
                    key={item}
                    setRequestStatus={setRequestStatus}
                    requestStatus={item}
                    currentRequestStatus={requestStatus}
                    quantity={handleQuantity(item)}
                  />
                ))}
            </ButtonGroup>
          )}
          {!isGuide && (
            <ButtonGroup
              variant='outlined'
              aria-label='Basic button group'
              sx={{
                width: '100%',
                overflowX: 'scroll',
                button: {
                  flex: 'none'
                },
                '::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {Object.values(StatusRequest)
                .filter((item) => item !== StatusRequest.ACCEPTED && item !== StatusRequest.DENIED)
                .map((item) => (
                  <ButtonComponent
                    key={item}
                    setRequestStatus={setRequestStatus}
                    requestStatus={item}
                    currentRequestStatus={requestStatus}
                    quantity={handleQuantity(item)}
                  />
                ))}
            </ButtonGroup>
          )}
          <div className='mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {displayData.map((request) => {
              return (
                <div key={request.id} className='col-span-1'>
                  <RequestComponent
                    request={request}
                    isGuide={isGuide}
                    refetch={refetch}
                    setRequestStatus={setRequestStatus}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className='flex h-full flex-col items-center justify-center'>
          <img
            src='/assets/images/empty-booking.png'
            alt='Empty request'
            loading='lazy'
            className='mb-2 h-72 w-72 object-cover'
          />
          <h3>{t('pages.tourRequestManagement.noRequest')}</h3>
        </div>
      )}
    </div>
  )
}

export default TourRequestManagement
