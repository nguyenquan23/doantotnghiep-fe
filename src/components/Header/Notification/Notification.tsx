/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import notificationApi from 'src/apis/notifications.api'
import { AppContext } from 'src/contexts/app.context'
import Loading from 'src/pages/Loading/Loading'
import { Notification as NotificationType } from 'src/types/notification.type'
import NotificationItem from './NotificationItem/NotificationItem'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from 'src/types/utils.type'
import { messaging } from 'src/FirebaseConfig'
import { toast } from 'react-toastify'
import { onMessage } from 'firebase/messaging'
import { useTranslation } from 'react-i18next'

interface NotificationProps {
  textColor: string
}

const Notification: React.FC<NotificationProps> = ({ textColor }: NotificationProps) => {
  const { profile } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [responseRealtime, setResponseRealtime] = useState<NotificationType | null>(null)
  const [countOfUnReadNotification, setCountOfUnReadNotification] = useState<number>(0)
  const { ref, inView } = useInView()
  const { t } = useTranslation()
  const {
    data: notificationsData,
    isPending,
    fetchPreviousPage,
    hasPreviousPage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: [`notification of user with id ${profile?.id}`, responseRealtime],
    queryFn: notificationApi.getNotifications,
    initialPageParam: 0,
    getNextPageParam: (lastPage, __allPages, lastPageParam) => {
      if (lastPage.data.data.length === 0) return undefined
      return lastPageParam + 1
    },
    getPreviousPageParam: (__firstPage, __allPages, firstPageParam, __allPageParams) => {
      if (firstPageParam > 0) return firstPageParam - 1
      return undefined
    }
  })
  const open = Boolean(anchorEl)

  const getCountOfIsNotReadNotificationsMutation = useMutation({
    mutationFn: () => notificationApi.getCountOfIsNotReadNotifications()
  })

  const getCountOfIsNotReadNotifications = () => {
    getCountOfIsNotReadNotificationsMutation.mutate(undefined, {
      onSuccess: (data: AxiosResponse<SuccessResponse<number>, any>) => {
        setCountOfUnReadNotification(data.data.data)
      },
      onError: (error: any) => {
        toast.error(error.message)
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      getCountOfIsNotReadNotifications()
    }, 1000)
  }, [])

  useEffect(() => {
    const onMessageListener = async () => {
      const messagingResolve = await messaging
      if (messagingResolve) {
        onMessage(messagingResolve, (payload: any) => {
          setResponseRealtime(JSON.parse(payload.notification.body))
          setTimeout(() => {
            getCountOfIsNotReadNotifications()
          }, 500)
        })
      }
    }
    onMessageListener()
  }, [profile?.email, responseRealtime])

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  useEffect(() => {
    if (inView && hasPreviousPage) fetchPreviousPage()
  }, [inView, hasPreviousPage, fetchPreviousPage])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <Box
      className='relative ml-2 flex w-8 cursor-pointer flex-col items-center text-base 
md:after:absolute md:after:bottom-[0px] md:after:left-0 md:after:h-[2.25px] md:after:w-0 
md:after:bg-orange-500 md:after:transition-all md:after:duration-300 xl:w-full xl:hover:after:w-full'
    >
      <Button
        aria-label='notification'
        size='small'
        onClick={handleClick}
        className='flex flex-col pr-0 text-inherit'
        disableRipple
        disableFocusRipple
        sx={{
          color: textColor,
          '&.MuiButtonBase-root:hover': {
            bgcolor: 'transparent'
          }
        }}
      >
        <Badge badgeContent={countOfUnReadNotification} color='error'>
          <NotificationsIcon sx={{ color: textColor }} />
        </Badge>
        <span className='mt-[5px] hidden text-nowrap xl:block xl:text-sm'>{t('components.header.notifications')}</span>
      </Button>
      <Menu
        disableScrollLock
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          maxHeight: '500px',
          minHeight: '400px',
          '& .MuiPaper-root': {
            marginTop: '4px',
            minWidth: 300
          },
          '& .MuiList-root': {
            paddingY: 0
          }
        }}
      >
        <Box sx={{ background: (theme) => theme.palette.primary.main, paddingY: '10px', paddingX: '16px' }}>
          <Typography variant='subtitle2' sx={{ color: 'white', fontSize: '1.1rem' }}>
            {t('components.notifications.notifications')}
          </Typography>
        </Box>
        {isPending && (
          <Box sx={{ marginY: '0.5rem' }}>
            <Loading />
          </Box>
        )}
        {!isPending &&
          notificationsData?.pages.map((page, index) => {
            if (notificationsData?.pages.length === 1 && notificationsData?.pages[0].data.data.length === 0) {
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    marginY: '1rem',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src='/assets/images/empty-notification.png'
                    alt='Empty notification'
                    loading='lazy'
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    {t('components.notifications.noNotificationsYet')}
                  </Typography>
                  <Typography variant='body1' sx={{ textAlign: 'center', fontSize: '14px' }}>
                    {t('components.notifications.comebackLater')}
                  </Typography>
                </Box>
              )
            }
            return page.data.data.map((notification: NotificationType, index) => {
              if (page.data.data.length === index + 1)
                return (
                  <NotificationItem
                    innerRef={ref}
                    key={notification.id}
                    data={notification}
                    getNotificationCount={getCountOfIsNotReadNotifications}
                  />
                )
              return (
                <NotificationItem
                  key={notification.id}
                  data={notification}
                  getNotificationCount={getCountOfIsNotReadNotifications}
                />
              )
            })
          })}
        {isFetchingNextPage && (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, paddingX: '1rem', paddingY: '0.5rem' }}>
              <Skeleton variant='circular' width={40} height={40} />
              <Skeleton variant='text' sx={{ flexGrow: 1 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, paddingX: '1rem', paddingY: '0.5rem' }}>
              <Skeleton variant='circular' width={40} height={40} />
              <Skeleton variant='text' sx={{ flexGrow: 1 }} />
            </Box>
          </Box>
        )}
      </Menu>
    </Box>
  )
}
export default Notification
