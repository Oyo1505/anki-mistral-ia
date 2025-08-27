const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full h-full  md:w-1/2  2xl:w-2/4 flex justify-center items-center'>
      {children}
    </div>
  )
}

export default Layout;