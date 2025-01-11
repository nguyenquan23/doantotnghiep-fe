/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import PATH from 'src/constants/path.constant'
import AuthLayout from 'src/layouts/AuthLayout'
import { Schema, schema } from 'src/utils/rules'

export type ResetPasswordFormData = Pick<Schema, 'email'>
const resetPasswordSchema = schema.pick(['email'])

export default function ResetPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(resetPasswordSchema)
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (formData: ResetPasswordFormData) => authApi.reset(formData)
  })

  const onSubmit = (formData: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(t('pages.authLayout.resetPassword.sendResetLinkSuccess'))
        navigate(PATH.changePasswordByToken)
      },
      onError: (__error) => {
        toast.error(t('pages.authLayout.resetPassword.emailNotSignUp'))
      }
    })
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <div className='flex items-center'>
          <div className='flex flex-col gap-6  bg-white'>
            <h2 className='uppercase'>{t('pages.authLayout.resetPassword.resetPassword')}</h2>
            <div className='text-gray-400'>{t('pages.authLayout.resetPassword.resetPasswordDescription')} </div>
          </div>
        </div>
        <div className='mt-4 flex flex-col gap-6'>
          <Controller
            control={control}
            name='email'
            render={({ field }) => (
              <TextField
                variant='outlined'
                label={t('pages.authLayout.email')}
                className='min-h-20'
                error={!!errors.email?.message}
                helperText={errors.email?.message}
                {...field}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(event) => {
                  field.onChange(event)
                  trigger('email')
                }}
              />
            )}
          />
          <LoadingButton
            loading={resetPasswordMutation.isPending}
            type='submit'
            variant='contained'
            size='large'
            sx={{ fontWeight: 600 }}
          >
            {t('pages.authLayout.resetPassword.sendResetLink')}
          </LoadingButton>
        </div>
      </form>
    </AuthLayout>
  )
}
