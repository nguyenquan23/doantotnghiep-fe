interface ActivityInfoProps {
  icon: JSX.Element
  title: string
  content: string | React.ReactNode
}

export default function ActivityInfo({ icon, title, content }: ActivityInfoProps) {
  return (
    <div>
      <div className='detail-activity grid grid-cols-12'>
        <div className='col-span-1'>
          <span className=''>{icon}</span>
        </div>
        <div className='col-span-11'>
          <p className='font-semibold'>{title}</p>
          <div className='mb-1 text-sm text-[var(--label-secondary)]'>{content}</div>
        </div>
      </div>
    </div>
  )
}
