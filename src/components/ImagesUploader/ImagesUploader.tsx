import { ChangeEvent, memo } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'
import { Grid } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { ImageWithLink } from 'src/types/tour.type'
import { useTranslation } from 'react-i18next'

type ImagesUploaderProps = {
  images: (string | ImageWithLink)[]
  setImages: (arg: (string | ImageWithLink)[]) => void
}

const ImagesUploader: React.FC<ImagesUploaderProps> = memo(({ images, setImages }: ImagesUploaderProps) => {
  const maxImagesUpload = 5
  const inputId = Math.random().toString(32).substring(2)
  const { t } = useTranslation()

  const handleOnAddImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const files = Array.from(e.target.files).slice(0, maxImagesUpload - images.length)
    const base64Array = await Promise.all(files.map((file) => convertToBase64(file)))

    setImages([...images, ...base64Array])
    e.target.value = ''
  }

  const handleOnRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const getImagePreview = (image: string | ImageWithLink) => {
    return image instanceof Object && 'imageLink' in image ? image.imageLink : image
  }

  return (
    <>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 8, sm: 12, md: 12 }}>
        {images.map((image, i) => (
          <Grid
            item
            xs={2}
            sm={2}
            md={2}
            key={i}
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <IconButton
              aria-label='delete image'
              sx={{
                position: 'absolute',
                top: 20,
                right: -5
              }}
              onClick={() => handleOnRemoveImage(i)}
            >
              <CancelIcon />
            </IconButton>
            <img
              src={getImagePreview(image)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                aspectRatio: '1 / 1'
              }}
              alt=''
              loading='lazy'
            />
          </Grid>
        ))}
      </Grid>
      <label htmlFor={inputId} className='flex items-center gap-3'>
        <Button
          variant='contained'
          disabled={images.length >= maxImagesUpload}
          component='span'
          startIcon={<CloudUploadIcon />}
        >
          {t('pages.guideApplication.uploadImages')}
        </Button>
        <span className='text-sm'> {t('pages.guideApplication.upTo5Images')}</span>
        <input
          id={inputId}
          type='file'
          multiple
          accept='image/*,.png,.jpg,.jpeg,.gif'
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnAddImage(e)}
          style={{ display: 'none' }}
        />
      </label>
    </>
  )
})

ImagesUploader.displayName = 'ImagesUploader'
export default ImagesUploader
