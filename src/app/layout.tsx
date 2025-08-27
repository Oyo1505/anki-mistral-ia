import ButtonsHeader from '@/components/buttons-header';
import './globals.css';
import { ToastContainer } from 'react-toastify';


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <html>
    <body className="my-auto mx-auto w-full p-4 flex flex-col items-center justify-center gap-4 transition-all duration-300 ease-in-out h-screen">
      <ToastContainer position="top-right" />
      <ButtonsHeader />
        {children}
    </body>
  </html>
}
export default RootLayout;