import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import classNames from 'classnames'
import { memo, useContext, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { Review } from 'src/types/review.type'
import { formatDateLocaleString } from 'src/utils/date-time'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'

interface CommentProps {
  comment: Review
  index: number
  setEditReviewId: (id: number) => void
  onDelete: (id: number) => void
}

const Comment: React.FC<CommentProps> = memo(({ comment, index, setEditReviewId, onDelete }: CommentProps) => {
  const { profile } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [deleteMode, setDeleteMode] = useState<boolean>(false)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const handleEdit = (id: number) => {
    setEditReviewId(id)
    const element = document.getElementById('review-title')
    element?.scrollIntoView({ behavior: 'smooth' })
    handleClose()
  }

  const handleDelete = () => {
    setDeleteMode(true)
    handleClose()
  }

  const handleConfirmDelete = () => {
    onDelete(comment.id)
    setDeleteMode(false)
    const element = document.getElementById('review-title')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='review-card__container flex flex-col gap-2 border-b py-6'>
      <div className='review-card__rating'>
        <Rating max={5} value={comment.rating} readOnly />
      </div>
      <div className='review-card__header flex'>
        <div className='review-card__user-photo mr-4 flex max-w-10'>
          <span
            className={classNames(
              'flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold uppercase text-white',
              {
                'bg-orange-500': index % 2 === 0,
                'bg-blue-500': index % 2 !== 0
              }
            )}
          >
            {comment.traveler.email.slice(0, 1)}
          </span>
        </div>
        <div className='review-card__user-details flex flex-col'>
          <div className='review-card__user-name-address flex gap-2'>
            <span className='user-name text-sm font-semibold'>
              {comment.traveler.fullName || comment.traveler.email}
            </span>
            <span className='text-sm font-semibold '>-</span>
            <span className='user-adrress text-sm font-semibold'>{comment.traveler.address || 'N/A'}</span>
          </div>
          <div className='review-card__user-name-address mt-[-2px] text-slate-500'>
            <span className='user-name text-sm font-semibold capitalize'>
              {formatDateLocaleString(comment.createAt)}
            </span>
          </div>
        </div>
        {profile?.id === comment.traveler.id && (
          <div className='actions ml-auto'>
            <IconButton
              aria-label='more'
              id='long-button'
              size='small'
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup='true'
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              disableScrollLock
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={() => {
                setAnchorEl(null)
              }}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleEdit(comment.id)}>
                <ListItemIcon>
                  <EditIcon fontSize='small' />
                </ListItemIcon>
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleDelete()}>
                <ListItemIcon>
                  <DeleteIcon fontSize='small' />
                </ListItemIcon>
                Delete
              </MenuItem>
            </Menu>
            {deleteMode && (
              <ConfirmDialog
                title='Confirm Delete'
                content='Are you sure want to delete this comment?'
                handleClose={() => setDeleteMode(false)}
                handleConfirm={handleConfirmDelete}
              />
            )}
          </div>
        )}
      </div>
      <div className='review-card__comment'>
        <span>{comment.comment}</span>
      </div>
    </div>
  )
})

Comment.displayName = 'Comment'

export default Comment
