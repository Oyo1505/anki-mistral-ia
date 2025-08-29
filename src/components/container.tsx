const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`w-full h-full md:w-1/2 2xl:w-1/3 mx-auto flex flex-col items-start justify-center gap-4 ${className}`}>
      {children}
    </div>
  )
}

export default Container;