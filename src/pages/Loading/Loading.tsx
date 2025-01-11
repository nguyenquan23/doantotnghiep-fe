import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/material'

const Loading: React.FC = () => {
  return (
    <Box
      className='h-screen w-full'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default Loading
