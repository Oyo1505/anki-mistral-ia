const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`w-full h-full md:w-1/2 mx-auto ${className}`}>
      {children}
    </div>
  )
}

export default Container;