import { ImageWithLink } from 'src/types/tour.type'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { Box } from '@mui/material'

interface Props {
  itemsData: ImageWithLink[]
}

function SimpleSlider({ itemsData }: Props) {
  return (
    <Box
      sx={{
        padding: '8px'
      }}
    >
      <ImageGallery
        items={
          itemsData && itemsData.length > 0
            ? itemsData.map((item) => {
                return {
                  original: item.imageLink,
                  thumbnail: item.imageLink
                }
              })
            : [
                {
                  original: '/assets/images/default-cover.jpg',
                  thumbnail: '/assets/images/default-cover.jpg'
                }
              ]
        }
        showBullets
        showIndex
        thumbnailPosition='right'
        lazyLoad
      />
    </Box>
  )
}

export default SimpleSlider
