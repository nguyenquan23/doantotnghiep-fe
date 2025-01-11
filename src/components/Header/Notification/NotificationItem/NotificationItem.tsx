import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import notificationApi from 'src/apis/notifications.api'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import { NotificationType } from 'src/enums/notification-type.enum'
import { Notification } from 'src/types/notification.type'
import { getRelativeTime } from 'src/utils/date-time'

interface NotificationItemProps {
  data: Notification
  innerRef?: React.Ref<HTMLParagraphElement>
  getNotificationCount: () => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  data,
  innerRef,
  getNotificationCount
}: NotificationItemProps) => {
  const { profile } = useContext(AppContext)
  const navigate = useNavigate()

  const updateReadNotificationStatusMutation = useMutation({
    mutationFn: (id: number) => notificationApi.updateReadNotificationStatus(id)
  })

  const handleNavigate = () => {
    updateReadNotificationStatusMutation.mutate(data.id, {
      onSuccess: () => {
        getNotificationCount()
        data.isRead = true
      }
    })

    switch (data.notificationType) {
      case NotificationType.addTour: {
        navigate(`${PATH.tourDetail.replace(':id', data.associateId.toString())}`)
        break
      }
      case NotificationType.addReviewForGuide: {
        navigate(`${PATH.guideProfile.replace(':id', data.associateId.toString())}`)
        break
      }
      case NotificationType.addReviewForTour: {
        navigate(`${PATH.tourDetail.replace(':id', data.associateId.toString())}`)
        break
      }
      case NotificationType.bookedTour: {
        navigate(`${PATH.bookings}`)
        break
      }
    }
  }

  return (
    <MenuItem onClick={handleNavigate}>
      <Box
        ref={innerRef}
        className='notification-item'
        sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingY: '0.5rem', width: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '2.5rem',
            height: '2.5rem',
            aspectRatio: 1 / 1,
            fontWeight: '700',
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            borderRadius: '50%',
            color: 'white',
            background: (theme) => theme.palette.secondary.main
          }}
        >
          {data.sender && (data.sender?.fullName || data.sender.email).slice(0, 1)}
          {!data.sender && profile?.email.slice(0, 1)}
        </Box>
        <Box className='notification-item__content' sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography sx={{ fontSize: '14px', maxWidth: '17.5rem' }} noWrap>
            {data.message}
          </Typography>
          <Typography className='notification-item__content-message' sx={{ fontSize: '0.75rem', color: 'grey' }}>
            {getRelativeTime(data.notificationDate)}
          </Typography>
        </Box>
        {!data.isRead && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '0.5rem',
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              background: (theme) => theme.palette.primary.main
            }}
          ></Box>
        )}
      </Box>
    </MenuItem>
  )
}

export default NotificationItem
