import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import ControlledTextField from 'src/components/ControlledTextField'
import { UserSchema, userSchema } from 'src/utils/rules'

type PasswordFormData = Pick<UserSchema, 'password' | 'newPassword'>
type FormData = Pick<UserSchema, 'password' | 'newPassword' | 'confirmPassword'>
const accountSchema = userSchema.pick(['password', 'newPassword', 'confirmPassword'])

export default function ChangePassword() {
  const { t } = useTranslation()
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: ''
    },
    resolver: yupResolver(accountSchema)
  })

  const changePasswordMutation = useMutation({
    mutationFn: (body: PasswordFormData) => userApi.changePassword(body)
  })

  const onSubmit = (data: FormData) => {
    changePasswordMutation.mutate(omit(data, 'confirmPassword'), {
      onSuccess: () => {
        toast.success('Change password successfully.')
        reset()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className='account-profile__header border-b-1 mb-5 border-b-[0.5px] border-solid border-[var(--border-primary)] pb-1'>
        {t('pages.changePassword.changePassword')}
      </h2>
      <div className='mb-4 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <ControlledTextField
          control={control}
          name='password'
          type='password'
          label={t('pages.changePassword.password')}
        />
        <ControlledTextField
          control={control}
          name='newPassword'
          type='password'
          label={t('pages.changePassword.newPassword')}
        />
        <ControlledTextField
          control={control}
          name='confirmPassword'
          type='password'
          label={t('pages.changePassword.confirmPassword')}
        />
      </div>
      <div className='button-container'>
        <LoadingButton type='submit' variant='contained' size='large' className='w-full md:w-32'>
          {t('pages.changePassword.save')}
        </LoadingButton>
      </div>
    </form>
  )
}
