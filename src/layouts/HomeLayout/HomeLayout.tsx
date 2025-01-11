import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface HomeLayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div>
      <Header textColor='white' logoColor='white' />
      {children}
      <Footer />
    </div>
  )
}
