import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const rootElement = document.getElementById('root')

// Edit this file for custom theme
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1b6bbd',
          light: '#76a6d7',
          dark: '#104071'
        },
        secondary: {
          main: '#ff532c',
          light: '#ff9880',
          dark: '#99321a'
        }
      }
    },
    dark: {
      palette: {}
    }
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          height: '100%'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontWeight: 600
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '&+.MuiDialogContent-root': {
            paddingTop: '20px !important'
          },
          fontWeight: 600,
          borderBottom: '0.5px solid var(--border-primary)'
        }
      }
    },
    MuiDialog: {
      defaultProps: {
        container: rootElement
      }
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement
      }
    }
  }
})

export default theme
