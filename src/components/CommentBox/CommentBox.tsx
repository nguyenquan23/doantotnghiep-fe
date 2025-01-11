import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, FormHelperText } from '@mui/material'
import Rating from '@mui/material/Rating'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CommentFormData } from 'src/apis/review.api'
import { AppContext } from 'src/contexts/app.context'
import { Review } from 'src/types/review.type'
import { commentSchema } from 'src/utils/rules'
import ControlledTextField from '../ControlledTextField'

interface CommentBoxProps {
  review: Review | undefined
  onSubmit: (data: CommentFormData) => void
  isMutating: boolean
}

const CommentBox: React.FC<CommentBoxProps> = ({ review, onSubmit, isMutating }: CommentBoxProps) => {
  const { profile } = useContext(AppContext)
  const {
    control,
    setValue,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm<CommentFormData>({
    defaultValues: {
      comment: review?.comment || '',
      rating: review?.rating || 0
    },
    resolver: yupResolver(commentSchema)
  })

  useEffect(() => {
    if (review) {
      setValue('comment', review.comment)
      setValue('rating', review.rating)
    }
  }, [review, setValue])

  const handleFormSubmit = (data: CommentFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Box className='comment-box mb-6 flex'>
      <div className='review-card__user-photo mr-4 flex max-w-10'>
        <span className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xl font-bold uppercase text-slate-800'>
          {profile?.email.slice(0, 1)}
        </span>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mb-6 mt-[-6px] flex w-full flex-col gap-2'>
        <ControlledTextField
          fullWidth={true}
          multiline={true}
          rows={4}
          control={control}
          name={'comment'}
          placeholder='Add a comment...'
        />
        <Box className='ml-3 flex flex-col'>
          <Box className='flex flex-col items-center gap-2 md:flex-row'>
            <span>Are you satisfied? Reply 1 ~ 5, 5 being very satisfied: </span>
            <Controller
              name='rating'
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <Rating
                    name='size-large'
                    precision={1}
                    value={Number(value)}
                    onChange={onChange}
                    sx={{
                      alignSelf: 'center',
                      '& .MuiRating-icon': { fontSize: '1.5rem' }
                    }}
                  />
                </>
              )}
            />
          </Box>
          {!!errors.rating && <FormHelperText error>{errors.rating.message}</FormHelperText>}
        </Box>
        <Box className='flex justify-end'>
          <LoadingButton
            loading={isMutating}
            type='submit'
            variant='contained'
            size='large'
            className='w-full self-end md:w-28'
          >
            {review ? 'Edit' : 'Post'}
          </LoadingButton>
        </Box>
      </form>
    </Box>
  )
}

export default CommentBox
