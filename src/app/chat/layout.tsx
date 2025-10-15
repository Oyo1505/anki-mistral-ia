const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full flex justify-center items-start">
      {children}
    </div>
  );
};

export default Layout;
