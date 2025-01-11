import { Button } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusRequest } from 'src/enums/status-request.enum'

interface Props {
  setRequestStatus: Dispatch<SetStateAction<StatusRequest>>
  requestStatus: StatusRequest
  currentRequestStatus: StatusRequest
  quantity: number
}

const ButtonComponent: React.FC<Props> = ({
  setRequestStatus,
  requestStatus,
  currentRequestStatus,
  quantity
}: Props) => {
  const { t } = useTranslation()

  return (
    <Button
      onClick={() => setRequestStatus(requestStatus)}
      className='grow'
      size='large'
      sx={{
        ...(currentRequestStatus === requestStatus.toString() && {
          backgroundColor: '#d9e7f4'
        })
      }}
    >
      {t(`enums.statusRequest.${requestStatus.toLocaleUpperCase()}`)}
      <div className='ml-1 text-sm'>({quantity})</div>
    </Button>
  )
}
export default ButtonComponent
