import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' }
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  return (
    <FormControl sx={{ p: 0, width: '70px' }}>
      <Select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value as string)}
        displayEmpty
        sx={{
          boxShadow: 'none',
          '.MuiOutlinedInput-notchedOutline': { border: 0 },
          '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            border: 0
          },
          '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0
          }
        }}
        inputProps={{ 'aria-label': 'Without label' }}
        MenuProps={{ disableScrollLock: true }}
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <img src={`/assets/svg/${language.code}.svg`} className='h-4 w-5' alt={`${language.name} flag`} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
