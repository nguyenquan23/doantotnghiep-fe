import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header textColor='black' bgColor='white' />
      {children}
      <Footer />
    </>
  )
}

export default MainLayout
