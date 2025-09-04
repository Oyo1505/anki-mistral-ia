import ButtonsHeader from '@/components/buttons-header';
import Container from '@/components/container';
import { ToastContainer } from 'react-toastify';
import './globals.css';


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <html>
    <body className="w-full h-screen p-2">
    <Container>
      <ToastContainer position="top-right" />
      <ButtonsHeader />
        {children}
    </Container>
    </body>
  </html>
}
export default RootLayout;