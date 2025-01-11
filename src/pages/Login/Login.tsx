/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getFirebaseToken } from 'src/FirebaseConfig'
import authApi from 'src/apis/auth.api'
import userApi from 'src/apis/user.api'
import GoogleIcon from 'src/assets/svg/google.svg'
import ControlledTextField from 'src/components/ControlledTextField'
import config from 'src/constants/config.constant'
import PATH from 'src/constants/path.constant'
import { AppContext } from 'src/contexts/app.context'
import useQueryParams from 'src/hooks/useQueryParams'
import AuthLayout from 'src/layouts/AuthLayout'
import { AuthSuccessResponse, SubscribeTopicSuccessResponse } from 'src/types/auth.type'
import { setAccessTokenToLocalStorage, setProfileToLocalStorage } from 'src/utils/auth'
import http from 'src/utils/http'
import { Schema, schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'email' | 'password'>
const signInSchema = schema.pick(['email', 'password'])

const Login: React.FC = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const { t } = useTranslation()
  const [isOauthTokenExists, setOauthTokenExists] = useState<boolean>(false)
  const queryParams: { token?: string; error?: string } = useQueryParams()
  const navigate = useNavigate()
  const { data: profileData } = useQuery({
    queryKey: [`get me`],
    queryFn: () => userApi.getMe(),
    enabled: isOauthTokenExists
  })
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(signInSchema)
  })

  useEffect(() => {
    if (!queryParams) return

    if (queryParams.token) {
      setAccessTokenToLocalStorage(queryParams.token)
      http.interceptors.request.use((config) => {
        config.headers.authorization = `Bearer ${queryParams.token}`
        return config
      })
      setOauthTokenExists(true)
      return
    }

    if (queryParams.error) toast.error('Access denied.')
  }, [queryParams])

  useEffect(() => {
    if (profileData?.data.data) {
      setIsAuthenticated(true)
      setProfileToLocalStorage(profileData.data.data)
      setProfile(profileData.data.data)
      navigate(PATH.home)
    }
  }, [navigate, profileData, setIsAuthenticated, setProfile])

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })

  const onSubmit = handleSubmit((body) => {
    loginMutation.mutate(body, {
      onSuccess: (data: AxiosResponse<AuthSuccessResponse, any>) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        onSubscribeTopic(data.data.data.user.email)
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      }
    })
  })

  const subscribeTopicMutation = useMutation({
    mutationFn: async (email: string) => {
      const deviceToken = await getFirebaseToken()
      const body = { deviceToken: deviceToken as string, topicName: email }
      return authApi.subscribeTopic(body)
    }
  })

  const onSubscribeTopic = (email: string) => {
    subscribeTopicMutation.mutate(email, {
      onSuccess: (data: AxiosResponse<SubscribeTopicSuccessResponse, any>) => {
        toast.info(data.data.data.message)
      },
      onError: (error: any) => {
        toast.error(error.response.data.message)
      }
    })
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        <div className='form__header flex items-center'>
          <div className='form flex flex-col gap-2 bg-white'>
            <h2 className='uppercase'>{t('pages.authLayout.signIn')}</h2>
            <div className='flex'>
              <span className='text-gray-400'>{t('pages.authLayout.login.haveAccountQuestion')}</span>
              <Link className='ml-1 font-bold text-orange-500' to={PATH.register}>
                {t('pages.authLayout.signUp')}
              </Link>
            </div>
          </div>
        </div>
        <div className='form__inputs mt-4 flex flex-col gap-4'>
          <ControlledTextField control={control} name='email' label={t('pages.authLayout.email')} />
          <ControlledTextField
            control={control}
            type='password'
            name='password'
            label={t('pages.authLayout.password')}
          />
        </div>
        <div className='form__actions flex flex-col gap-4'>
          <div className='flex justify-end'>
            <Link className='ml-1 font-bold text-orange-500' to='/reset'>
              {t('pages.authLayout.login.forgetPassword')}
            </Link>
          </div>
          <LoadingButton
            loading={loginMutation.isPending}
            type='submit'
            variant='contained'
            size='large'
            sx={{ fontWeight: 600 }}
          >
            <span>{t('pages.authLayout.signIn')}</span>
          </LoadingButton>
        </div>
      </form>

      <div className='form__oauth flex flex-col items-center gap-4'>
        <div className='flex w-full items-center gap-4'>
          <div className='block h-[0.5px] w-full border-none bg-gray-400' />
          <p className='whitespace-nowrap	'>{t('pages.authLayout.login.orContinue')}</p>
          <div className='block h-[0.5px] w-full border-none bg-gray-400' />
        </div>

        <div className='buttons flex w-full gap-8'>
          <Button
            type='button'
            variant='outlined'
            className='grow'
            onClick={() => {
              window.location.href = `${config.baseUrl}/oauth2/authorization/google?redirect_uri=${config.frontEndUrl}`
            }}
          >
            <SvgIcon component={GoogleIcon} inheritViewBox className='text-3xl' />
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login
