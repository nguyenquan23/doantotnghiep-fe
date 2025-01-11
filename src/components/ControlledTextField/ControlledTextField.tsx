/* eslint-disable @typescript-eslint/no-explicit-any */
import TextField, { TextFieldVariants } from '@mui/material/TextField'
import { HTMLInputTypeAttribute } from 'react'
import { Control, Controller } from 'react-hook-form'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

interface ControlledTextFieldProps {
  name: string
  control: Control<any>
  label?: string
  className?: string
  variant?: TextFieldVariants
  multiline?: boolean
  rows?: number
  fullWidth?: boolean
  type?: HTMLInputTypeAttribute | undefined
  prefix?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
}

export default function ControlledTextField({
  name,
  control,
  label,
  className = 'min-h-20',
  variant = 'outlined',
  multiline = false,
  rows,
  fullWidth = false,
  type = 'text',
  prefix,
  required = false,
  placeholder,
  disabled = false
}: ControlledTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          id={name}
          disabled={disabled}
          label={
            label && (
              <Typography sx={{ fontWeight: 600 }}>
                {label}
                {required && (
                  <Typography component='span' sx={{ color: 'red' }}>
                    {' '}
                    *
                  </Typography>
                )}
              </Typography>
            )
          }
          placeholder={placeholder || ''}
          type={type}
          variant={variant}
          error={!!error}
          fullWidth={fullWidth}
          helperText={error ? error.message : null}
          {...field}
          InputLabelProps={{
            shrink: true
          }}
          onChange={(e) => field.onChange(e)}
          className={className}
          multiline={multiline}
          rows={rows}
          InputProps={
            prefix
              ? {
                  startAdornment: <InputAdornment position='start'>{prefix}</InputAdornment>
                }
              : undefined
          }
        />
      )}
    />
  )
}
