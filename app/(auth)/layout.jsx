const AuthLayout = ({ children }) => {
  return (
    <div className="md:grid md:grid-cols-12 min-h-screen">
      <div className="col-span-12">{children}</div>
    </div>
  );
};
export default AuthLayout;
