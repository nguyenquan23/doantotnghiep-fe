import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined'
import { Autocomplete, Box, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { SyntheticEvent, useState, useEffect } from 'react'
import addressApi from 'src/apis/address.api'

interface AddressSelectsProps {
  onChange: (province: string, district: string, ward: string) => void
}

const AddressSelects: React.FC<AddressSelectsProps> = ({ onChange }: AddressSelectsProps) => {
  const [province, setProvince] = useState<string | null>(null)
  const [district, setDistrict] = useState<string | null>(null)
  const [ward, setWard] = useState<string | null>(null)
  const [provinceError, setProvinceError] = useState<string>('')
  const [districtError, setDistrictError] = useState<string>('')
  const [wardError, setWardError] = useState<string>('')

  const { data: provincesData } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => addressApi.getProvinces(),
    staleTime: 5 * 1000
  })

  const { data: districtsData } = useQuery({
    queryKey: [`District of ${province}`, province],
    queryFn: () => addressApi.getDistrictsByProvince(province as string),
    enabled: !!province
  })

  const { data: wardsData } = useQuery({
    queryKey: [`Ward of ${district} & ${province}`, district, province],
    queryFn: () => addressApi.getWardByDistrictsProvince(district as string, province as string),
    enabled: !!district && !!province
  })

  useEffect(() => {
    province && district && ward && onChange(province, district, ward)
  }, [province, district, ward, onChange])

  return (
    <>
      <Autocomplete
        disablePortal
        id='province'
        value={province}
        className='w-full flex-grow'
        options={provincesData?.data.data || []}
        sx={{ width: 300 }}
        onChange={(_event: SyntheticEvent<Element, Event>, value: string | null) => {
          setProvince(value)
          if (!value) {
            setDistrict(null)
            setWard(null)
            setProvinceError('Province is required')
            return
          }
          setProvinceError('')
        }}
        renderOption={(props, option) => (
          <Box component='li' {...props}>
            <FmdGoodOutlinedIcon sx={{ mr: 2, flexShrink: 0, color: (theme) => theme.palette.primary.main }} />
            {option}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={<Typography sx={{ fontWeight: 600 }}>Province</Typography>}
            InputLabelProps={{
              shrink: true
            }}
            error={!!provinceError}
            helperText={provinceError}
          />
        )}
      />

      <Autocomplete
        disablePortal
        id='district'
        className='w-full flex-grow'
        options={districtsData?.data.data || []}
        sx={{ width: 300 }}
        onChange={(_event: SyntheticEvent<Element, Event>, value: string | null) => {
          setDistrict(value)
          if (!value) {
            setWard(null)
            setDistrictError('District is required')
            return
          }
          setDistrictError('')
        }}
        renderOption={(props, option) => (
          <Box component='li' {...props}>
            <FmdGoodOutlinedIcon sx={{ mr: 2, flexShrink: 0, color: (theme) => theme.palette.primary.main }} />
            {option}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={<Typography sx={{ fontWeight: 600 }}>District</Typography>}
            InputLabelProps={{
              shrink: true
            }}
            error={!!districtError}
            helperText={districtError}
          />
        )}
      />

      <Autocomplete
        disablePortal
        id='ward'
        className='w-full flex-grow'
        options={wardsData?.data.data || []}
        sx={{ width: 300 }}
        onChange={(_event: SyntheticEvent<Element, Event>, value: string | null) => {
          setWard(value)
          if (!value) {
            setWardError('Ward is required')
            return
          }
          setWardError('')
        }}
        renderOption={(props, option) => (
          <Box component='li' {...props}>
            <FmdGoodOutlinedIcon sx={{ mr: 2, flexShrink: 0, color: (theme) => theme.palette.primary.main }} />
            {option}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={<Typography sx={{ fontWeight: 600 }}>Ward</Typography>}
            InputLabelProps={{
              shrink: true
            }}
            error={!!wardError}
            helperText={wardError}
          />
        )}
      />
    </>
  )
}

export default AddressSelects
