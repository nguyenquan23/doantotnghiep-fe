import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface TabPanelProps {
  children: React.ReactNode
  direction?: string
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

export default TabPanel
