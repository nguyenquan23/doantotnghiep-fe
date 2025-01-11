import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
interface Props {
  to?: string
  icon: React.ReactNode
  text: string
}

export default function NavLink({ to, icon, text }: Props) {
  const location = useLocation()
  const styles = `relative ml-2 flex cursor-pointer flex-col items-center text-base 
    hover:after:w-full md:ml-4 md:after:absolute md:after:bottom-[-4px] md:after:left-0 md:after:h-[2px] 
    md:after:w-0 md:after:bg-orange-500 md:after:transition-all md:after:duration-300`
  const isActive = to && location.pathname.includes(to)

  return (
    <>
      {to ? (
        <Link
          to={to}
          className={classNames(styles, {
            'md:after:w-full': isActive
          })}
        >
          {icon}
          <span className='hidden text-nowrap pt-1 md:block md:text-sm'>{text}</span>
        </Link>
      ) : (
        <div className={styles}>
          {icon}
          <span className='hidden text-nowrap pt-1 md:block md:text-sm'>{text}</span>
        </div>
      )}
    </>
  )
}
