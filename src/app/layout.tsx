import ButtonsHeader from '@/components/buttons-header';
import Container from '@/components/container';
import './globals.css';
import { ToastContainer } from 'react-toastify';


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <html>
    <body className="w-full h-screen p-2">
    <Container className='pt-4 my-auto'>
      <ToastContainer position="top-right" />
      <ButtonsHeader />
        {children}
    </Container>
    </body>
  </html>
}
export default RootLayout;