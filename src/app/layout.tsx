import './globals.css';
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <html>
    <body className='h-screen px-4 flex items-center justify-center'>
      {children}
    </body>
  </html>
}
export default RootLayout;