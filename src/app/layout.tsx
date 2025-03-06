import './globals.css';
import { ToastContainer } from 'react-toastify';


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <html>
    <body className='h-screen px-4 flex items-center justify-center'>
      <ToastContainer position="top-right" />
        {children}
    </body>
  </html>
}
export default RootLayout;