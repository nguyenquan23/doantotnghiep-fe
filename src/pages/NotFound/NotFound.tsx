/* eslint-disable react/no-unescaped-entities */
const NotFound: React.FC = () => {
  return (
    <div className='grow'>
      <div className='page_not_found__container flex min-h-[535px] min-w-80 flex-col justify-center gap-2 px-4 py-10 text-center md:m-auto lg:w-full lg:max-w-[1400px] xl:px-[72px]'>
        <img src='/assets/images/not-found.png' alt='Not Found Page' className='mx-auto h-52 w-52 object-cover' />
        <h2>Lost your way? Not found</h2>
        <p>It seems the page you're looking for isn't here. The page was not found</p>
      </div>
    </div>
  )
}

export default NotFound
