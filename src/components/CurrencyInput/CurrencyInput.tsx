/* eslint-disable @typescript-eslint/no-explicit-any */
import TextField, { TextFieldVariants } from '@mui/material/TextField'
import * as React from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

interface NumericFormatCustomProps {
  name: string
  prefix: string
  value: string
  onChange: (event: { target: { name: string; value: string } }) => void
}

interface CurrencyInputProps {
  name: string
  prefix: string
  value: string
  label: string
  onChange: (name: string, value: string) => void
  variant?: TextFieldVariants
  className?: string
}

const NumericFormatCustom = forwardRef<NumericFormatProps, NumericFormatCustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, prefix, value, ...other } = props

    return (
      <NumericFormat
        value={value}
        prefix={prefix}
        getInputRef={ref}
        {...other}
        onValueChange={(values) => {
          const { floatValue } = values
          if (floatValue !== undefined && floatValue >= 0) {
            onChange({
              target: {
                name: props.name,
                value: values.value
              }
            })
          }
        }}
      />
    )
  }
)

export default function CurrencyInput({
  name,
  prefix,
  value,
  label,
  onChange,
  variant = 'outlined',
  className = ''
}: CurrencyInputProps) {
  const [currentValue, setCurrentValue] = useState<string>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(name, currentValue)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [currentValue, name])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value)
  }

  return (
    <TextField
      id={name}
      name={name}
      label={label}
      value={currentValue}
      onChange={handleChange}
      variant={variant}
      InputProps={{
        inputComponent: NumericFormatCustom as any,
        inputProps: {
          prefix
        }
      }}
      className={className}
    />
  )
}
